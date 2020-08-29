import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Challenge, Match, Move } from "../domain/model";
import { arePlayersTheSame, CreateChallengeWorkflow, workflowFailure } from "./support";
import {
  IllegalMatchChallengerError,
  IllegalMatchStateError,
  TooManyActiveMatchesError,
} from "./workflow-error";

export const createChallenge: CreateChallengeWorkflow = (dependencies) => async (
  input
) => {
  const { upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;
  const { match, move } = input;
  const [challenger] = move;

  const activeMatches = await countActiveMatches(challenger);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(challenger, maxActiveMatches)]);
  }

  if (!arePlayersTheSame(match.owner, challenger)) {
    return failure([new IllegalMatchChallengerError(match, challenger)]);
  }

  if (match.state.kind !== "New") {
    return failure([new IllegalMatchStateError(match, "New")]);
  }

  const challengeMatch: Match = { ...match, state: applyStateTransition(move) };

  const upsertResult = await upsertMatch(challengeMatch);

  return isSuccess(upsertResult)
    ? success(challengeMatch)
    : workflowFailure(upsertResult);
};

const applyStateTransition = (move: Move): Challenge => ({ kind: "Challenge", move });
