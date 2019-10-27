import { GameResponse, ErrorResponse, Move } from "@grancalavera/ttt-api";
import { RESTDataSource } from "apollo-datasource-rest";

export interface IGameAPI {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse | ErrorResponse>;
  postMove: (move: Move) => Promise<GameResponse | ErrorResponse>;
}

export class GameAPI extends RESTDataSource implements IGameAPI {
  constructor(public readonly baseURL: string) {
    super();
  }

  public async getAllGames() {
    const g = await this.get<GameResponse[]>("ttt");
    return g;
  }

  public getGameById(id: string) {
    return this.get<GameResponse | ErrorResponse>(`ttt/${id}`);
  }

  public async postMove(move: Move) {
    const { gameId } = move;
    await this.post<GameResponse>(`ttt/moves`, move);
    return this.getGameById(gameId);
  }
}
