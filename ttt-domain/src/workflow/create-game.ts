import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { IllegalGameOpponentError, TooManyActiveMatchesError } from "../domain/error";
import { Challenge, Game, Match, Player } from "../domain/model";
import { domainFailure } from "../domain/result";
import { arePlayersTheSame, CreateGameWorkflow } from "./support";

export const createGame: CreateGameWorkflow = (dependencies) => async (input) => {
  const { countActiveMatches, maxActiveMatches, upsertMatch } = dependencies;
  const { matchDescription, challenge, opponent } = input;

  const activeMatches = await countActiveMatches(opponent);
  if (maxActiveMatches <= activeMatches) {
    return failure([new TooManyActiveMatchesError(opponent, maxActiveMatches)]);
  }

  if (arePlayersTheSame(matchDescription.owner, opponent)) {
    return failure([new IllegalGameOpponentError(matchDescription.id, opponent)]);
  }

  const gameMatch: Match = {
    ...matchDescription,
    state: applyStateTransition(challenge, opponent),
  };

  const upsertResult = await upsertMatch(gameMatch);

  return isSuccess(upsertResult) ? success(gameMatch) : domainFailure(upsertResult);
};

const applyStateTransition = (challenge: Challenge, opponent: Player): Game => ({
  kind: "Game",
  players: [challenge.move[0], opponent],
  moves: [challenge.move],
  next: opponent,
});
