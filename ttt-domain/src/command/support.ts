import { AsyncResult } from "@grancalavera/ttt-etc";
import { DomainError } from "../domain/error";
import {
  Challenge,
  Match,
  MatchDescription,
  MatchId,
  Move,
  Player,
} from "../domain/model";
import { GameSettings } from "../system/support";
import { WorkflowInput } from "../workflow/support";

// join game command handler

export type JoinGameCommandHandler = CommandHandler<
  CountActiveMatches & FindFirstChallenge & GameSettings,
  JoinGameCommand
>;

export class JoinGameCommand {
  readonly kind = "JoinGameCommand";
  constructor(readonly input: JoinGameInput) {}
}

export interface JoinGameInput {
  readonly player: Player;
}

export interface CountActiveMatches {
  countActiveMatches: (player: Player) => Promise<number>;
}

export interface FindFirstChallenge {
  readonly findFirstChallenge: () => AsyncResult<
    [MatchDescription, Challenge],
    DomainError
  >;
}

// play move command handler

export type PlayMoveCommandHandler = CommandHandler<FindMatch, PlayMoveCommand>;

export class PlayMoveCommand {
  readonly kind = "PlayMoveCommand";
  constructor(readonly input: PlayMoveInput) {}
}

export interface PlayMoveInput {
  readonly matchId: MatchId;
  readonly move: Move;
}

export interface FindMatch {
  readonly findMatch: (matchId: MatchId) => AsyncResult<Match, DomainError>;
}

// support

export type Command = JoinGameCommand | PlayMoveCommand;
export type HandleCommand<T> = (command: T) => CommandResult;

type CommandResult = AsyncResult<WorkflowInput, DomainError[]>;
type CommandHandler<TDeps, TCommand extends Command> = (
  dependencies: TDeps
) => (command: TCommand) => CommandResult;
