import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, MovesResponse } from "@grancalavera/ttt-api";
import { CoreMove } from "@grancalavera/ttt-core";

export interface IGameAPI {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse>;
  getMovesByGameId: (id: string) => Promise<MovesResponse>;
  postGame: (id: string) => Promise<GameResponse>;
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

  public getMovesByGameId(id: string) {
    return this.get<MovesResponse>(`ttt/${id}/moves`);
  }

  public postGame(id: string) {
    return this.post<GameResponse>("ttt", { id });
  }

  public postMove(id: string, move: CoreMove) {
    return this.post<GameResponse>(`ttt/${id}/moves`, move);
  }
}
