import { failure, isFailure, success, isSome } from "@grancalavera/ttt-etc";
import { IllegalMoveError, UnknownPlayerError, WrongTurnError } from "../domain/error";
import { Match, MatchState, Moves } from "../domain/model";
import { domainFailure } from "../domain/result";
import { PlayMoveWorkflow } from "./support";
import { findWinner } from "./find-winner";

export const playMove: PlayMoveWorkflow = (dependencies) => async (input) => {
  const { upsertMatch, gameSize } = dependencies;
  const { matchDescription, game, move } = input;

  const [player, position] = move;

  const gameIncludesPlayer = game.players.some(({ id }) => id === player.id);
  if (!gameIncludesPlayer) {
    return failure([new UnknownPlayerError(matchDescription, player)]);
  }

  const playerIsNext = game.next.id === player.id;
  if (!playerIsNext) {
    return failure([new WrongTurnError(matchDescription, player)]);
  }

  const positionAlreadyPlayed = game.moves.some(([, p]) => p === position);
  if (positionAlreadyPlayed) {
    return failure([new IllegalMoveError(matchDescription, position)]);
  }

  const { players } = game;
  const [p1, p2] = game.players;
  const moves = [...game.moves, move] as Moves;
  const winnerOption = findWinner(gameSize, moves);

  const matchState: MatchState = isSome(winnerOption)
    ? { players, moves, kind: "Victory", winner: winnerOption.value }
    : moves.length === gameSize * gameSize
    ? { players, moves, kind: "Draw" }
    : { ...game, moves, next: player.id === p1.id ? p2 : p1 };

  const match: Match = { matchDescription, matchState };

  const upsertResult = await upsertMatch(match);

  return isFailure(upsertResult) ? domainFailure(upsertResult) : success(match);
};
