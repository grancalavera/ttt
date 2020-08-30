import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalGameOpponentError, TooManyActiveMatchesError } from "../domain/error";
import { Match } from "../domain/model";
import { domainFailure } from "../domain/result";
import { arePlayersTheSame, CreateGameWorkflow } from "./support";

export const createGame: CreateGameWorkflow = (dependencies) => async (input) => {
  const { countActiveMatches, maxActiveMatches, upsertMatch } = dependencies;
  const { matchDescription: description, challenge, opponent } = input;

  const activeMatches = await countActiveMatches(opponent);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(opponent, maxActiveMatches)]);
  }

  if (arePlayersTheSame(description.owner, opponent)) {
    return failure([new IllegalGameOpponentError(description.id, opponent)]);
  }

  const match: Match = {
    matchDescription: description,
    matchState: {
      kind: "Game",
      players: [challenge.move[0], opponent],
      moves: [challenge.move],
      next: opponent,
    },
  };

  const upsertResult = await upsertMatch(match);

  return isSuccess(upsertResult) ? success(match) : domainFailure(upsertResult);
};
