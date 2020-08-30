import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { TooManyActiveMatchesError } from "../domain/error";
import { Match, New } from "../domain/model";
import { CreateMatchWorkflow } from "./support";

export const createMatch: CreateMatchWorkflow = (dependencies) => async (input) => {
  const { getUniqueId, upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;
  const { owner } = input;

  const activeMatches = await countActiveMatches(owner);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(owner, maxActiveMatches)]);
  }

  const match: Match = {
    id: getUniqueId(),
    owner,
    state: applyStateTransition(),
  };

  const result = await upsertMatch(match);
  return isSuccess(result) ? success(match) : failure([result.error]);
};

const applyStateTransition = (): New => ({ kind: "New" });
