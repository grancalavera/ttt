import { Router } from "express";

export const home = Router();
home.get("/", (_, res) => res.redirect("/graphql"));
