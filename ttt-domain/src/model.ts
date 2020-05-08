// aggregates have a root object and a graph
// of dependencies

export interface GameChallenge {
  id: ID;
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

export type Player = ID;
export type Position = number;

type ID = string;
