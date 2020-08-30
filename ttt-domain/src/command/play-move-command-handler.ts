import { failure, isFailure, success } from "@grancalavera/ttt-etc";
import { IllegalMatchStateError } from "../domain/error";
import { getMatchDescription } from "../domain/model";
import { domainFailure } from "../domain/result";
import { PlayMoveCommandHandler } from "./support";

export const playMoveCommandHandler: PlayMoveCommandHandler = (dependencies) => async (
  command
) => {
  const findResult = await dependencies.findMatch(command.input.matchId);

  if (isFailure(findResult)) {
    return domainFailure(findResult);
  }

  const move = command.input.move;
  const match = findResult.value;
  const matchDescription = getMatchDescription(match);
  const { state } = match;

  if (state.kind === "Challenge") {
    return success({
      kind: "CreateChallenge",
      input: { matchDescription, move },
    });
  }

  if (state.kind === "Game") {
    return success({
      kind: "PlayMove",
      input: { matchDescription, move, game: state },
    });
  }

  return failure([new IllegalMatchStateError(match, ["Challenge", "Game"])]);
};
