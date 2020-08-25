import { Match, Player, SystemConfig } from "../../domain/model";
import {
  AsyncWorkflowResult,
  CountActiveMatches,
  GetUniqueId,
  UpsertMatch,
} from "../support";

export type CreateMatchWorkflow = (
  dependencies: SystemConfig & CountActiveMatches & GetUniqueId & UpsertMatch
) => CreateMatch;

export type CreateMatch = (input: Player) => AsyncWorkflowResult<Match>;
