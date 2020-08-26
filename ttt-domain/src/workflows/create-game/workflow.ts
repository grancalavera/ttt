import { GameSettings } from "../../domain/model";
import {
  CountActiveMatches,
  FindMatch,
  MoveInput,
  UpsertMatch,
  WorkflowResult,
} from "../support";

export type CreateGameWorkflow = (
  dependencies: GameSettings & FindMatch & UpsertMatch & CountActiveMatches
) => CreateGame;

export type CreateGame = (input: MoveInput) => WorkflowResult;

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message(): string {
    const [player] = this.input.move;
    return `${player.id} cannot be both the owner and opponent of the same match`;
  }
  constructor(readonly input: MoveInput) {}
}

declare module "../errors" {
  export interface WorkflowErrorMap {
    IllegalGameOpponentError: IllegalGameOpponentError;
  }
}
