import { Players } from "../../domain/model";
import {
  failWithInvalidInput,
  InvalidInput,
  invalidInput,
  valid,
  Validation,
} from "../../../../ttt-etc/dist";
import { CreateGameInput } from "./workflow";
import { arePlayersTheSame, challengerToPlayer, opponentToPlayer } from "../support";

export const createPlayers = (
  input: CreateGameInput
): Validation<Players, InvalidInput<CreateGameInput>> => {
  const {
    challenge: { challenger },
    opponent,
  } = input;

  const players: Players = [challengerToPlayer(challenger), opponentToPlayer(opponent)];
  const [p1, p2] = players;
  return arePlayersTheSame(p1, p2) ? failWithInvalidPlayers(input) : valid(players);
};

export const invalidPlayers = invalidInput("Games cannot contain duplicated players");
export const failWithInvalidPlayers = failWithInvalidInput(invalidPlayers);
