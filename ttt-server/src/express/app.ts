import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { auth } from "./auth";
import { home } from "./home";

export const mkApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.use(home);
  app.use(auth);
  return app;
};
