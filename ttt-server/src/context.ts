import { Request, Response } from "express";
import { SecureResolver } from "./auth";
import { UsersDataSource } from "data-sources/users";
import { GamesDataSource } from "data-sources/games";

export interface DataSources {
  users: UsersDataSource;
  games: GamesDataSource;
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
