import { Request, Response } from "express";
import { SecureResolver } from "./auth";
import { UsersDataSource } from "data-sources/users";
import { GamesDataSource } from "data-sources/games";
import { ITTTAPIDataSource } from "data-sources/ttt-api";

export interface DataSources {
  users: UsersDataSource;
  games: GamesDataSource;
  api: ITTTAPIDataSource;
}

export type DataSourceContext = WithRequestResponse & WithSecureResolver;
export type Context = WithDataSources & WithRequestResponse & WithSecureResolver;
export type WebSocketContext = WithSecureResolver;

interface WithRequestResponse {
  req: Request;
  res: Response;
}

interface WithSecureResolver {
  secure: SecureResolver;
}

interface WithDataSources {
  dataSources: DataSources;
}
