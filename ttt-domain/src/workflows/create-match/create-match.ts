import { failure, isSuccess, success, sequence } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { TooManyActiveMatchesError } from "../support";
import { CreateMatchWorkflow } from "./workflow";

export const createMatchWorkflow: CreateMatchWorkflow = (dependencies) => async (
  player
) => {
  const { getUniqueId, upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;

  const activeMatches = await countActiveMatches(player);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(player, maxActiveMatches)]);
  }

  const match: Match = { id: getUniqueId(), owner: player, state: { kind: "New" } };
  const result = await upsertMatch(match);
  return isSuccess(result) ? success(match) : failure([result.error]);
};
