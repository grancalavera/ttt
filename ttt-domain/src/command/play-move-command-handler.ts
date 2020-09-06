import { failure, isFailure, success } from "@grancalavera/ttt-etc";
import { IllegalMatchStateError } from "../domain/error";
import { domainFailure } from "../domain/result";
import { PlayMoveCommandHandler } from "./support";
import { PlayMove } from "../workflow/support";
import { extractMatchDescription } from "../domain/model";

export const playMoveCommandHandler: PlayMoveCommandHandler = (dependencies) => async (
  command
) => {
  const findResult = await dependencies.findMatch(command.input.matchId);

  if (isFailure(findResult)) {
    return domainFailure(findResult);
  }

  const { move } = command.input;
  const match = findResult.value;
  const matchDescription = extractMatchDescription(match);

  if (match.state.kind === "New") {
    return success({
      kind: "CreateChallenge",
      input: { matchDescription, move },
    });
  }

  if (match.state.kind === "Game") {
    return success(new PlayMove({ matchDescription, game: match.state, move }));
  }

  return failure([new IllegalMatchStateError(match, ["New", "Game"])]);
};
