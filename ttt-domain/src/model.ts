export interface Game {
  players: Players;
  moves: Move[];
}

export type Players = [Player, Player];
export type Player = ID;
export type Move = [Player, Position];
export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type ID = string;
