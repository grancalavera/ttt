import express from "express";
import console = require("console");

import { store, GameModel, MoveModel } from "./store";
import { Match } from "@grancalavera/ttt-core";

const app = express();
const port = 5000;

app.get("/ttt/", (req, res) => {
  GameModel.findAll({
    include: [{ model: MoveModel, as: "moves" }]
  })
    .then(games => {
      res.json(games.map(({ id, moves }) => ({ gameId: id, moves })));
    })
    .catch(e => {
      console.log(e);
      console.log(e.stack);
      res.status(500);
      res.json({
        message: e.message
      });
    });
});

app.post("/ttt/", (req, res) => {
  GameModel.create().then(game => {
    res.json({
      gameId: game.id,
      moves: []
    });
  });
});

app.get("/ttt/:gameId", (req, res) => {
  res.json({ id: req.params.gameId });
});

app.get("/ttt/:gameId/moves", (req, res) => {
  res.json([]);
});

app.post("/ttt/:gameId/moves", (req, res) => {
  res.json({});
});

app.get("/ttt/:gameId/moves/:moveId", (req, res) => {
  res.json({ moveId: req.params.moveId });
});

store.sync().then(() => {
  app.listen(port, () => {
    console.log(`server started at  http://localhost:${port}`);
  });
});
