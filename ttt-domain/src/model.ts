import { AsyncResult } from "./result";

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
