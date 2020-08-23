export interface Match {
  readonly id: MatchId;
  readonly owner: Player;
  readonly state: MatchState;
}

export type MatchState = New | Challenge | Game | Draw | Victory;
export type ActiveMatch = New | Challenge | Game;
export type MoveType = "CreateChallenge" | "AcceptChallenge" | "PlayMove";

export interface New {
  readonly kind: "New";
}

export interface Challenge {
  readonly kind: "Challenge";
  readonly move: Move;
}

export interface Game extends GameState {
  readonly kind: "Game";
  readonly next: Player;
}

export interface Draw extends GameState {
  readonly kind: "Draw";
}

export interface Victory extends GameState {
  readonly kind: "Victory";
  readonly winner: Winner;
}

export interface SystemConfig {
  readonly gameSize: number;
  readonly maxActiveMatches: number;
}

interface GameState {
  readonly players: Players;
  readonly moves: Moves;
}

export type Players = [Player, Player];
export type Move = [Player, Position];
export type Moves = Move[];
export type Winner = [Player, Position[]];

export interface Player {
  readonly id: PlayerId;
}

export type PlayerId = Id;
export type MatchId = Id;
export type Position = number;
type Id = string;
