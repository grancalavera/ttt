import { Async, AsyncResult, Result } from "result";
import { InvalidInput, Validation } from "validation";

// ---------------------------------------------------------------------------------------
//
// OpenChallenge Workflow
//
// ---------------------------------------------------------------------------------------

//  prettier-ignore
export type CreateChallenge
  =  (dependencies: CreateChallengeDependencies & UniqueIdProducer)
  => (input: CreateChallengeInput)
  => Async<CreateChallengeResult>

export interface CreateChallengeDependencies {
  readonly findChallenger: FindChallenger;
}
export type FindChallenger = Find<ChallengerId, Challenger, ChallengerNotFoundError>;

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
  =  (dependencies: AcceptChallengeDependencies & UniqueIdProducer)
  => (input: AcceptChallengeInput)
  => Async<AcceptChallengeResult>;

export interface AcceptChallengeDependencies {
  findChallenge: FindChallenge;
  findOpponent: FindOpponent;
}

export type FindChallenge = Find<ChallengeId, Challenge, ChallengeNotFoundError>;
export type FindOpponent = Find<OpponentId, Opponent, OpponentNotFoundError>;

export interface AcceptChallengeInput {
  readonly challengeId: ChallengeId;
  readonly opponentId: OpponentId;
  readonly position: Position;
}

// prettier-ignore
export type CreateGame
  =  (input: CreateGameInput)
  => Validation<Game, InvalidInput<CreateGameInput>>;

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
  findGame: FindGame;
  findPlayer: FindPlayer;
}
export type FindGame = Find<GameId, Game, GameNotFoundError>;
export type FindPlayer = Find<PlayerId, Player, PlayerNotFoundError>;

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

class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

class PlayerNotFoundError {
  readonly kind = "PlayerNotFoundError";
  constructor(readonly playerId: PlayerId) {}
}

class CreateMoveValidationError {
  readonly kind = "CreateMoveValidationError";
  constructor(readonly validationResult: InvalidInput<CreateMoveInput>[]) {}
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

// export type Challenge = OpenChallenge | AcceptedChallenge;

export interface OpenChallenge {
  readonly kind: "OpenChallenge";
  readonly challengeId: ChallengeId;
  readonly challenger: Challenger;
  readonly position: Position;
}

export interface AcceptedChallenge {
  readonly kind: "AcceptedChallenge";
  readonly challengeId: ChallengeId;
  readonly gameId: GameId;
  readonly challenger: Challenger;
  readonly opponent: Opponent;
}

export interface Game {
  readonly gameId: GameId;
  readonly players: Players;
  readonly moves: Move[];
  readonly size: number;
}

export type GameState = OpenGame | DrawGame | WonGame;

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

export type UniqueIdProducer = { getUniqueId: () => string };
export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;
