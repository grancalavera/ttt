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
import { AsyncDomainResult } from "../domain/result";
import { GameSettings } from "../system/support";
import { WorkflowInput } from "../workflow/support";

// ----------------------------------------------------------------------------
//
// global command handler
//
// ----------------------------------------------------------------------------

export type GlobalCommandHandler = CommandHandler<JoinGame & PlayMove, Command>;

export interface JoinGame {
  readonly joinGame: (input: JoinGameInput) => CommandResult;
}

export interface PlayMove {
  readonly playMove: (input: PlayMoveInput) => CommandResult;
}

// ----------------------------------------------------------------------------
//
// join game command handler
//
// ----------------------------------------------------------------------------

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

export type CountActiveMatches = {
  countActiveMatches: (player: Player) => Promise<number>;
};

export interface FindFirstChallenge {
  readonly findFirstChallenge: () => AsyncResult<
    [MatchDescription, Challenge],
    DomainError
  >;
}

// ----------------------------------------------------------------------------
//
// play move command handler
//
// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------
//
// support
//
// ----------------------------------------------------------------------------

export type Command = JoinGameCommand | PlayMoveCommand;
export type CommandResult = AsyncDomainResult<WorkflowInput>;

type CommandHandler<TDeps, TCommand extends Command> = (
  dependencies: TDeps
) => (command: TCommand) => CommandResult;

export type HandleCommand<T> = (command: T) => CommandResult;
