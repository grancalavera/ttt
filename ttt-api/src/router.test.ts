import express from "express";
import { isEmpty } from "ramda";
import request from "supertest";
import { invalidPlayer, invalidPosition, missingGameId, router } from "./router";
import "./controller-move";

jest.mock("./controller-move");
const app = express().use(express.json());
app.use(router);

interface POSTMoveValidationExpectation {
  gameId?: string;
  player: string;
  position: number;
  expected: {
    status: number;
    body: object;
  };
}

describe.each`
  gameId       | player | position | expected
  ${"game-id"} | ${"x"} | ${0}     | ${{ status: 400, body: { errors: [invalidPlayer("x")] } }}
  ${"game-id"} | ${"o"} | ${0}     | ${{ status: 400, body: { errors: [invalidPlayer("o")] } }}
  ${"game-id"} | ${"X"} | ${-1}    | ${{ status: 400, body: { errors: [invalidPosition(-1)] } }}
  ${"game-id"} | ${"o"} | ${9}     | ${{ status: 400, body: { errors: [invalidPlayer("o"), invalidPosition(9)] } }}
  ${"game-id"} | ${"X"} | ${9}     | ${{ status: 400, body: { errors: [invalidPosition(9)] } }}
  ${undefined} | ${"X"} | ${0}     | ${{ status: 400, body: { errors: [missingGameId()] } }}
  ${undefined} | ${"o"} | ${9}     | ${{ status: 400, body: { errors: [invalidPlayer("o"), invalidPosition(9), missingGameId()] } }}
  ${"game-id"} | ${"O"} | ${0}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${0}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${1}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${1}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${2}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${2}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${3}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${3}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${4}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${4}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${5}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${5}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${6}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${6}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${7}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${7}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"O"} | ${8}     | ${{ status: 200, body: {} }}
  ${"game-id"} | ${"X"} | ${8}     | ${{ status: 200, body: {} }}
`('Given $player played $position on game "$gameId"', expectation => {
  const {
    gameId,
    player,
    position,
    expected
  }: POSTMoveValidationExpectation = expectation;
  const { status, body } = expected;

  it(`Then we expect a response with status ${status} and ${
    isEmpty(body) ? "an empty body" : "errors in the body"
  }`, async () => {
    await request(app)
      .post("/moves")
      .send({ position, player, gameId })
      .expect(status)
      .then(response => {
        expect(response.body).toEqual(body);
      });
  });
});
