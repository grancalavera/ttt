import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, MovesResponse } from "@grancalavera/ttt-api";
import { Move } from "@grancalavera/ttt-core";

export class GameAPIDataSource extends RESTDataSource {
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
    return this.get<MovesResponse[]>(`ttt/${id}/moves`);
  }

  public postGame() {
    return this.post<GameResponse>("ttt");
  }

  public postMove(id: string, move: Move) {
    return this.post<GameResponse>(`ttt/${id}/moves`, move);
  }
}
