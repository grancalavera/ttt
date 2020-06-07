import { valid, validations } from "validation";
import { invalidMoveInput, MoveInput, ValidateMove } from "./types";

const validatePlayerExistsInGame: ValidateMove = (input) => {
  const { players, player } = moveInput(input);
  return players.includes(player) ? valid(input) : invalidMovePlayerDoesNotExist(input);
};

const validatePlayerTurn: ValidateMove = (input) => {
  const { moves, player } = moveInput(input);
  if (moves.length === 0) {
    return valid(input);
  }
  const [last] = moves[moves.length - 1];
  return last !== player ? valid(input) : invalidMoveWrongPlayerTurn(input);
};

export const validatePlayer = validations([
  validatePlayerExistsInGame,
  validatePlayerTurn,
]);

export const invalidMovePlayerDoesNotExist = invalidMoveInput(
  "Player in move does not exist in game"
);

export const invalidMoveWrongPlayerTurn = invalidMoveInput(
  "Is not the turn of the player in move"
);

const moveInput = ({ game: { players, moves }, move: [player] }: MoveInput) => ({
  players,
  moves,
  player,
});