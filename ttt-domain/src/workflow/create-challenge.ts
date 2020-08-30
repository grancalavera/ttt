import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalChallengerError, TooManyActiveMatchesError } from "../domain/error";
import { Match } from "../domain/model";
import { domainFailure } from "../domain/result";
import { arePlayersTheSame, CreateChallengeWorkflow } from "./support";

export const createChallenge: CreateChallengeWorkflow = (dependencies) => async (
  input
) => {
  const { upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;
  const { matchDescription, move } = input;
  const [challenger] = move;

  const activeMatches = await countActiveMatches(challenger);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(challenger, maxActiveMatches)]);
  }

  if (!arePlayersTheSame(matchDescription.owner, challenger)) {
    return failure([new IllegalChallengerError(matchDescription, challenger)]);
  }

  const challengeMatch: Match = {
    ...matchDescription,
    state: { kind: "Challenge", move },
  };

  const upsertResult = await upsertMatch(challengeMatch);

  return isSuccess(upsertResult) ? success(challengeMatch) : domainFailure(upsertResult);
};
