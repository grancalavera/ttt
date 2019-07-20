import express, { Response } from "express";
import { store, GameModel, MoveModel } from "./store";
import * as ttt from "@grancalavera/ttt-core";
import {
  Moves,
  Player,
  isPlayer,
  isPos,
  GameResult,
  Move,
  Pos
} from "@grancalavera/ttt-core";

const app = express();
app.use(express.json());

const port = 5000;

type APIGameStatus = GameResult["kind"];

interface APIGame {
  gameId: number;
  status: APIGameStatus;
  moves: Moves;
  winner?: Player;
  nextPlayer: Player;
}

const commitMove = (game: GameModel, player: Player, pos: Pos) =>
  store.transaction(transaction =>
    MoveModel.create(
      { player: player, position: pos, gameId: game.id },
      { transaction }
    ).then(() => {
      const moves: Moves = [[player, pos], ...movesFromModel(game.moves)];
      const nextPlayer = ttt.nextPlayer(moves);
      const result = ttt.resolveGame(moves);
      const status = result.kind;
      if (result.kind === "winner") {
        const winner = result.winner;
        return GameModel.update(
          { nextPlayer: null, status, winner },
          { where: { id: game.id }, transaction }
        );
      } else {
        return GameModel.update(
          { nextPlayer, status },
          { where: { id: game.id }, transaction }
        );
      }
    })
  );

const makeValidMove = (player: string, position: number): Move => {
  if (isPlayer(player) && isPos(position)) {
    return [player, position];
  } else {
    let message = "failed parsing moves: ";
    message += isPlayer(player) ? "" : `invalid player "${player}" `;
    message += isPos(position) ? "" : `invalid pos "${position}"`;
    throw new Error(message);
  }
};

const movesFromModel = (moves: MoveModel[]): Moves =>
  moves.map(({ player, position }) => makeValidMove(player, position));

const apiGameFromModel = (g: GameModel): APIGame => {
  const moves: Moves = movesFromModel(g.moves);
  const nextPlayer = g.nextPlayer as Player;
  const status = g.status as APIGameStatus;
  const winner: Player | undefined = g.winner ? (g.winner as Player) : undefined;
  const game: APIGame = { gameId: g.id, moves, nextPlayer, status };
  return winner ? { ...game, winner } : game;
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

const findGameById = (id: number): Promise<GameModel | null> =>
  GameModel.findOne({
    where: { id },
    include: [{ model: MoveModel, as: "moves" }]
  });

app.get("/ttt/", (_req, res) => {
  GameModel.findAll({
    include: [{ model: MoveModel, as: "moves" }]
  })
    .then(games => res.json(games.map(apiGameFromModel)))
    .catch(catchAndFail(500, res));
});

app.post("/ttt/", (_req, res) => {
  const { nextPlayer, result } = ttt.createGame();
  const status = result.kind;
  const moves: MoveModel[] = [];
  GameModel.create(
    { nextPlayer, status, moves },
    { include: [{ model: MoveModel, as: "moves" }] }
  ).then(g => {
    return res.json(apiGameFromModel(g));
  });
});

app.get("/ttt/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  findGameById(gameId)
    .then(game => {
      if (game) {
        res.send(apiGameFromModel(game));
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
      res.json({ gameId, moves: movesFromModel(moves) });
    })
    .catch(catchAndFail(500, res));
});

app.post("/ttt/:gameId/moves", (req, res) => {
  const gameId = req.params.gameId;

  const maybePlayer: string = req.body.player!;
  const maybePos: number = parseInt(req.body.position!, 10);

  findGameById(gameId)
    .then(game => {
      if (game) {
        const apiGame = apiGameFromModel(game);

        // validate status === 'open'
        if (apiGame.status !== "open") {
          gameOver(res, { gameId });
          return;
        }

        // validate move
        const [player, pos] = makeValidMove(maybePlayer, maybePos);

        // validate nextPlayer
        if (apiGame.nextPlayer !== player) {
          wrongTurn(res, { gameId, player });
          return;
        }

        // validate pos is not taken
        if (ttt.isPosTaken(pos, apiGame.moves)) {
          wrongMove(res, { gameId, position: pos });
          return;
        }

        commitMove(game, player, pos)
          .then(() => {
            findGameById(gameId).then(updatedGame => {
              if (updatedGame) {
                res.json(apiGameFromModel(updatedGame));
              } else {
                gameNotFound(res, { gameId });
              }
            });
          })
          .catch(catchAndFail(500, res));
      } else {
        gameNotFound(res, { gameId });
      }
    })
    .catch(catchAndFail(500, res));
});

store.sync().then(() => {
  app.listen(port, () => {
    console.log(`server started at  http://localhost:${port}`);
  });
});
