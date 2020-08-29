import { GameSettings, MatchId, Player } from "../../domain/model";
import { CountActiveMatches, FindMatch, UpsertMatch, WorkflowResult } from "../support";

export type CreateGameWorkflow = (
  dependencies: GameSettings & FindMatch & UpsertMatch & CountActiveMatches
) => CreateGame;

export type CreateGame = (input: CreateGameInput) => WorkflowResult;
export type CreateGameInput = { matchId: MatchId; opponent: Player };
