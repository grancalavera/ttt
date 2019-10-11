import { GameResponse } from "@grancalavera/ttt-api";
import { CoreMove } from "@grancalavera/ttt-core";
import { RESTDataSource } from "apollo-datasource-rest";

export interface IGameAPI {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse>;
  postMove: (id: string, move: CoreMove) => Promise<GameResponse>;
}

export class GameAPI extends RESTDataSource implements IGameAPI {
  constructor(public readonly baseURL: string) {
    super();
  }

  public getAllGames() {
    return this.get<GameResponse[]>("ttt");
  }

  public getGameById(id: string) {
    return this.get<GameResponse>(`ttt/${id}`);
  }

  public postMove(id: string, [player, position]: CoreMove) {
    return this.post<GameResponse>(`ttt/${id}/moves`, { player, position });
  }
}
