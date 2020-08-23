import {
  allow,
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
} from "../../../../ttt-etc/dist";
import { CreateMoveInput } from "./workflow";
import { arePlayersTheSame } from "../support";

export const validateIsPlayersTurn = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  const { game } = input;
  const shouldAllow =
    game.status.kind === "OpenGame" && arePlayersTheSame(input.player, game.status.next);
  return shouldAllow ? allow : failWithInvalidTurn(input);
};

export const invalidTurn = invalidInput("Invalid turn: not this player's turn");
export const failWithInvalidTurn = failWithInvalidInput(invalidTurn);
