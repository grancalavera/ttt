import { failure, isFailure, isSuccess, success } from "@grancalavera/ttt-etc";
import { CountActiveMatches, FindMatch, UpsertMatch } from "..";
import { Challenge, Game, GameSettings, Match, MatchId, Player } from "../domain/model";
import { arePlayersTheSame, CreateWorkflow, workflowFailure } from "./support";
import {
  IllegalGameOpponentError,
  IllegalMatchStateError,
  TooManyActiveMatchesError,
} from "./workflow-error";

export type Dependencies = GameSettings & FindMatch & UpsertMatch & CountActiveMatches;
export type Input = { matchId: MatchId; opponent: Player };
type Workflow = CreateWorkflow<Dependencies, Input>;

export const createGame: Workflow = (dependencies) => async (input) => {
  const { countActiveMatches, maxActiveMatches, findMatch, upsertMatch } = dependencies;
  const { matchId, opponent } = input;

  const activeMatches = await countActiveMatches(opponent);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(opponent, maxActiveMatches)]);
  }

  const findResult = await findMatch(input.matchId);
  if (isFailure(findResult)) {
    return workflowFailure(findResult);
  }

  const match = findResult.value;
  if (match.state.kind !== "Challenge") {
    return failure([new IllegalMatchStateError(matchId, "Challenge", match.state.kind)]);
  }

  if (arePlayersTheSame(match.owner, opponent)) {
    return failure([new IllegalGameOpponentError(match.id, opponent)]);
  }

  const gameMatch: Match = {
    ...match,
    state: applyStateTransition(match.state, opponent),
  };

  const upsertResult = await upsertMatch(gameMatch);

  return isSuccess(upsertResult) ? success(gameMatch) : workflowFailure(upsertResult);
};

const applyStateTransition = (challenge: Challenge, opponent: Player): Game => ({
  kind: "Game",
  players: [challenge.move[0], opponent],
  moves: [challenge.move],
  next: opponent,
});
