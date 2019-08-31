import {
  assertNever,
  coerce,
  coerceToGameState,
  coerceToMove,
  coerceToPlayer,
  CoreGamePlaying,
  CoreMove,
  CORE_GAME_OVER_TIE,
  CORE_GAME_OVER_WIN,
  CORE_GAME_PLAYING,
  createGame,
  findWin,
  isPosTaken,
  nextPlayer,
  resolveGame
} from "@grancalavera/ttt-core";
import express, { Response } from "express";
import { Transaction } from "sequelize/types";
import { ErrorCode, ErrorResponse, GameResponse, MovesResponse } from "./model";
import { GameModel, MoveModel, toUnsafeMove, store } from "./store";

const app = express();
app.use(express.json());

const port = 5000;

const coerceToUUID = coerce(
  (x: any): x is string => typeof x === "string",
  discarded => `type coercion for UUID failed: ${discarded} is not a string`
);

const commitMove = (gameId: string, game: CoreGamePlaying, move: CoreMove) => {
  const [player, position] = move;
  return store.transaction(transaction =>
    MoveModel.create({ player, position, gameId }, { transaction })
      .then(() => {
        const moves = [move, ...game.moves];
        const result = resolveGame(moves);

        let update: any = { status: result.kind };
        switch (result.kind) {
          case CORE_GAME_OVER_WIN:
            update.nextPlayer = null;
            update.winner = result.winner;
            break;
          case CORE_GAME_OVER_TIE:
            update.nextPlayer = null;
            break;
          case CORE_GAME_PLAYING:
            update.nextPlayer = nextPlayer(moves);
            break;
          default:
            assertNever(result);
        }

        return GameModel.update(update, { where: { id: gameId }, transaction });
      })
      .then(([count]) => {
        if (count === 1) {
          return findGameById(gameId, transaction);
        } else {
          throw new Error("Failed to commit move: updated more rows than required");
        }
      })
      .then(model => {
        return gameResponseFromModel(model!);
      })
      .catch(e => {
        transaction.rollback();
        throw new Error(e.message || e);
      })
  );
};

const gameResponseFromModel = (gameModel: GameModel): GameResponse => {
  const id = gameModel.id.toString();
  const kind = coerceToGameState(gameModel.status);
  const moves = gameModel.moves.map(({ player, position }) =>
    coerceToMove([player, position])
  );

  switch (kind) {
    case CORE_GAME_PLAYING:
      const currentPlayer = coerceToPlayer(gameModel.nextPlayer);
      return { id, game: { kind, currentPlayer, moves } };
    case CORE_GAME_OVER_TIE:
      return { id, game: { kind, moves } };
    case CORE_GAME_OVER_WIN:
      const winner = coerceToPlayer(gameModel.winner);
      const winningMove = findWin(winner, moves)!;
      return { id, game: { kind, moves, winner, winningMove } };
    default:
      return assertNever(kind);
  }
};

const catchAndFail = (status: number, res: Response) => (e: Error) => {
  console.log(e.message);
  console.log(e.stack);
  res.status(status);
  res.json({ message: e.message });
};

const badRequest = (status: number, code: ErrorCode) => (
  res: Response,
  context: any = {}
) => {
  const errorResponse: ErrorResponse = {
    code,
    message: code.valueOf(),
    context
  };
  res.status(status).send(errorResponse);
};

const gameNotFound = badRequest(404, ErrorCode.NotFound);

const gameOver = badRequest(400, ErrorCode.GameOver);
const wrongTurn = badRequest(400, ErrorCode.WrongTurn);
const wrongMove = badRequest(400, ErrorCode.WrongMove);
const invalidMove = badRequest(400, ErrorCode.InvalidMove);

const findGameById = (id: string, transaction?: Transaction): Promise<GameModel | null> =>
  GameModel.findOne({
    where: { id },
    include: [{ model: MoveModel, as: "moves" }],
    transaction
  });

app.get("/ttt/", (_req, res) => {
  GameModel.findAll({
    include: [{ model: MoveModel, as: "moves" }]
  })
    .then(games => res.json(games.map(gameResponseFromModel)))
    .catch(catchAndFail(500, res));
});

app.post("/ttt/", (req, res) => {
  let id: string;
  try {
    id = coerceToUUID(req.body.id);
  } catch (e) {
    catchAndFail(400, res)(e);
    return;
  }

  const { kind: status, moves, currentPlayer: nextPlayer } = createGame();
  GameModel.create(
    { id, nextPlayer, status, moves },
    { include: [{ model: MoveModel, as: "moves" }] }
  ).then(g => {
    return res.json(gameResponseFromModel(g));
  });
});

app.get("/ttt/:id", (req, res) => {
  const id = req.params.id;
  findGameById(id)
    .then(game => {
      if (game) {
        res.send(gameResponseFromModel(game));
      } else {
        gameNotFound(res, { gameId: id });
      }
    })
    .catch(catchAndFail(500, res));
});

app.get("/ttt/:id/moves", (req, res) => {
  const id = req.params.id;
  MoveModel.findAll({
    where: {
      gameId: id
    }
  })
    .then(moves => {
      const movesResponse: MovesResponse = {
        id: id,
        moves: moves.map(toUnsafeMove).map(coerceToMove)
      };
      res.json(movesResponse);
    })
    .catch(catchAndFail(500, res));
});

app.post("/ttt/:id/moves", async (req, res) => {
  const id = coerceToUUID(req.params.id);
  const maybePlayer: string = req.body.player;
  const maybePosition: number = parseInt(req.body.position, 10);
  const gameModel = await findGameById(id);

  if (!gameModel) {
    gameNotFound(res, { gameId: id });
    return;
  }

  const gameResponse = gameResponseFromModel(gameModel);
  const { game } = gameResponse;

  switch (game.kind) {
    case CORE_GAME_OVER_TIE:
    case CORE_GAME_OVER_WIN:
      gameOver(res, { gameId: id });
      return;
    case CORE_GAME_PLAYING:
      let move: CoreMove;

      try {
        move = coerceToMove([maybePlayer, maybePosition]);
      } catch (e) {
        invalidMove(res, { move: [maybePlayer, maybePosition] });
        return;
      }

      const [player, position] = move;

      if (game.currentPlayer !== player) {
        wrongTurn(res, { gameId: id, player });
        return;
      }

      if (isPosTaken(position, game.moves)) {
        wrongMove(res, { gameId: id, position });
        return;
      }

      try {
        const newGameResponse = await commitMove(id, game, move);
        res.json(newGameResponse);
        return;
      } catch (e) {
        catchAndFail(500, res)(e);
        return;
      }

    default:
      assertNever(game);
  }
});

store.sync().then(() => {
  app.listen(port, () => {
    console.log(`server started at  http://localhost:${port}`);
  });
});
