import {
  arePlayersTheSame,
  challengerToPlayer,
  opponentToPlayer,
  Players,
} from "../../model";
import {
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  valid,
  Validation,
} from "../../validation";
import { CreateGameInput } from "../accept-challenge";

export const createPlayers = (
  input: CreateGameInput
): Validation<Players, InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challenger },
    opponent,
  } = input;

  const players: Players = [challengerToPlayer(challenger), opponentToPlayer(opponent)];
  return arePlayersTheSame(players) ? failWithInvalidPlayers(input) : valid(players);
};

export const invalidPlayers = invalidInput("Games cannot contain duplicated players");
export const failWithInvalidPlayers = failWithInvalidInput(invalidPlayers);