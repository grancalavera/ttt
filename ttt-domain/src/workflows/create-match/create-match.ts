import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { CreateMatchWorkflow, TooManyActiveMatchesError } from "./workflow";

export const createMatchWorkflow: CreateMatchWorkflow = (dependencies) => async (
  player
) => {
  const { getUniqueId, upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;

  const match: Match = { id: getUniqueId(), owner: player, state: { kind: "New" } };

  const activeMatches = await countActiveMatches(player);

  if (maxActiveMatches <= activeMatches) {
    return failure(new TooManyActiveMatchesError(player, maxActiveMatches));
  }

  const result = await upsertMatch(match);

  return isSuccess(result) ? success(match) : result;
};
