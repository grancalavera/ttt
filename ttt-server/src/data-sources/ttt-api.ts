import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, ErrorResponse, Move } from "@grancalavera/ttt-api";
import { DataSourceContext } from "context";
import { DataSourceConfig } from "apollo-datasource";

export type GameAPIResponse = GameResponse | ErrorResponse;

export interface ITTTAPIDataSource {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameAPIResponse>;
  postMove: (move: Move) => Promise<GameAPIResponse>;
}

export class TTTAPIDataSource extends RESTDataSource
  implements ITTTAPIDataSource {
  context!: DataSourceContext;

  initialize(config: DataSourceConfig<DataSourceContext>) {
    this.context = config.context;
  }

  getAllGames(): Promise<GameResponse[]> {
    throw new Error("not implemented");
  }

  getGameById(id: string): Promise<GameAPIResponse> {
    throw new Error("not implemented");
  }

  postMove(move: Move): Promise<GameAPIResponse> {
    throw new Error("not implemented");
  }
}
