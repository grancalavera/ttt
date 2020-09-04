import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { TooManyActiveMatchesError } from "../domain/error";
import { CreateGame, CreateMatch, WorkflowInput } from "../workflow/support";
import { JoinGameCommandHandler } from "./support";

export const joinGameCommandHandler: JoinGameCommandHandler = (dependencies) => async (
  command
) => {
  const { findFirstChallenge, countActiveMatches, maxActiveMatches } = dependencies;

  const activeMatches = await countActiveMatches(command.input.player);
  if (maxActiveMatches <= activeMatches) {
    return failure([
      new TooManyActiveMatchesError(command.input.player, maxActiveMatches),
    ]);
  }

  const findResult = await findFirstChallenge();

  if (isSuccess(findResult)) {
    const [matchDescription, challenge] = findResult.value;

    return success<WorkflowInput>(
      new CreateGame({ matchDescription, challenge, opponent: command.input.player })
    );
  }

  return success<WorkflowInput>(new CreateMatch({ owner: command.input.player }));
};
