import { Request, Response } from "express";
import { SecureResolver } from "./auth";
import { UsersDataSource } from "data-sources/users";
import { GamesDataSource } from "data-sources/games";

export interface TTTDataSources {
  users: UsersDataSource;
  games: GamesDataSource;
}

export interface TTTContext {
  req: Request;
  res: Response;
  secure: SecureResolver;
  dataSources: TTTDataSources;
}
