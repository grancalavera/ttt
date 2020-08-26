// ----------------------------------------------------------------------------
//
// aggregate root
//
// ----------------------------------------------------------------------------

export interface Match {
  readonly id: MatchId;
  readonly owner: Player;
  readonly state: New | Challenge | Game | GameOver;
}

// ----------------------------------------------------------------------------
//
// states
//
// ----------------------------------------------------------------------------

export interface New {
  readonly kind: "New";
}

export interface Challenge {
  readonly kind: "Challenge";
  readonly move: Move;
}

export interface Game extends GameBaseState {
  readonly kind: "Game";
  readonly next: Player;
}

export type GameOver = Draw | Victory;

export interface Draw extends GameBaseState {
  readonly kind: "Draw";
}

export interface Victory extends GameBaseState {
  readonly kind: "Victory";
  readonly winner: Winner;
}

interface GameBaseState {
  readonly players: Players;
  readonly moves: Moves;
}

// ----------------------------------------------------------------------------
//
// support
//
// ----------------------------------------------------------------------------

export interface GameSettings {
  readonly gameSize: number;
  readonly maxActiveMatches: number;
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

// ----------------------------------------------------------------------------
//
// not in use yet
//
// ----------------------------------------------------------------------------

export type MatchStateName = Match["state"]["kind"];
export type ActiveMatch = New | Challenge | Game;
export type MoveType = "CreateChallenge" | "CreateChallenge" | "PlayMove";
