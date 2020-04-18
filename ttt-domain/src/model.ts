export interface Game {
  players: Players;
  moves: Move[];
}

export type GameState = OpenGame | DrawGame | WonGame;

interface OpenGame {
  kind: "OpenGame";
  next: Player;
}

interface WonGame {
  kind: "WonGame";
  winner: Winner;
}

interface DrawGame {
  kind: "DrawGame";
}

export type Players = [Player, Player];
export type Move = [Player, Position];
export type Winner = [Player, Position[]];

export type Player = string;
export type Position = number;
