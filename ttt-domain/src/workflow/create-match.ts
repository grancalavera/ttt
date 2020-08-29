import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { GameSettings, Match, New, Player } from "../domain/model";
import { CountActiveMatches, CreateWorkflow, GetUniqueId, UpsertMatch } from "./support";
import { TooManyActiveMatchesError } from "./workflow-error";

export type Dependencies = GameSettings & CountActiveMatches & GetUniqueId & UpsertMatch;
export type Input = Player;
type Workflow = CreateWorkflow<Dependencies, Input>;

export const createMatch: Workflow = (dependencies) => async (player) => {
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
