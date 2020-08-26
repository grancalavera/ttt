import { Result } from "@grancalavera/ttt-etc";
import { Match, Player, SystemConfig } from "../../domain/model";
import { WorkflowError } from "../errors";
import { CountActiveMatches, GetUniqueId, UpsertMatch } from "../support";

export type CreateMatchWorkflow = (
  dependencies: SystemConfig & CountActiveMatches & GetUniqueId & UpsertMatch
) => CreateMatch;

export type CreateMatch = (input: Player) => Promise<Result<Match, WorkflowError[]>>;
