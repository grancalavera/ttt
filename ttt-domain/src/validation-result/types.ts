import { Game, Move, Player, Players } from "model";

export type ValidationResult<T extends Invalid> = T[];

export type Invalid =
  | InvalidGame
  | InvalidMoves
  | InvalidMove
  | InvalidPlayers
  | InvalidPlayer;

export interface InvalidGame {
  kind: "InvalidGame";
  message: string;
  game: Game;
}

export interface InvalidMoves {
  kind: "InvalidMoves";
  message: string;
  size: number;
  moves: Move[];
}

export interface InvalidMove {
  kind: "InvalidMove";
  message: string;
  game: Game;
  move: Move;
}

export interface InvalidPlayers {
  kind: "InvalidPlayers";
  message: string;
  players: Players;
}

export interface InvalidPlayer {
  kind: "InvalidPlayer";
  message: string;
  players: Players;
  player: Player;
}

export interface Valid<T> {
  kind: "ValidationValid";
  data: T;
}

export interface Invalid_<T> {
  kind: "ValidationInvalid";
  errors: T[];
}

export type Validation<Data, Error> = Valid<Data> | Invalid_<Error>;
