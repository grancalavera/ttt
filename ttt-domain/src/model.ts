import { Async, AsyncResult, Result } from "result";
import { InvalidInput } from "validation";

// ---------------------------------------------------------------------------------------
//
// OpenChallenge Workflow
//
// ---------------------------------------------------------------------------------------

//  prettier-ignore
export type CreateChallenge
  =  (dependencies: UniqueIdProducer & ChallengeCreator)
  => CreateChallengeWorkflow

export type CreateChallengeWorkflow = (
  input: CreateChallengeInput
) => Async<CreateChallengeResult>;

export interface ChallengeCreator {
  readonly createChallenge: Create<Challenge, ChallengeCreationFailedError>;
}

export interface CreateChallengeInput {
  readonly challenger: Challenger;
  readonly challengerPosition: Position;
}
export type CreateChallengeResult = Result<Challenge, ChallengeCreationFailedError>;

export class ChallengeCreationFailedError {
  readonly kind = "ChallengeNotSavedError";
  constructor(readonly challenge: Challenge) {}
}

// ---------------------------------------------------------------------------------------
//
// AcceptChallenge Workflow
//
// ---------------------------------------------------------------------------------------

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: UniqueIdProducer&ChallengeFinder & GameCreator)
  => AcceptChallengeWorkflow

export type AcceptChallengeWorkflow = (
  input: AcceptChallengeInput
) => Async<AcceptChallengeResult>;

export interface ChallengeFinder {
  readonly findChallenge: Find<ChallengeId, Challenge, ChallengeNotFoundError>;
}

export interface GameCreator {
  readonly createGame: Create<Game, GameCreationFailedError>;
}

export interface AcceptChallengeInput {
  readonly challengeId: ChallengeId;
  readonly opponent: Opponent;
  readonly opponentPosition: Position;
}

export interface CreateGameInput {
  readonly challenge: Challenge;
  readonly opponent: Opponent;
  readonly opponentPosition: Position;
}

export type AcceptChallengeResult = Result<Game, AcceptChallengeError>;

export type AcceptChallengeError =
  | ChallengeNotFoundError
  | CreateGameValidationError
  | GameCreationFailedError;

export class ChallengeNotFoundError {
  readonly kind = "ChallengeNotFoundError";
  constructor(readonly challengeId: ChallengeId) {}
}

export class CreateGameValidationError {
  readonly kind = "CreateGameValidationError";
  constructor(readonly validationResult: InvalidInput<CreateGameInput>[]) {}
}

export class GameCreationFailedError {
  readonly kind = "GameCreationFailedError";
  constructor(readonly game: Game) {}
}

// ---------------------------------------------------------------------------------------
//
// PlayMove Workflow
//
// ---------------------------------------------------------------------------------------

// prettier-ignore
export type PlayMove
  =  (dependencies: GameFinder)
  => PlayMoveWorkflow

export type PlayMoveWorkflow = (input: PlayMoveInput) => Async<PlayMoveResult>;

export interface GameFinder {
  readonly findGame: Find<GameId, Game, GameNotFoundError>;
}

export interface PlayMoveInput {
  readonly gameId: GameId;
  readonly player: Player;
  readonly playerPosition: Position;
}

export interface CreateMoveInput {
  readonly game: Game;
  readonly player: Player;
  readonly playerPosition: Position;
}

export type PlayMoveResult = Result<Game, PlayMoveError>;

export type PlayMoveError = GameNotFoundError | CreateMoveValidationError;

export class GameNotFoundError {
  readonly kind = "GameNotFoundError";
  constructor(readonly gameId: GameId) {}
}

export class CreateMoveValidationError {
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
  readonly challengerPosition: Position;
}

export interface Game {
  readonly status: GameStatus;
  readonly gameId: GameId;
  readonly players: Players;
  readonly moves: Moves;
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
export type Moves = Move[];
export type Winner = [Player, Position[]];

export interface Challenger {
  readonly challengerId: ChallengerId;
}

export const challengerToPlayer = ({ challengerId }: Challenger): Player => ({
  playerId: challengerId,
});
export const opponentToPlayer = ({ opponentId }: Opponent): Player => ({
  playerId: opponentId,
});
export const arePlayersTheSame = ([p1, p2]: Players) => p1.playerId === p2.playerId;
export const arePositionsTheSame = ([pos1, pos2]: [Position, Position]) => pos1 === pos2;

export const arePlayersTheSame_c = (compare: Player) => (candidate: Player) =>
  arePlayersTheSame([compare, candidate]);

export const arePositionsTheSame_c = (compare: Position) => (candidate: Position) =>
  arePositionsTheSame([compare, candidate]);

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

export interface UniqueIdProducer {
  readonly getUniqueId: () => string;
}

export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;
export type Create<T, E> = (data: T) => AsyncResult<void, E>;
export type Update<TRef, T, E> = (ref: TRef, data: T) => AsyncResult<void, E>;
