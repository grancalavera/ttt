import express, { ErrorRequestHandler } from "express";
import request from "supertest";
import { router } from "./router";

jest.mock("./services/game");
jest.mock("./services/move");

const app = express().use(express.json());

app.use(router);

interface POSTMoveFixture {
  gameId?: string;
  player: string;
  position: number;
  status: number;
}

describe.each`
  gameId       | player | position | status
  ${"game-id"} | ${"x"} | ${0}     | ${500}
  ${"game-id"} | ${"o"} | ${0}     | ${500}
  ${"game-id"} | ${"X"} | ${-1}    | ${500}
  ${"game-id"} | ${"o"} | ${9}     | ${500}
  ${"game-id"} | ${"X"} | ${9}     | ${500}
  ${undefined} | ${"X"} | ${0}     | ${500}
  ${undefined} | ${"o"} | ${9}     | ${500}
  ${"game-id"} | ${"O"} | ${0}     | ${200}
  ${"game-id"} | ${"X"} | ${0}     | ${200}
  ${"game-id"} | ${"O"} | ${1}     | ${200}
  ${"game-id"} | ${"X"} | ${1}     | ${200}
  ${"game-id"} | ${"O"} | ${2}     | ${200}
  ${"game-id"} | ${"X"} | ${2}     | ${200}
  ${"game-id"} | ${"O"} | ${3}     | ${200}
  ${"game-id"} | ${"X"} | ${3}     | ${200}
  ${"game-id"} | ${"O"} | ${4}     | ${200}
  ${"game-id"} | ${"X"} | ${4}     | ${200}
  ${"game-id"} | ${"O"} | ${5}     | ${200}
  ${"game-id"} | ${"X"} | ${5}     | ${200}
  ${"game-id"} | ${"O"} | ${6}     | ${200}
  ${"game-id"} | ${"X"} | ${6}     | ${200}
  ${"game-id"} | ${"O"} | ${7}     | ${200}
  ${"game-id"} | ${"X"} | ${7}     | ${200}
  ${"game-id"} | ${"O"} | ${8}     | ${200}
  ${"game-id"} | ${"X"} | ${8}     | ${200}
`('Given $player played $position on game "$gameId"', fixture => {
  const { gameId, player, position, status }: POSTMoveFixture = fixture;

  it(`Then we expect a response with status ${status} and ${
    status === 400 ? "errors in the body" : "an empty body"
  }`, async () => {
    await request(app)
      .post("/moves")
      .send({ position, player, gameId })
      .expect(status);
  });
});
