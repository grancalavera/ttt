import express, { ErrorRequestHandler } from "express";
import { router } from "./router";

export const app = express();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errors = err.errors || ["Unknown internal error"];
  res.status(status);
  res.json({ errors });
};

app.use(express.json());
app.use(router);
app.use(errorHandler);
