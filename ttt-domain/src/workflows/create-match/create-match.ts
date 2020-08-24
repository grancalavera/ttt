import { CreateMatchWorkflow, TooManyActiveMatchesError } from "./workflow";
import { failure, success, isFailure, isSuccess } from "@grancalavera/ttt-etc";
import { UnknownError } from "../support";
import { Match } from "../../domain/model";

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
