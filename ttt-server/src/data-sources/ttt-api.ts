import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, ErrorResponse, Move } from "@grancalavera/ttt-api";

export interface ITTTAPIDataSource {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameResponse | ErrorResponse>;
  postMove: (move: Move) => Promise<GameResponse | ErrorResponse>;
}

export class TTTAPIDataSource extends RESTDataSource
  implements ITTTAPIDataSource {
  getAllGames(): Promise<GameResponse[]> {
    throw new Error("not implemented");
  }

  getGameById(id: string): Promise<GameResponse | ErrorResponse> {
    throw new Error("not implemented");
  }

  postMove(move: Move): Promise<GameResponse | ErrorResponse> {
    throw new Error("not implemented");
  }
}
n;
