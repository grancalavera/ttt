import { isSuccess, success } from "@grancalavera/ttt-etc";
import { CreateGame, CreateMatch, WorkflowInput } from "../workflow/support";
import { JoinGameCommandHandler } from "./support";

export const joinGameCommandHandler: JoinGameCommandHandler = (dependencies) => async (
  command
) => {
  const findResult = await dependencies.findFirstChallenge();

  if (isSuccess(findResult)) {
    const [matchDescription, challenge] = findResult.value;

    return success<WorkflowInput>(
      new CreateGame({ matchDescription, challenge, opponent: command.input.player })
    );
  }

  return success<WorkflowInput>(new CreateMatch({ owner: command.input.player }));
};
