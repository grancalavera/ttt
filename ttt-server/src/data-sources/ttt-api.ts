import {
  ErrorResponse,
  GameResponse,
  isErrorResponse,
  Move,
} from "@grancalavera/ttt-api";
import { RESTDataSource } from "apollo-datasource-rest";

export type GameAPIResponse = GameResponse | ErrorResponse;

export interface ITTTAPIDataSource {
  getAllGames: () => Promise<GameResponse[]>;
  getGameById: (id: string) => Promise<GameAPIResponse>;
  postMove: (move: Move) => Promise<GameAPIResponse>;
}

export class TTTAPIDataSource extends RESTDataSource implements ITTTAPIDataSource {
  constructor(readonly baseURL: string) {
    super();
  }

  getAllGames(): Promise<GameResponse[]> {
    throw new Error("TTTAPIDataSource.getAllGames not implemented");
  }

  async getGameById(id: string) {
    const result = await captureError(() => this.get<GameResponse>(`ttt/${id}`));
    return result;
  }

  postMove(move: Move): Promise<GameAPIResponse> {
    throw new Error("TTTAPIDataSource.postMove not implemented");
  }
}

const captureError = async <T>(effect: () => Promise<T>): Promise<T | ErrorResponse> => {
  try {
    return await effect();
  } catch (e) {
    const errorResponse: ErrorResponse = e?.extensions?.response?.body;
    if (isErrorResponse(errorResponse)) {
      return errorResponse;
    } else {
      throw e;
    }
  }
};
