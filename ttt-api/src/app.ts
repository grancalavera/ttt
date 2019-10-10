import express, { ErrorRequestHandler } from "express";
import { router } from "./router";

export const app = express();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errors = err.errors || [err.message];
  res.status(status);
  res.json({ errors });
};

app.use(express.json());
app.use("/ttt", router);
app.use(errorHandler);
