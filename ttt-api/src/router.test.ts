import express from "express";
import request from "supertest";
import {
  router,
  InvalidPlayer,
  InvalidPosition,
  invalidPlayer,
  invalidPosition
} from "./router";
import { create } from "./store";
import { CorePlayer } from "@grancalavera/ttt-core";
import uuid from "uuid/v4";

const app = express();
app.use(router);

beforeAll(async () => {
  await create("./router.test.sqlite").sync({ force: true });
});

interface POSTMoveValidationExpectation {
  player: string;
  position: number;
  expected: {
    status: number;
    body: object | undefined;
  };
}

describe.each`
  player | position | expected
  ${"x"} | ${0}     | ${{ status: 400, body: { errors: [invalidPlayer("x")] } }}
  ${"o"} | ${0}     | ${{ status: 400, body: { errors: [invalidPlayer("o")] } }}
  ${"o"} | ${9}     | ${{ status: 400, body: { errors: [invalidPlayer("o"), invalidPosition(9)] } }}
  ${"X"} | ${9}     | ${{ status: 400, body: { errors: [invalidPosition(9)] } }}
  ${"O"} | ${0}     | ${{ status: 200 }}
  ${"X"} | ${0}     | ${{ status: 200 }}
  ${"O"} | ${1}     | ${{ status: 200 }}
  ${"X"} | ${1}     | ${{ status: 200 }}
  ${"O"} | ${2}     | ${{ status: 200 }}
  ${"X"} | ${2}     | ${{ status: 200 }}
  ${"O"} | ${3}     | ${{ status: 200 }}
  ${"X"} | ${3}     | ${{ status: 200 }}
  ${"O"} | ${4}     | ${{ status: 200 }}
  ${"X"} | ${4}     | ${{ status: 200 }}
  ${"O"} | ${5}     | ${{ status: 200 }}
  ${"X"} | ${5}     | ${{ status: 200 }}
  ${"O"} | ${6}     | ${{ status: 200 }}
  ${"X"} | ${6}     | ${{ status: 200 }}
  ${"O"} | ${7}     | ${{ status: 200 }}
  ${"X"} | ${7}     | ${{ status: 200 }}
  ${"O"} | ${8}     | ${{ status: 200 }}
  ${"X"} | ${8}     | ${{ status: 200 }}
`("Given $player played $position", expectation => {
  const { player, position, expected }: POSTMoveValidationExpectation = expectation;
  const { status, body } = expected;

  it(`Then we expect a response with status ${status} and ${
    body ? "errors in the body" : "without a body"
  }`, async () => {
    await request(app)
      .post("/moves")
      .send({ position, player, gameId: uuid() })
      .expect(status)
      .then(response => {
        expect(response.body).toEqual(body);
      });
  });
});
