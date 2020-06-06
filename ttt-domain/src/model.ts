import { InvalidMove } from "move/validation";
import { Async, AsyncResult, Result } from "result";
import { InvalidInput, Validation } from "validation";

// ---------------------------------------------------------------------------------------
//
// OpenChallenge Workflow
//
// ---------------------------------------------------------------------------------------

//  prettier-ignore
export type OpenChallenge
  =  (dependencies: OpenChallengeDependencies & UniqueIdProducer)
  => (input: OpenChallengeInput)
  => Async<OpenChallengeResult>

export type OpenChallengeDependencies = { findChallenger: FindChallenger };
export type FindChallenger = Find<ChallengerId, Challenger, ChallengerNotFoundError>;
export type OpenChallengeInput = { challengerId: ChallengerId; position: Position };
export type OpenChallengeResult = Result<Challenge, ChallengerNotFoundError>;

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

export type AcceptChallengeDependencies = {
  findChallenge: FindChallenge;
  findOpponent: FindOpponent;
};

export type FindChallenge = Find<ChallengeId, Challenge, ChallengeNotFoundError>;
export type FindOpponent = Find<OpponentId, Opponent, OpponentNotFoundError>;

export type AcceptChallengeInput = {
  challengeId: ChallengeId;
  opponentId: OpponentId;
  position: Position;
};

// prettier-ignore
export type CreateGame
  =  (input: CreateGameInput)
  => Validation<Game, InvalidInput<CreateGameInput>>;

export type CreateGameInput = {
  gameId: GameId;
  challenge: Challenge;
  opponent: Opponent;
  position: Position;
};

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

export type PlayMoveDependencies = { findGame: FindGame; findPlayer: FindPlayer };
export type FindGame = Find<GameId, Game, GameNotFoundError>;
export type FindPlayer = Find<PlayerId, Player, PlayerNotFoundError>;

export type PlayMoveInput = { gameId: GameId; playerId: PlayerId; position: Position };
export type PlayMoveResult = Result<Game, PlayMoveError>;

export type PlayMoveError =
  | GameNotFoundError
  | PlayerNotFoundError
  | PlayMoveValidationError;

class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

class PlayerNotFoundError {
  readonly kind = "PlayerNotFoundError";
  constructor(readonly playerId: PlayerId) {}
}

class PlayMoveValidationError {
  readonly kind = "PlayMoveValidationError";
  constructor(readonly validationResult: InvalidMove[]) {}
}

// ---------------------------------------------------------------------------------------
//
// Model
//
// ---------------------------------------------------------------------------------------

export interface Challenge {
  challengeId: ChallengeId;
  challenger: Challenger;
  position: Position;
}

export interface Game {
  gameId: GameId;
  players: Players;
  moves: Move[];
  size: number;
}

export type GameState = OpenGame | DrawGame | WonGame;

export interface OpenGame {
  kind: "OpenGame";
  next: Player;
}

export interface WonGame {
  kind: "WonGame";
  winner: Winner;
}

export interface DrawGame {
  kind: "DrawGame";
}

export type Players = [Player, Player];
export type Move = [Player, Position];
export type Winner = [Player, Position[]];

export type Challenger = { challengerId: ChallengerId };
export type Opponent = { opponentId: OpponentId };
export type Player = { playerId: PlayerId };

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
