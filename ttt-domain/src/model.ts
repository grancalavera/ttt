import { InvalidGame } from "game/validation";
import { InvalidMove } from "move/validation";
import { AsyncResult, Result, Async } from "result";
import { getInvalid, Invalid } from "validation";

//  prettier-ignore
export type OpenChallenge
  =  (dependencies: OpenChallengeDependencies)
  => (input: {challengerId: ChallengerId,  position: Position})
  => Async<OpenChallengeResult>

export type OpenChallengeDependencies = {
  findChallenger: FindChallenger;
} & UniqueIdProducer;
export type OpenChallengeInput = { challengerId: ChallengerId; position: Position };
export type OpenChallengeResult = Result<Challenge, OpenChallengeError>;

// prettier-ignore
export type AcceptChallenge
  =  (dependencies: {findChallenge: FindChallenge, findOpponent: FindOpponent})
  => (input: {challengeId: ChallengeId, opponentId: OpponentId, position: Position})
  => AsyncResult<Game, AcceptChallengeError>

// prettier-ignore
export type PlayMove
  =  (dependencies: {findGame: FindGame; findPlayer: FindPlayer;})
  => (input: {gameId: GameId, playerId: PlayerId, position: Position})
  => AsyncResult<Game, PlayError>;

// Model

export interface Challenge {
  challengeId: ChallengeId;
  challenger: Challenger;
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

export type Challenger = Id;
export type Opponent = Id;
export type Player = Id;
export type Position = number;

export type ChallengerId = Id;
export type OpponentId = Id;
export type PlayerId = Id;

export type ChallengeId = Id;
export type GameId = Id;

type Id = string;

export type UniqueIdProducer = { getUniqueId: () => string };

export type FindChallenger = Find<ChallengerId, Challenger, ChallengerNotFoundError>;
export type FindOpponent = Find<OpponentId, Opponent, OpponentNotFoundError>;
export type FindChallenge = Find<ChallengeId, Challenge, ChallengeNotFoundError>;
export type FindPlayer = Find<PlayerId, Player, PlayerNotFoundError>;
export type FindGame = Find<GameId, Game, GameNotFoundError>;
export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;

export type OpenChallengeError = ChallengerNotFoundError;

export type AcceptChallengeError =
  | ChallengeNotFoundError
  | OpponentNotFoundError
  | ValidationError<AcceptChallengeValidationResult>;

export type PlayError =
  | GameNotFoundError
  | PlayerNotFoundError
  | ValidationError<PlayValidationResult>;

export type ChallengerNotFoundError = {
  kind: "ChallengerNotFoundError";
  challengerId: ChallengerId;
};

export const challengerNotFoundError = (
  challengerId: ChallengerId
): ChallengerNotFoundError => ({
  kind: "ChallengerNotFoundError",
  challengerId,
});

export type ChallengeNotFoundError = {
  kind: "ChallengeNotFoundError";
  challengeId: ChallengeId;
};

export const challengeNotFoundError = (
  challengeId: ChallengeId
): ChallengeNotFoundError => ({
  kind: "ChallengeNotFoundError",
  challengeId,
});

export type OpponentNotFoundError = {
  kind: "OpponentNotFoundError";
  opponentId: OpponentId;
};

export type PlayerNotFoundError = { kind: "PlayerNotFoundError"; playerId: PlayerId };

export type GameNotFoundError = {
  kind: "GameNotFoundError";
  gameId: GameId;
};

export type ValidationError<E> = {
  kind: "ValidationError";
  validationResults: E[];
};

type AcceptChallengeValidationResult = InvalidGame[];
type PlayValidationResult = InvalidMove[];

export const validationError = <E>(validationResults: E[]): ValidationError<E> => ({
  kind: "ValidationError",
  validationResults,
});

export const invalidToValidationError = <E>(validation: Invalid<E>): ValidationError<E> =>
  validationError(getInvalid(validation));
