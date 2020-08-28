import { GameSettings, Player } from "../../domain/model";
import { CountActiveMatches, GetUniqueId, UpsertMatch, WorkflowResult } from "../support";

export type CreateMatchWorkflow = (
  dependencies: GameSettings & CountActiveMatches & GetUniqueId & UpsertMatch
) => CreateMatch;

export type CreateMatch = (input: Player) => WorkflowResult;
