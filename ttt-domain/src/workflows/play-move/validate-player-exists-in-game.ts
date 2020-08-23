import {
  allow,
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
} from "../../../../ttt-etc/dist";
import { CreateMoveInput } from "./workflow";
import { arePlayersTheSame } from "../support";

export const validatePlayerExistsInGame = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  const { player, game } = input;
  const exists = game.players.some((candidate) => arePlayersTheSame(player, candidate));
  return exists ? allow : failWithInvalidPlayer(input);
};

export const invalidPlayer = invalidInput(
  "Trying to play with a player that doesn't exist in the game "
);

export const failWithInvalidPlayer = failWithInvalidInput(invalidPlayer);
