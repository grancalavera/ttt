import { Game, GameState, Player } from "model";
import { validateGame } from "validate-game";
import * as v from "validation/core";
import { GameValidationError } from "validate-game/types";
import { winner } from "./winners";

export const state = (g: Game): GameState => {
  const gameValidation = validateGame(g);

  if (!v.isValid(gameValidation)) {
    throw new GameValidationError(
      "Unable to compute game state from invalid game",
      gameValidation
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
