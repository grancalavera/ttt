import { SecureResolver } from "auth";
import { Context, DataSourceContext, DataSources } from "context";
import { GamesDataSource } from "data-sources/games";
import { UsersDataSource } from "data-sources/users";
import { UserEntity } from "entity/user-entity";
import { Request, Response } from "express";

export const mockContext = (user?: UserEntity): Context => {
  const req = mockReq();
  const res = mockRes();
  const secure = mockSecureResolver(user);
  const dataSources = mockDataSources({ req, res, secure });
  return { req, res, secure, dataSources };
};

const mockReq = () => {
  const req = {};
  return req as Request;
};

const mockRes = () => {
  const res = {};
  return res as Response;
};

const mockSecureResolver: (
  user?: UserEntity
) => SecureResolver = user => async runEffect => {
  if (user) {
    return runEffect(user);
  } else {
    throw new Error("not authorized");
  }
};

const mockDataSources = (context: DataSourceContext): DataSources => {
  const config = {
    context,
    cache: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    },
  };

  const dataSources = {
    users: new UsersDataSource(),
    games: new GamesDataSource(),
  };

  Object.values(dataSources).forEach(dataSource =>
    dataSource.initialize(config)
  );

  return dataSources;
};
