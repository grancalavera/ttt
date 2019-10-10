import { CorePosition } from "@grancalavera/ttt-core";
import { GameOverError, PositionPlayedError, WrongTurnError } from "../etc/exceptions";
import {
  alice,
  bob,
  mkGame_gameOverAliceTies,
  mkGame_gameOverAliceWins
} from "../etc/fixtures";
import { create, StandaloneMoveModel as MoveModel } from "../store";
import { playMove } from "./move";

const firstGameID = "first-game";
const nineMovesGameId = "nine-moves-game";
const aliceWinsGameId = "alice-wins-game";

const alicesFirstMove: CorePosition = 1;
const bobsFirstMove: CorePosition = 2;

beforeAll(async () => {
  await create("./controller-move.test.sqlite").sync({ force: true });
});

describe(`Given there are no moves on game ${firstGameID}`, () => {
  describe(`When ${alice} plays ${alicesFirstMove} on game ${firstGameID}`, () => {
    let moves: MoveModel[];
    let lastMove: MoveModel;

    beforeAll(async () => {
      await playMove(firstGameID, alice, alicesFirstMove);
      moves = await MoveModel.findAll({ where: { gameId: firstGameID } });
      lastMove = moves[moves.length - 1];
    });

    it(`then there should exist only 1 move on game ${firstGameID}`, () => {
      expect(moves.length).toBe(1);
    });

    it(`and ${alice} should be the player on the last move`, () => {
      expect(lastMove.player).toBe(alice);
    });

    it(`and ${alicesFirstMove} should be the position on the last move`, () => {
      expect(lastMove.position).toBe(alicesFirstMove);
    });
  });

  describe(`When ${alice} tries to play a move on ${firstGameID} but it's ${bob}'s turn`, () => {
    const playWrongTurn = async () => playMove(firstGameID, alice, alicesFirstMove);

    it(`then ${alicesFirstMove} should not be allowed to play because is not ${alice}'s turn`, async () => {
      await expect(playWrongTurn()).rejects.toThrowError(new WrongTurnError(alice));
    });
  });

  describe(`When ${bob} tries to play ${alicesFirstMove} on ${firstGameID} but ${alice} has already played ${alicesFirstMove}`, () => {
    const playPlayedPosition = async () => playMove(firstGameID, bob, alicesFirstMove);

    it(`then ${bob} should not be allowed to play because ${alicesFirstMove} has been played already`, async () => {
      await expect(playPlayedPosition()).rejects.toThrowError(
        new PositionPlayedError(alice, alicesFirstMove)
      );
    });
  });

  describe(`When Bob plays the second move on ${firstGameID}`, () => {
    let moves: MoveModel[];
    let lastMove: MoveModel;

    beforeAll(async () => {
      await playMove(firstGameID, bob, bobsFirstMove);
      moves = await MoveModel.findAll({ where: { gameId: firstGameID } });
      lastMove = moves[moves.length - 1];
    });

    it(`then there should exist 2 moves on ${firstGameID}`, () => {
      expect(moves.length).toBe(2);
    });

    it(`and ${bob} should be the player on the last move`, () => {
      expect(lastMove.player).toBe(bob);
    });

    it(`and ${bobsFirstMove} should be the position on the last move`, () => {
      expect(lastMove.position).toBe(bobsFirstMove);
    });
  });
});

describe(`Given ${alice} played the 9th move on game ${nineMovesGameId}`, () => {
  beforeAll(async () => mkGame_gameOverAliceTies(nineMovesGameId));

  describe(`When ${bob} plays a move on game ${nineMovesGameId}`, () => {
    const playMoveOnGameOver = async () => playMove(nineMovesGameId, bob, 0);

    it(`then ${bob}'s move should not be allowed because the game ${nineMovesGameId} is over`, async () => {
      await expect(playMoveOnGameOver()).rejects.toThrowError(
        new GameOverError(nineMovesGameId)
      );
    });
  });
});

describe(`Given ${alice} has won game ${aliceWinsGameId} before the 9th move`, () => {
  beforeAll(async () => mkGame_gameOverAliceWins(aliceWinsGameId));

  describe(`When ${bob} plays a move on game ${aliceWinsGameId}`, () => {
    const playMoveOnGameOver = async () => playMove(aliceWinsGameId, bob, 3);

    it(`then ${bob} should not be allowed to play because the game ${aliceWinsGameId} is over`, async () => {
      await expect(playMoveOnGameOver()).rejects.toThrowError(
        new GameOverError(aliceWinsGameId)
      );
    });
  });
});
