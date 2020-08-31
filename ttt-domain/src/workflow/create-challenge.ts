import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalChallengerError } from "../domain/error";
import { Match } from "../domain/model";
import { domainFailure } from "../domain/result";
import { arePlayersTheSame, CreateChallengeWorkflow } from "./support";

export const createChallenge: CreateChallengeWorkflow = (dependencies) => async (
  input
) => {
  const { upsertMatch } = dependencies;
  const { matchDescription: description, move } = input;
  const [challenger] = move;

  if (!arePlayersTheSame(description.owner, challenger)) {
    return failure([new IllegalChallengerError(description, challenger)]);
  }

  const match: Match = {
    matchDescription: description,
    matchState: { kind: "Challenge", move },
  };
  const upsertResult = await upsertMatch(match);

  return isSuccess(upsertResult) ? success(match) : domainFailure(upsertResult);
};
