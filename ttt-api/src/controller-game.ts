import { ResponseGame } from "./model";

export const findAllGames = async (): Promise<ResponseGame[]> => {
  throw new Error(`controller "${findAllGames}" not implemented`);
};

export const findGamesById = async (id: string): Promise<ResponseGame | null> => {
  throw new Error(`controller "${findGamesById}" not implemented`);
};
