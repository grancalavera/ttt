import { failure, isFailure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Challenge, GameSettings, Match, MatchId, Move } from "../domain/model";
import {
  arePlayersTheSame,
  CountActiveMatches,
  CreateWorkflow,
  FindMatch,
  UpsertMatch,
  workflowFailure,
} from "./support";
import {
  IllegalMatchChallengerError,
  IllegalMatchStateError,
  TooManyActiveMatchesError,
} from "./workflow-error";

export type Dependencies = FindMatch & UpsertMatch & CountActiveMatches & GameSettings;
export type Input = { matchId: MatchId; move: Move };
type Workflow = CreateWorkflow<Dependencies, Input>;

export const createChallenge: Workflow = (dependencies) => async (input) => {
  const { findMatch, upsertMatch, countActiveMatches, maxActiveMatches } = dependencies;
  const { move, matchId } = input;
  const [challenger] = move;

  const activeMatches = await countActiveMatches(challenger);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(challenger, maxActiveMatches)]);
  }

  const findResult = await findMatch(matchId);

  if (isFailure(findResult)) {
    return workflowFailure(findResult);
  }

  const match = findResult.value;

  if (!arePlayersTheSame(match.owner, challenger)) {
    return failure([new IllegalMatchChallengerError(match.id, challenger)]);
  }

  if (match.state.kind !== "New") {
    return failure([new IllegalMatchStateError(matchId, "New", match.state.kind)]);
  }

  const challengeMatch: Match = { ...match, state: applyStateTransition(move) };

  const upsertResult = await upsertMatch(challengeMatch);

  return isSuccess(upsertResult)
    ? success(challengeMatch)
    : workflowFailure(upsertResult);
};

const applyStateTransition = (move: Move): Challenge => ({ kind: "Challenge", move });
