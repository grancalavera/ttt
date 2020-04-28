import { Game, GameState, Player } from "model";
import { isValid } from "validation";
import { GameValidationError, validate } from "./validation";
import { winner } from "./winners";

export const state = (g: Game): GameState => {
  const validation = validate(g);

  if (!isValid(validation)) {
    throw new GameValidationError(
      "Unable to compute game state from invalid game",
      validation
    );
  }

  const w = winner(g.size, g.moves);

  if (w) {
    return { kind: "WonGame", winner: w };
  }

  if (g.moves.length === g.size * g.size) {
    return { kind: "DrawGame" };
  }

  return { kind: "OpenGame", next: next(g) };
};

const next = (g: Game): Player => {
  const [p1, p2] = g.players;
  if (g.moves.length === 0) {
    return p1;
  }
  const [[last]] = g.moves.reverse();
  return last === p1 ? p2 : p1;
};
