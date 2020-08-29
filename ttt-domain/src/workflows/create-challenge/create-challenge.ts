import { failure, isFailure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match, MatchId, Move } from "../../domain/model";
import {
  arePlayersTheSame,
  CreateWorkflow,
  FindMatch,
  UpsertMatch,
  workflowFailure,
} from "../support";
import { IllegalMatchOwnerError, IllegalMatchStateError } from "../workflow-error";

export type Dependencies = FindMatch & UpsertMatch;
export type Input = { matchId: MatchId; move: Move };
type Workflow = CreateWorkflow<Dependencies, Input>;

export const createChallenge: Workflow = (dependencies) => async (input) => {
  const { findMatch, upsertMatch } = dependencies;
  const { move, matchId } = input;
  const [player] = move;

  const findResult = await findMatch(matchId);

  if (isFailure(findResult)) {
    return workflowFailure(findResult);
  }

  const match = findResult.value;

  if (!arePlayersTheSame(match.owner, player)) {
    return failure([new IllegalMatchOwnerError(match.id, player)]);
  }

  if (match.state.kind !== "New") {
    return failure([new IllegalMatchStateError(matchId, "New", match.state.kind)]);
  }

  const challengeMatch: Match = { ...match, state: { kind: "Challenge", move } };

  const upsertResult = await upsertMatch(challengeMatch);

  return isSuccess(upsertResult)
    ? success(challengeMatch)
    : workflowFailure(upsertResult);
};
