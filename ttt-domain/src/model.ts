import { InvalidGame } from "game/validation";
import { InvalidMove } from "move/validation";
import { Async, AsyncResult, Result } from "result";

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
export type FindChallenger = Find<ChallengerId, Challenger, ChallengerNotFoundFailure>;
export type OpenChallengeInput = { challengerId: ChallengerId; position: Position };
export type OpenChallengeResult = Result<Challenge, OpenChallengeFailure>;
export type OpenChallengeFailure = ChallengerNotFoundFailure;

export class ChallengerNotFoundFailure {
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

export type FindChallenge = Find<ChallengeId, Challenge, ChallengeNotFoundFailure>;
export type FindOpponent = Find<OpponentId, Opponent, OpponentNotFoundFailure>;

export type AcceptChallengeInput = {
  challengeId: ChallengeId;
  opponentId: OpponentId;
  position: Position;
};

export type AcceptChallengeResult = AsyncResult<Game, AcceptChallengeError>;

export type AcceptChallengeError =
  | ChallengeNotFoundFailure
  | OpponentNotFoundFailure
  | AcceptChallengeValidationFailure;

export class ChallengeNotFoundFailure {
  readonly kind = "ChallengeNotFoundError";
  constructor(readonly challengeId: ChallengeId) {}
}

export class OpponentNotFoundFailure {
  readonly kind = "OpponentNotFoundError";
  constructor(readonly opponentId: OpponentId) {}
}

export class AcceptChallengeValidationFailure {
  readonly kind = "AcceptChallengeValidationFailure";
  constructor(readonly validationResult: InvalidGame[]) {}
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
export type FindGame = Find<GameId, Game, GameNotFoundFailure>;
export type FindPlayer = Find<PlayerId, Player, PlayerNotFoundFailure>;

export type PlayMoveInput = { gameId: GameId; playerId: PlayerId; position: Position };
export type PlayMoveResult = Result<Game, PlayMoveFailure>;

export type PlayMoveFailure =
  | GameNotFoundFailure
  | PlayerNotFoundFailure
  | PlayMoveValidationFailure;

class GameNotFoundFailure {
  readonly kind = "GameNotFoundFailure";
  constructor(readonly gameId: GameId) {}
}

class PlayerNotFoundFailure {
  readonly kind = "PlayerNotFoundFailure";
  constructor(readonly playerId: PlayerId) {}
}

class PlayMoveValidationFailure {
  readonly kind = "PlayMoveValidationFailure";
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
