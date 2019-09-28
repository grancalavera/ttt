import { CorePlayer, CorePosition } from "@grancalavera/ttt-core";
import uuid from "uuid/v4";
import { GameOverError, playMove, PositionPlayedError, WrongTurnError } from "./move";
import { create, StandaloneMoveModel as MoveModel } from "../store";

const FirstGameID = uuid();
const NineMovesGameId = uuid();
const AliceWinsGameId = uuid();

const Alice: CorePlayer = "O";
const AlicesFirstMove: CorePosition = 1;

const Bob: CorePlayer = "X";
const BobsFirstMove: CorePosition = 2;

beforeAll(async () => {
  await create("./controller-move.test.sqlite").sync({ force: true });
});

describe(`Given there are no moves on game ${FirstGameID}`, () => {
  describe(`When ${Alice} plays ${AlicesFirstMove} on game ${FirstGameID}`, () => {
    let moves: MoveModel[];
    let lastMove: MoveModel;

    beforeAll(async () => {
      await playMove(FirstGameID, Alice, AlicesFirstMove);
      moves = await MoveModel.findAll({ where: { gameId: FirstGameID } });
      lastMove = moves[moves.length - 1];
    });

    it(`then there should exist only 1 move on game ${FirstGameID}`, () => {
      expect(moves.length).toBe(1);
    });

    it(`and ${Alice} should be the player on the last move`, () => {
      expect(lastMove.player).toBe(Alice);
    });

    it(`and ${AlicesFirstMove} should be the position on the last move`, () => {
      expect(lastMove.position).toBe(AlicesFirstMove);
    });
  });

  describe(`When ${Alice} tries to play a move on ${FirstGameID} but it's ${Bob}'s turn`, () => {
    const playWrongTurn = async () => playMove(FirstGameID, Alice, AlicesFirstMove);

    it(`then ${AlicesFirstMove} should not be allowed to play because is not ${Alice}'s turn`, async () => {
      await expect(playWrongTurn()).rejects.toThrowError(new WrongTurnError(Alice));
    });
  });

  describe(`When ${Bob} tries to play ${AlicesFirstMove} on ${FirstGameID} but ${Alice} has already played ${AlicesFirstMove}`, () => {
    const playPlayedPosition = async () => playMove(FirstGameID, Bob, AlicesFirstMove);

    it(`then ${Bob} should not be allowed to play because ${AlicesFirstMove} has been played already`, async () => {
      await expect(playPlayedPosition()).rejects.toThrowError(
        new PositionPlayedError(Alice, AlicesFirstMove)
      );
    });
  });

  describe(`When Bob plays the second move on ${FirstGameID}`, () => {
    let moves: MoveModel[];
    let lastMove: MoveModel;

    beforeAll(async () => {
      await playMove(FirstGameID, Bob, BobsFirstMove);
      moves = await MoveModel.findAll({ where: { gameId: FirstGameID } });
      lastMove = moves[moves.length - 1];
    });

    it(`then there should exist 2 moves on ${FirstGameID}`, () => {
      expect(moves.length).toBe(2);
    });

    it(`and ${Bob} should be the player on the last move`, () => {
      expect(lastMove.player).toBe(Bob);
    });

    it(`and ${BobsFirstMove} should be the position on the last move`, () => {
      expect(lastMove.position).toBe(BobsFirstMove);
    });
  });
});

describe(`Given ${Alice} played the 9th move on game ${NineMovesGameId}`, () => {
  beforeAll(async () => {
    await MoveModel.bulkCreate(
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(position => ({
        id: uuid(),
        gameId: NineMovesGameId,
        position,
        player: Alice
      })),
      { logging: false }
    );
  });

  describe(`When ${Bob} plays a move on game ${NineMovesGameId}`, () => {
    const playMoveOnGameOver = async () => playMove(NineMovesGameId, Bob, 0);

    it(`then ${Bob}'s move should not be allowed because the game ${NineMovesGameId} is over`, async () => {
      await expect(playMoveOnGameOver()).rejects.toThrowError(
        new GameOverError(NineMovesGameId)
      );
    });
  });
});

describe(`Given ${Alice} has won game ${AliceWinsGameId} before the 9th move`, () => {
  beforeAll(async () => {
    await MoveModel.bulkCreate(
      [0, 1, 2].map(position => ({
        id: uuid(),
        gameId: AliceWinsGameId,
        position,
        player: Alice
      })),
      { logging: false }
    );
  });

  describe(`When ${Bob} plays a move on game ${AliceWinsGameId}`, () => {
    const playMoveOnGameOver = async () => playMove(AliceWinsGameId, Bob, 3);

    it(`then ${Bob} should not be allowed to play because the game ${AliceWinsGameId} is over`, async () => {
      await expect(playMoveOnGameOver()).rejects.toThrowError(
        new GameOverError(AliceWinsGameId)
      );
    });
  });
});
