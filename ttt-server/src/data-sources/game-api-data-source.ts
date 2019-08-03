import { RESTDataSource } from "apollo-datasource-rest";
import { GameResponse, MovesResponse } from "@grancalavera/ttt-api";
import { Move, Player } from "../generated/models";
import {
  Move as CoreMove,
  Player as CorePlayer,
  Position as CorePosition,
  coerceToPlayer,
  coerceToPosition
} from "@grancalavera/ttt-core";

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

const corePlayerFromMove = (move: Move): CorePlayer => coerceToPlayer(move.avatar);

const corePositionFromMove = (move: Move): CorePosition =>
  [move.position]
    .map(p => p.replace("P", ""))
    .map(p => parseInt(p))
    .map(p => coerceToPosition(p))[0];

export const coreMoveFromMove = (move: Move): CoreMove => [
  corePlayerFromMove(move),
  corePositionFromMove(move)
];
