import { failure, isFailure, success } from "@grancalavera/ttt-etc";
import { IllegalMatchStateError } from "../domain/error";
import { domainFailure } from "../domain/result";
import { PlayMoveCommandHandler } from "./support";
import { PlayMove } from "../workflow/support";

export const playMoveCommandHandler: PlayMoveCommandHandler = (dependencies) => async (
  command
) => {
  const findResult = await dependencies.findMatch(command.input.matchId);

  if (isFailure(findResult)) {
    return domainFailure(findResult);
  }

  const { move } = command.input;
  const match = findResult.value;
  const { matchDescription, matchState } = match;

  if (matchState.kind === "New") {
    return success({
      kind: "CreateChallenge",
      input: { matchDescription, move },
    });
  }

  if (matchState.kind === "Game") {
    return success(new PlayMove({ matchDescription, game: matchState, move }));
  }

  return failure([new IllegalMatchStateError(match, ["New", "Game"])]);
};
