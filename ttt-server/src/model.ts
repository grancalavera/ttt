import { GameState } from "./generated/models";

export type GameStateKind = Exclude<GameState["__typename"], undefined>;

export const GAME_LOBBY: GameStateKind = "GameLobby";
export const GAME_PLAYING: GameStateKind = "GamePlaying";
export const GAME_OVER_WIN: GameStateKind = "GameOverWin";
export const GAME_OVER_TIE: GameStateKind = "GameOverTie";
