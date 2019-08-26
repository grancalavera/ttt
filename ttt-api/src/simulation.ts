import fetch from "isomorphic-fetch";
import {
  shuffle,
  CorePosition,
  CorePlayer,
  assertNever,
  coerceToPosition,
  renderGame
} from "@grancalavera/ttt-core";
import uuid from "uuid/v4";
import { GameResponse } from "./model";
const baseUrl = "http://localhost:5000/ttt";

const createGame = async (id: string): Promise<GameResponse> => {
  let res: GameResponse = await fetch(baseUrl, {
    body: JSON.stringify({ id }),
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
  return res;
};

const createMove = async (
  id: string,
  player: CorePlayer,
  position: CorePosition
): Promise<GameResponse> => {
  const res: GameResponse = await fetch(`${baseUrl}/${id}/moves`, {
    body: JSON.stringify({ player, position }),
    method: "post",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => {
    if (r.status === 200) {
      return r.json();
    } else if (r.status === 400) {
      return Promise.reject("retry");
    } else {
      return Promise.reject("fatal");
    }
  });
  return res;
};

const playMove = async (id: string, player: CorePlayer): Promise<GameResponse> => {
  const position: CorePosition = coerceToPosition(
    shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8])[0]
  );
  console.log(`play ${player} at ${position}`);

  try {
    return await createMove(id, player, position);
  } catch (e) {
    if (e === "retry") {
      console.log("INVALID MOVE, RETRYING");
      return playMove(id, player);
    } else {
      throw new Error(`failed to play move, error: ${e.message || e}`);
    }
  }
};

const playGame = async (res: GameResponse): Promise<void> => {
  switch (res.game.kind) {
    case "CoreGamePlaying":
      const newRes = await playMove(res.id, res.game.currentPlayer);
      return playGame(newRes);
    case "CoreGameOverWin":
      console.log(`game over: the ${res.game.winner}'s win!`);
      console.log(renderGame(res.game.moves));
      return;
    case "CoreGameOverTie":
      console.log("game over: draw");
      console.log(renderGame(res.game.moves));
      return;
    default:
      assertNever(res.game);
  }
};

const sleep = async (t = 1000) => {
  console.log(`sleeping for ${t} milliseconds`);
  return new Promise(res => setTimeout(res, t));
};

(async () => {
  await sleep();
  const res = await createGame(uuid());
  await playGame(res);
})();
