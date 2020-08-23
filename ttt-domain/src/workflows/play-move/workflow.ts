import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type PlayMoveWorkflow = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => PlayMove;

export type PlayMove = (input: MoveInput) => WorkflowResult<Match>;

export class PlayMoveError {
  readonly kind = "PlayMoveError";
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    PlayMoveError: PlayMoveError;
  }
}
