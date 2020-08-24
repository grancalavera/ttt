import { failure, isFailure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import { arePlayersTheSame, IllegalMatchStateError } from "../support";
import { CreateChallengeWorkflow, IllegalMatchOwnerError } from "./workflow";

export const createChallengeWorkflow: CreateChallengeWorkflow = (dependencies) => async (
  input
) => {
  const { findMatch, upsertMatch } = dependencies;
  const { move } = input;
  const [player] = move;

  const findResult = await findMatch(input.matchId);

  if (isFailure(findResult)) {
    return findResult;
  }

  const match = findResult.value;

  if (!arePlayersTheSame(match.owner, player)) {
    return failure(new IllegalMatchOwnerError(input));
  }

  if (match.state.kind !== "New") {
    return failure(new IllegalMatchStateError(input, "New", match.state.kind));
  }

  const challengeMatch: Match = { ...match, state: { kind: "Challenge", move } };

  const upsertResult = await upsertMatch(challengeMatch);

  return isSuccess(upsertResult) ? success(challengeMatch) : upsertResult;
};
