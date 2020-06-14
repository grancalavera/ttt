import { arePlayersTheSame_c, CreateMoveInput } from "../../model";
import {
  allow,
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  Validation,
} from "../../validation";

export const validatePlayerExistsInGame = (
  input: CreateMoveInput
): Validation<void, InvalidInput<CreateMoveInput>> => {
  const { player, game } = input;
  const exists = game.players.some(arePlayersTheSame_c(player));
  return exists ? allow : failWithInvalidPlayer(input);
};

export const invalidPlayer = invalidInput(
  "Trying to play with a player that doesn't exist in the game "
);

export const failWithInvalidPlayer = failWithInvalidInput(invalidPlayer);
