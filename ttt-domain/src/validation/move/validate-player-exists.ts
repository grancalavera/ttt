import { Player, Players } from "model";
import * as result from "validation-result";
import { ValidationResult } from "validation-result";
import { InvalidPlayer } from "validation-result/types";

export const validatePlayerExists = (
  players: Players,
  player: Player
): ValidationResult<InvalidPlayer> => {
  const valid = players.includes(player);
  return valid ? result.valid() : result.invalidPlayer(players, player);
};
