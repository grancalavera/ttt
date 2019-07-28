import express, { Response } from "express";
import { Transaction } from "sequelize/types";

import {
  coerceToGameState,
  coerceToMove,
  coerceToPlayer,
  createGame,
  findWin,
  Game,
  GAME_OVER_TIE,
  GAME_OVER_WIN,
  GAME_PLAYING,
  GamePlaying,
  isPosTaken,
  Move,
  nextPlayer,
  resolveGame
} from "@grancalavera/ttt-core";

import { GameModel, MoveModel, store, toUnsafeMove } from "./store";

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}

const app = express();
app.use(express.json());

const port = 5000;

export interface GameResponse {
  id: string;
  game: Game;
}

const commitMove = (gameId: number, game: GamePlaying, move: Move) => {
  const [player, position] = move;
  return store.transaction(transaction =>
    MoveModel.create({ player, position, gameId }, { transaction })
      .then(() => {
        const moves = [move, ...game.moves];
        const result = resolveGame(moves);

        let update: any = { status: result.kind };
        switch (result.kind) {
          case GAME_OVER_WIN:
            update.nextPlayer = null;
            update.winner = result.winner;
            break;
          case GAME_OVER_TIE:
            update.nextPlayer = null;
            break;
          case GAME_PLAYING:
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
    case GAME_PLAYING:
      const currentPlayer = coerceToPlayer(gameModel.nextPlayer);
      return { id, game: { kind, currentPlayer, moves } };
    case GAME_OVER_TIE:
      return { id, game: { kind, moves } };
    case GAME_OVER_WIN:
      const winner = coerceToPlayer(gameModel.winner);
      // TODO: persist winning move
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

const badRequest = (status: number, message: string) => (res: Response, context: any) =>
  res.status(status).send({ message, context });

const gameNotFound = badRequest(404, "the requested game does not exist");

const gameOver = badRequest(400, "the requested game is over");
const wrongTurn = badRequest(400, "wrong player: not this player's turn");
const wrongMove = badRequest(400, "wrong move: position already taken");
const invalidMove = badRequest(
  400,
  "invalid move: either the Player or the Position are invalid"
);

const findGameById = (id: number, transaction?: Transaction): Promise<GameModel | null> =>
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

app.post("/ttt/", (_req, res) => {
  const { kind: status, moves, currentPlayer: nextPlayer } = createGame();
  GameModel.create(
    { nextPlayer, status, moves },
    { include: [{ model: MoveModel, as: "moves" }] }
  ).then(g => {
    return res.json(gameResponseFromModel(g));
  });
});

app.get("/ttt/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  findGameById(gameId)
    .then(game => {
      if (game) {
        res.send(gameResponseFromModel(game));
      } else {
        gameNotFound(res, { gameId });
      }
    })
    .catch(catchAndFail(500, res));
});

app.get("/ttt/:gameId/moves", (req, res) => {
  const gameId = req.params.gameId;
  MoveModel.findAll({
    where: {
      gameId
    }
  })
    .then(moves => {
      res.json({ gameId, moves: moves.map(toUnsafeMove).map(coerceToMove) });
    })
    .catch(catchAndFail(500, res));
});

app.post("/ttt/:gameId/moves", async (req, res) => {
  const gameId: number = parseInt(req.params.gameId, 10);
  const maybePlayer: string = req.body.player;
  const maybePosition: number = parseInt(req.body.position, 10);
  const gameModel = await findGameById(gameId);

  if (!gameModel) {
    gameNotFound(res, { gameId });
    return;
  }

  const gameResponse = gameResponseFromModel(gameModel);
  const { game } = gameResponse;

  switch (game.kind) {
    case GAME_OVER_TIE:
    case GAME_OVER_WIN:
      gameOver(res, { gameId });
      return;
    case GAME_PLAYING:
      let move: Move;

      try {
        move = coerceToMove([maybePlayer, maybePosition]);
      } catch (e) {
        invalidMove(res, { move: [maybePlayer, maybePosition] });
        return;
      }

      const [player, position] = move;

      if (game.currentPlayer !== player) {
        wrongTurn(res, { gameId, player });
        return;
      }

      if (isPosTaken(position, game.moves)) {
        wrongMove(res, { gameId, position });
        return;
      }

      try {
        const newGameResponse = await commitMove(gameId, game, move);
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
