import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, MovesResponse } from "@grancalavera/ttt-api";
import { Move } from "../generated/models";

export interface GameAPI {
  getGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse>;
  getMovesByGameId: (id: string) => Promise<MovesResponse>;
  postGame: (id: string) => Promise<GameResponse>;
  postMove: (id: string, move: Move) => Promise<GameResponse>;
}

export class GameAPIDataSource extends RESTDataSource implements GameAPI {
  constructor(public readonly baseURL: string) {
    super();
  }

  public getGames() {
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

  public postMove(id: string, move: Move) {
    return this.post<GameResponse>(`ttt/${id}/moves`, move);
  }
}
