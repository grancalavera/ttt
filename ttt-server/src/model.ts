import { GameState } from "./generated/models";
export type GameStateKind = Exclude<GameState["__typename"], undefined>;

export const GameStateKindMap: { [k in GameStateKind]: k } = {
  GameLobby: "GameLobby",
  GameOverTie: "GameOverTie",
  GameOverWin: "GameOverWin",
  GamePlaying: "GamePlaying"
};

export const AllStateKinds = Object.values(GameStateKindMap);
