import { isSuccess, success } from "@grancalavera/ttt-etc";
import { domainFailure } from "../domain/result";
import { WorkflowInput } from "../workflow/support";
import { JoinGameCommandHandler } from "./support";

export const joinGameCommandHandler: JoinGameCommandHandler = (dependencies) => async (
  command
) => {
  const findResult = await dependencies.findFirstChallenge();

  if (isSuccess(findResult)) {
    const [matchDescription, challenge] = findResult.value;

    return success<WorkflowInput>({
      kind: "CreateGame",
      input: { matchDescription, challenge, opponent: command.input.player },
    });
  }

  if (findResult.error.kind === "NoChallengesFoundError") {
    return success<WorkflowInput>({
      kind: "CreateMatch",
      input: { owner: command.input.player },
    });
  }

  return domainFailure(findResult);
};
