import {
  arePlayersTheSame,
  challengerToPlayer,
  CreateGameInput,
  opponentToPlayer,
  Players,
} from "model";
import { invalidInput, InvalidInput, valid, Validation } from "validation";

export const createPlayers = (
  input: CreateGameInput
): Validation<Players, InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challenger },
    opponent,
  } = input;

  const players: Players = [challengerToPlayer(challenger), opponentToPlayer(opponent)];
  return arePlayersTheSame(players) ? invalidPlayers(input) : valid(players);
};

export const invalidPlayers = invalidInput("Games cannot contain duplicated players");
