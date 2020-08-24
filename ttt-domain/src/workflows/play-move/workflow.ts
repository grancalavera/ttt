import { Match } from "../../domain/model";
import { MoveInput, StandardDependencies, WorkflowResult } from "../support";

export type PlayMoveWorkflow = (dependencies: StandardDependencies) => PlayMove;

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
