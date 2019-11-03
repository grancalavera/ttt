import { GameResponse } from "@grancalavera/ttt-api";
import { TTTContext } from "../environment";
import { Game } from "../generated/models";

export const getAllGames = async (context: TTTContext): Promise<Game[]> => {
  throw new Error("getAllGames is not implemented");
};
