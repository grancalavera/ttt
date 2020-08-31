import { failure, isFailure, success } from "@grancalavera/ttt-etc";
import { UnknownPlayerError, WrongTurnError, IllegalMoveError } from "../domain/error";
import { Match, Moves } from "../domain/model";
import { domainFailure } from "../domain/result";
import { PlayMoveWorkflow } from "./support";

export const playMove: PlayMoveWorkflow = (dependencies) => async (input) => {
  const { upsertMatch } = dependencies;
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

  const [p1, p2] = game.players;
  const next = player.id === p1.id ? p2 : p1;
  const moves = [...game.moves, move] as Moves;

  const match: Match = {
    matchDescription,
    matchState: { ...game, moves, next },
  };

  const upsertResult = await upsertMatch(match);

  return isFailure(upsertResult) ? domainFailure(upsertResult) : success(match);
};
