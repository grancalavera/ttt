import { Async, AsyncResult, Result } from "result";
import { InvalidInput, Validation, ValidateInput, Invalid } from "validation";

// ---------------------------------------------------------------------------------------
//
// OpenChallenge Workflow
//
// ---------------------------------------------------------------------------------------

//  prettier-ignore
export type CreateChallenge
  =  (dependencies: CreateChallengeDependencies)
  => (input: CreateChallengeInput)
  => Async<CreateChallengeResult>

export type CreateChallengeDependencies = {
  readonly findChallenger: Find<ChallengerId, Challenger, ChallengerNotFoundError>;
} & UniqueIdProducer;

export interface CreateChallengeInput {
  readonly challengerId: ChallengerId;
  readonly position: Position;
}
export type CreateChallengeResult = Result<Challenge, ChallengerNotFoundError>;

export class ChallengerNotFoundError {
  readonly kind = "ChallengerNotFoundError";
  constructor(readonly challengerId: ChallengerId) {}
}

// ---------------------------------------------------------------------------------------
//
// AcceptChallenge Workflow
//
// ---------------------------------------------------------------------------------------

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: AcceptChallengeDependencies)
  => (input: AcceptChallengeInput)
  => Async<AcceptChallengeResult>;

export type AcceptChallengeDependencies = {
  findChallenge: Find<ChallengeId, Challenge, ChallengeNotFoundError>;
  findOpponent: Find<OpponentId, Opponent, OpponentNotFoundError>;
} & UniqueIdProducer;

export interface AcceptChallengeInput {
  readonly challengeId: ChallengeId;
  readonly opponentId: OpponentId;
  readonly position: Position;
}

export interface CreateGameInput {
  readonly gameId: GameId;
  readonly challenge: Challenge;
  readonly opponent: Opponent;
  readonly position: Position;
}

export type AcceptChallengeResult = Result<Game, AcceptChallengeError>;

export type AcceptChallengeError =
  | ChallengeNotFoundError
  | OpponentNotFoundError
  | CreateGameValidationError;

export class ChallengeNotFoundError {
  readonly kind = "ChallengeNotFoundError";
  constructor(readonly challengeId: ChallengeId) {}
}

export class OpponentNotFoundError {
  readonly kind = "OpponentNotFoundError";
  constructor(readonly opponentId: OpponentId) {}
}

export class CreateGameValidationError {
  readonly kind = "CreateGameValidationError";
  constructor(readonly validationResult: InvalidInput<CreateGameInput>[]) {}
}

// ---------------------------------------------------------------------------------------
//
// PlayMove Workflow
//
// ---------------------------------------------------------------------------------------

// prettier-ignore
export type PlayMove
  =  (dependencies: PlayMoveDependencies)
  => (input: PlayMoveInput)
  => Async<PlayMoveResult>;

export interface PlayMoveDependencies {
  findGame: Find<GameId, Game, GameNotFoundError>;
  findPlayer: Find<PlayerId, Player, PlayerNotFoundError>;
}

export interface PlayMoveInput {
  gameId: GameId;
  playerId: PlayerId;
  position: Position;
}

// prettier-ignore
export type CreateMove
  =  (input: CreateMoveInput)
  => Validation<Move, InvalidInput<CreateMoveInput>>;

export interface CreateMoveInput {
  readonly game: Game;
  readonly player: Player;
  readonly position: Position;
}

export type PlayMoveResult = Result<Game, PlayMoveError>;

export type PlayMoveError =
  | GameNotFoundError
  | PlayerNotFoundError
  | CreateMoveValidationError;

export class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

export class PlayerNotFoundError {
  readonly kind = "PlayerNotFoundError";
  constructor(readonly playerId: PlayerId) {}
}

export class CreateMoveValidationError {
  readonly kind = "CreateMoveValidationError";
  constructor(readonly validationResult: InvalidInput<CreateMoveInput>) {}
}

// ---------------------------------------------------------------------------------------
//
// Model
//
// ---------------------------------------------------------------------------------------

export interface Challenge {
  readonly challengeId: ChallengeId;
  readonly challenger: Challenger;
  readonly position: Position;
}

export interface Game {
  // I'll add these two later on
  // readonly challengeId: ChallengeId;
  // readonly status: GameStatus;
  readonly gameId: GameId;
  readonly players: Players;
  readonly moves: Move[];
  readonly size: number;
}

export type GameStatus = OpenGame | DrawGame | WonGame;

export interface OpenGame {
  readonly kind: "OpenGame";
  readonly next: Player;
}

export interface WonGame {
  readonly kind: "WonGame";
  readonly winner: Winner;
}

export interface DrawGame {
  readonly kind: "DrawGame";
}

export type Players = [Player, Player];
export type Move = [Player, Position];
export type Winner = [Player, Position[]];

export interface Challenger {
  readonly challengerId: ChallengerId;
}

export const challengerToPlayer = (x: Challenger): Player => ({
  playerId: x.challengerId,
});

export const opponentToPlayer = (x: Opponent): Player => ({ playerId: x.opponentId });

export const arePlayersTheSame = ([p1, p2]: Players) => p1.playerId === p2.playerId;

export interface Opponent {
  readonly opponentId: OpponentId;
}

export interface Player {
  readonly playerId: PlayerId;
}

export type ChallengerId = Id;
export type OpponentId = Id;
export type PlayerId = Id;

export type Position = number;
export type ChallengeId = Id;
export type GameId = Id;
type Id = string;

// ---------------------------------------------------------------------------------------
//
// Etc
//
// ---------------------------------------------------------------------------------------

export type UniqueIdProducer = { readonly getUniqueId: () => string };
export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;
