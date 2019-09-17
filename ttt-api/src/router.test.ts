import express from "express";
import request from "supertest";
import uuid from "uuid/v4";
import { invalidPlayer, invalidPosition, router } from "./router";

const app = express().use(express.json());
app.use(router);

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
  ${"X"} | ${-1}    | ${{ status: 400, body: { errors: [invalidPosition(-1)] } }}
  ${"X"} | ${9}     | ${{ status: 400, body: { errors: [invalidPosition(9)] } }}
  ${"O"} | ${0}     | ${{ status: 200, body: {} }}
  ${"X"} | ${0}     | ${{ status: 200, body: {} }}
  ${"O"} | ${1}     | ${{ status: 200, body: {} }}
  ${"X"} | ${1}     | ${{ status: 200, body: {} }}
  ${"O"} | ${2}     | ${{ status: 200, body: {} }}
  ${"X"} | ${2}     | ${{ status: 200, body: {} }}
  ${"O"} | ${3}     | ${{ status: 200, body: {} }}
  ${"X"} | ${3}     | ${{ status: 200, body: {} }}
  ${"O"} | ${4}     | ${{ status: 200, body: {} }}
  ${"X"} | ${4}     | ${{ status: 200, body: {} }}
  ${"O"} | ${5}     | ${{ status: 200, body: {} }}
  ${"X"} | ${5}     | ${{ status: 200, body: {} }}
  ${"O"} | ${6}     | ${{ status: 200, body: {} }}
  ${"X"} | ${6}     | ${{ status: 200, body: {} }}
  ${"O"} | ${7}     | ${{ status: 200, body: {} }}
  ${"X"} | ${7}     | ${{ status: 200, body: {} }}
  ${"O"} | ${8}     | ${{ status: 200, body: {} }}
  ${"X"} | ${8}     | ${{ status: 200, body: {} }}
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
