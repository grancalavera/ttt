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

export interface DataSourceContext {
  req: Request;
  res: Response;
  secure: SecureResolver;
}

export type Context = DataSourceContext & { dataSources: DataSources };
