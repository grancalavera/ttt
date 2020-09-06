import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalGameOpponentError } from "../domain/error";
import { Match } from "../domain/model";
import { domainFailure } from "../domain/result";
import { CreateGameWorkflow } from "./support";

export const createGame: CreateGameWorkflow = (dependencies) => async (input) => {
  const { upsertMatch } = dependencies;
  const { matchDescription, challenge, opponent } = input;

  if (matchDescription.owner.id === opponent.id) {
    return failure([new IllegalGameOpponentError(matchDescription.id, opponent)]);
  }

  const match: Match = {
    ...matchDescription,
    state: {
      kind: "Game",
      players: [challenge.move[0], opponent],
      moves: [challenge.move],
      next: opponent,
    },
  };

  const upsertResult = await upsertMatch(match);

  return isSuccess(upsertResult) ? success(match) : domainFailure(upsertResult);
};
