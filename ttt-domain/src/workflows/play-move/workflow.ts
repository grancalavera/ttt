import { Match, SystemConfig } from "../../domain/model";
import { FindMatch, MoveInput, UpsertMatch, WorkflowResult } from "../support";

export type PlayMove = (
  dependencies: SystemConfig & FindMatch & UpsertMatch
) => PlayMoveWorkflow;

export type PlayMoveWorkflow = (input: MoveInput) => WorkflowResult<Match>;

export interface PlayMoveError {
  readonly kind: "PlayMoveError";
  readonly input: MoveInput;
}

export const playMoveError = (input: MoveInput): PlayMoveError => ({
  kind: "PlayMoveError",
  input,
});

declare module "../errors" {
  export interface WorkflowErrorMap {
    PlayMoveError: PlayMoveError;
  }
}
