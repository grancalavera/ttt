import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalChallengerError } from "../domain/error";
import { Match } from "../domain/model";
import { domainFailure } from "../domain/result";
import { CreateChallengeWorkflow } from "./support";

export const createChallenge: CreateChallengeWorkflow = (dependencies) => async (
  input
) => {
  const { upsertMatch } = dependencies;
  const { matchDescription, move } = input;
  const [challenger] = move;

  if (matchDescription.owner.id !== challenger.id) {
    return failure([new IllegalChallengerError(matchDescription, challenger)]);
  }

  const match: Match = {
    ...matchDescription,
    state: { kind: "Challenge", move },
  };
  const upsertResult = await upsertMatch(match);

  return isSuccess(upsertResult) ? success(match) : domainFailure(upsertResult);
};
