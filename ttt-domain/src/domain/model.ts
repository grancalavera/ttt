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
