import { isSome, none, Option, some } from "@grancalavera/ttt-etc";
import { Moves, Player, Position, Winner } from "../domain/model";
import { columns, diagonals, rows } from "./board";

export const findWinner = (size: number, moves: Moves): Option<Winner> => {
  const winSequences = [...rows(size), ...columns(size), ...diagonals(size)];
  const findPlayer = playerFinder(moves);

  let winnerOption: Option<Winner> = none;

  for (const winSequence of winSequences) {
    const players = winSequence.map(findPlayer);
    const first = players[0] ?? none;

    if (
      // first move in the win sequence was played
      isSome(first) &&
      // every move in the sequence was played by the same player
      players.every((o) => isSome(o) && o.value.id === first.value.id)
    ) {
      winnerOption = some([first.value, winSequence]);
      break;
    }
  }

  return winnerOption;
};

const playerFinder = (moves: Moves) => (position: Position): Option<Player> => {
  const move = moves.find(([, p]) => p === position);
  return move ? some(move[0]) : none;
};
