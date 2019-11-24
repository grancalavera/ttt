import { Request, Response } from "express";
import { SecureResolver } from "./auth";
import { UsersDataSource } from "data-sources/users";
import { GamesDataSource } from "data-sources/games";

export interface DataSources {
  users: UsersDataSource;
  games: GamesDataSource;
}

export interface DataSourceContext {
  req: Request;
  res: Response;
  secure: SecureResolver;
}

export type Context = DataSourceContext & { dataSources: DataSources };
