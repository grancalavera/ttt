import { GamePlayingState, GameState } from "./generated/graphql";

export const amINext = (game: GamePlayingState) => game.next === game.me;

export const amIWaiting = (game: GameState) =>
  game.__typename === "GamePlayingState" && !amINext(game);
