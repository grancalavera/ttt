import { GameErrorResponse, GameResponse, Move } from "@grancalavera/ttt-api";
import { RESTDataSource } from "apollo-datasource-rest";

export interface IGameAPI {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse | GameErrorResponse>;
  postMove: (move: Move) => Promise<GameResponse | GameErrorResponse>;
}

export class GameAPI extends RESTDataSource implements IGameAPI {
  constructor(public readonly baseURL: string) {
    super();
  }

  public getAllGames() {
    return this.get<GameResponse[]>("ttt");
  }

  public getGameById(id: string) {
    return this.get<GameResponse | GameErrorResponse>(`ttt/${id}`);
  }

  public async postMove(move: Move) {
    const { gameId } = move;
    await this.post<GameResponse>(`ttt/moves`, move);
    return this.getGameById(gameId);
  }
}
