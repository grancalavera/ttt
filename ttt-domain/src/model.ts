import { InvalidGame } from "game/validation";
import { InvalidMove } from "move/validation";

// Workflows

//  prettier-ignore
export type OpenChallenge
  =  (dependencies: {findPlayer: FindPlayer})
  => (playerId: PlayerId,  position: Position)
  => AsyncResult<Challenge, OpenChallengeError>;

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: {findChallenge: FindChallenge, findOpponent: FindOpponent})
  => (challengeId: ChallengeId, opponentId: OpponentId, position: Position)
  => AsyncResult<Game, AcceptChallengeError>

// prettier-ignore
export type Play
  =  (dependencies: {findGame: FindGame; findPlayer: FindPlayer;})
  => (gameId: GameId, playerId: PlayerId, position: Position)
  => AsyncResult<Game, PlayError>;

// Model

export interface Challenge {
  id: Id;
  player: Player;
  position: Position;
}

export interface Game {
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

export type Player = Id;
export type Opponent = Id;
export type Position = number;

export type PlayerId = Id;
export type ChallengeId = Id;
export type OpponentId = Id;
export type GameId = Id;
type Id = string;

type FindPlayer = Find<PlayerId, Player, PlayerNotFoundError>;
type FindOpponent = Find<OpponentId, Opponent, OpponentNotFoundError>;
type FindChallenge = Find<ChallengeId, Challenge, ChallengeNotFoundError>;
type FindGame = Find<GameId, Game, GameNotFoundError>;
type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;

type OpenChallengeError = PlayerNotFoundError;

type AcceptChallengeError =
  | ChallengeNotFoundError
  | OpponentNotFoundError
  | ValidationError<AcceptChallengeValidationResult>;

type PlayError =
  | GameNotFoundError
  | PlayerNotFoundError
  | ValidationError<PlayValidationResult>;

type PlayerNotFoundError = { kind: "PlayerNotFoundError"; playerId: PlayerId };

type ChallengeNotFoundError = {
  kind: "ChallengeNotFoundError";
  challengeId: ChallengeId;
};

type OpponentNotFoundError = {
  kind: "OpponentNotFoundError";
  opponentId: OpponentId;
};

type GameNotFoundError = {
  kind: "GameNotFoundError";
  gameId: GameId;
};

type ValidationError<T> = {
  kind: "ValidationError";
  validationResult: T[];
};

type AcceptChallengeValidationResult = InvalidGame[];
type PlayValidationResult = InvalidMove[];

type Result<T, E> = Ok<T> | Fail<E>;
type AsyncResult<T, E> = Promise<Result<T, E>>;

type Ok<T> = { kind: "ResultOk"; value: T };
type Fail<E> = { kind: "ResultFail"; error: E };
