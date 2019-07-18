import express from "express";
import console = require("console");

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.json([]);
});

app.post("/", (req, res) => {
  res.json({});
});

app.get("/:gameId", (req, res) => {
  res.json({ id: req.params.gameId });
});

app.get("/:gameId/moves", (req, res) => {
  res.json([]);
});

app.post("/:gameId/moves", (req, res) => {
  res.json({});
});

app.get("/:gameId/moves/:moveId", (req, res) => {
  res.json({ moveId: req.params.moveId });
});

app.listen(port, () => {
  console.log(`server started at  http://localhost:${port}`);
});
