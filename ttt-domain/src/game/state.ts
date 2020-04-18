import { Game, GameState, WonGame, DrawGame, OpenGame, Player } from "model";
import { validGame } from "validation";
import { winner } from "./winners";

export const state = (g: Game): Result<GameState, string> => {
  if (!validGame(g)) {
    return failure("invalid game");
  }

  const w = winner(g.size, g.moves);

  if (w) {
    const s: WonGame = { kind: "WonGame", winner: w };
    return ok(s);
  }

  if (g.moves.length === g.size * g.size) {
    const s: DrawGame = { kind: "DrawGame" };
    return ok(s);
  }

  const s: OpenGame = { kind: "OpenGame", next: next(g) };
  return ok(s);
};

const next = (g: Game): Player => {
  const [p1, p2] = g.players;
  if (g.moves.length === 0) {
    return p1;
  }
  const [[last]] = g.moves.reverse();
  return last === p1 ? p2 : p1;
};

const OK = "RESULT_OK";
const FAILURE = "RESULT_FAILURE";

export type Result<Success, Failure> = Ok<Success> | Err<Failure>;
type Ok<Success> = { kind: typeof OK; value: Success };
type Err<Failure> = { kind: typeof FAILURE; failure: Failure };

export const ok = <Success, Failure>(result: Success): Result<Success, Failure> => ({
  kind: OK,
  value: result,
});

export const failure = <Success, Failure>(
  failure: Failure
): Result<Success, Failure> => ({
  kind: FAILURE,
  failure,
});
