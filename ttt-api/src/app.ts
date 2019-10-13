import express, { ErrorRequestHandler } from "express";
import { router } from "./router";

export const mkApp = (baseUrl: string) =>
  express()
    .use(express.json())
    .use(baseUrl, router)
    .use(errorHandler);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const body = err.body || {};
  res.status(status);
  res.json(body);
};
