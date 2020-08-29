import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match, New } from "../domain/model";
import { CreateMatchWorkflow } from "./support";
import { TooManyActiveMatchesError } from "./workflow-error";

export const createMatch: CreateMatchWorkflow = (dependencies) => async (player) => {
  const { getUniqueId, upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;

  const activeMatches = await countActiveMatches(player);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(player, maxActiveMatches)]);
  }

  const match: Match = {
    id: getUniqueId(),
    owner: player,
    state: applyStateTransition(),
  };

  const result = await upsertMatch(match);
  return isSuccess(result) ? success(match) : failure([result.error]);
};

const applyStateTransition = (): New => ({ kind: "New" });
