import { TTTContext } from "../environment";
import { Game } from "../generated/models";
import { GameModel } from "../store";
import { combineGames } from "./combine-games";
import { GameResponse } from "@grancalavera/ttt-api";

export const getAllGames = async (context: TTTContext): Promise<Game[]> => {
  const { dataSources } = context;

  const apiGames = await dataSources.gameAPI.getAllGames();
  const storeGames = await dataSources.gameStore.getAllGames();

  const apiGamesMap = apiGames.reduce(
    (map, game) => map.set(game.id, game),
    new Map<string, GameResponse>()
  );

  const schemaGames = storeGames.flatMap(storeGame => {
    const maybeApiGame = apiGamesMap.get(storeGame.id);
    return combineGames(storeGame, maybeApiGame);
  });

  return schemaGames;
};
