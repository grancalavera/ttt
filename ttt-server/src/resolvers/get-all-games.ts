import { TTTDataSources } from "../environment";
import { Game } from "../generated/models";
import { GameModel } from "../store";
import { combineGames } from "./join-game";

export const getAllGames = async (dataSources: TTTDataSources): Promise<Game[]> => {
  const apiGames = await dataSources.gameAPI.getAllGames();
  const storeGamesMap = await dataSources.gameStore
    .getAllGames()
    .then(g =>
      g.reduce((map, game) => map.set(game.id, game), new Map<string, GameModel>())
    );

  const schemaGames = apiGames.reduce(
    (games, coreGameResponse) => {
      const maybeStoreGame = storeGamesMap.get(coreGameResponse.id);
      const coreGame = coreGameResponse.game;
      return maybeStoreGame ? [...games, combineGames(coreGame, maybeStoreGame)] : games;
    },
    [] as Game[]
  );

  return schemaGames;
};
