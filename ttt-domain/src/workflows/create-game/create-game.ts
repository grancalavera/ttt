import { failure, isFailure, success, isSuccess } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import {
  arePlayersTheSame,
  IllegalMatchStateError,
  IllegalMoveError,
  TooManyActiveMatchesError,
  workflowFailure,
} from "../support";
import { CreateGameWorkflow, IllegalGameOpponentError } from "./workflow";

export const createGameWorkflow: CreateGameWorkflow = (dependencies) => async (input) => {
  const { countActiveMatches, maxActiveMatches, findMatch, upsertMatch } = dependencies;
  const [player] = input.move;

  const activeMatches = await countActiveMatches(player);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(player, maxActiveMatches)]);
  }

  const findResult = await findMatch(input.matchId);
  if (isFailure(findResult)) {
    return workflowFailure(findResult);
  }

  const match = findResult.value;
  if (match.state.kind !== "Challenge") {
    return failure([new IllegalMatchStateError(input, "Challenge", match.state.kind)]);
  }

  if (arePlayersTheSame(match.owner, player)) {
    return failure([new IllegalGameOpponentError(input)]);
  }

  if (match.state.move[1] === input.move[1]) {
    return failure([new IllegalMoveError(input)]);
  }

  const gameMatch: Match = {
    ...match,
    state: {
      kind: "Game",
      players: [match.owner, player],
      moves: [match.state.move, input.move],
      next: match.owner,
    },
  };

  const upsertResult = await upsertMatch(gameMatch);

  return isSuccess(upsertResult) ? success(gameMatch) : workflowFailure(upsertResult);
};
