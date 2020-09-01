import {
  failure,
  isFailure,
  isSome,
  none,
  Option,
  some,
  success,
} from "@grancalavera/ttt-etc";
import { IllegalMoveError, UnknownPlayerError, WrongTurnError } from "../domain/error";
import { Match, MatchState, Moves, Player, Position, Winner } from "../domain/model";
import { domainFailure } from "../domain/result";
import { PlayMoveWorkflow } from "./support";

export const playMove: PlayMoveWorkflow = (dependencies) => async (input) => {
  const { upsertMatch, gameSize, winSequences } = dependencies;
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
  const winnerOption = findWinner(winSequences, moves);

  let matchState: MatchState;

  if (isSome(winnerOption)) {
    matchState = { kind: "Victory", players, moves, winner: winnerOption.value };
  } else if (moves.length === gameSize * gameSize) {
    matchState = { kind: "Draw", players, moves };
  } else {
    matchState = { kind: "Game", players, moves, next: player.id === p1.id ? p2 : p1 };
  }

  const match: Match = { matchDescription, matchState };
  const upsertResult = await upsertMatch(match);
  return isFailure(upsertResult) ? domainFailure(upsertResult) : success(match);
};

const findWinner = (winSequences: number[][], moves: Moves): Option<Winner> => {
  const findPlayer = playerFinder(moves);

  for (const winSequence of winSequences) {
    const players = winSequence.map(findPlayer);
    const first = players[0] ?? none;

    if (
      // first move in the win sequence was played
      isSome(first) &&
      // every move in the sequence was played by the same player
      players.every((o) => isSome(o) && o.value.id === first.value.id)
    ) {
      return some([first.value, winSequence]);
    }
  }

  return none;
};

const playerFinder = (moves: Moves) => (position: Position): Option<Player> => {
  const move = moves.find(([, p]) => p === position);
  return move ? some(move[0]) : none;
};
