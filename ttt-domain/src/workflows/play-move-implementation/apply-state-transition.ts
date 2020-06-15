import { Game, Move, OpenGame, Player, Players, Winner } from "../../model";
import { findWinner } from "./winners";
import { CreateMoveInput } from "../play-move";

export const applyStateTransition = (input: CreateMoveInput): Game => {
  const { game, player, playerPosition } = input;
  const move: Move = [player, playerPosition];

  if (game.status.kind === "DrawGame" || game.status.kind === "WonGame") {
    return game;
  }

  const moves = [...game.moves, move];
  const maybeWinner: Winner | undefined = findWinner(game.size, moves);

  if (maybeWinner) {
    return { ...game, moves, status: { kind: "WonGame", winner: maybeWinner } };
  }

  if (!maybeWinner && moves.length === game.size * game.size) {
    return { ...game, moves, status: { kind: "DrawGame" } };
  }

  return {
    ...game,
    moves,
    status: { kind: "OpenGame", next: getNextPlayer(game.status, game.players) },
  };
};

const getNextPlayer = ({ next: last }: OpenGame, [p1, p2]: Players): Player =>
  last === p1 ? p2 : p1;
