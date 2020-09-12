import {
  AsyncResult,
  failure,
  isFailure,
  Result,
  softAssertNever,
} from "@grancalavera/ttt-etc";
import { joinGameCommandHandler } from "./command/join-game-command-handler";
import { playMoveCommandHandler } from "./command/play-move-command-handler";
import {
  Command,
  CountActiveMatches,
  FindFirstChallenge,
  FindMatch,
} from "./command/support";
import { DomainError, UnknownKindError } from "./domain/error";
import { Match } from "./domain/model";
import { GameSettings } from "./system/support";
import { createChallenge } from "./workflow/create-challenge";
import { createGame } from "./workflow/create-game";
import { createMatch } from "./workflow/create-match";
import { createMove } from "./workflow/create-move";
import { GetUniqueId, UpsertMatch, WorkflowInput } from "./workflow/support";

export type BuildPipeline = (dependencies: PipelineDependencies) => RunPipeline;
export type RunPipeline = (command: Command) => AsyncResult<Match, DomainError[]>;

export const buildPipeline: BuildPipeline = (dependencies) => async (command) => {
  // handle command

  const handleJoinGame = joinGameCommandHandler(dependencies);
  const handlePlayMove = playMoveCommandHandler(dependencies);

  let commandResult: Result<WorkflowInput, DomainError[]> = failure([
    new UnknownKindError("Command"),
  ]);

  switch (command.kind) {
    case "JoinGameCommand":
      commandResult = await handleJoinGame(command);
      break;
    case "PlayMoveCommand":
      commandResult = await handlePlayMove(command);
      break;
    default:
      softAssertNever(command, "unknown command kind");
  }

  if (isFailure(commandResult)) {
    return commandResult;
  }

  // run workflow

  const runCreateMatch = createMatch(dependencies);
  const runCreateChallenge = createChallenge(dependencies);
  const runCreateGame = createGame(dependencies);
  const runCreateMove = createMove(dependencies);

  let workflowResult: Result<Match, DomainError[]> = failure([
    new UnknownKindError("WorkflowInput"),
  ]);

  const workflowInput = commandResult.value;
  switch (workflowInput.kind) {
    case "CreateMatch":
      workflowResult = await runCreateMatch(workflowInput.input);
      break;
    case "CreateChallenge":
      workflowResult = await runCreateChallenge(workflowInput.input);
      break;
    case "CreateGame":
      workflowResult = await runCreateGame(workflowInput.input);
      break;
    case "PlayMove":
      workflowResult = await runCreateMove(workflowInput.input);
      break;
    default:
      softAssertNever(workflowInput, "unknown workflow kind");
  }

  return workflowResult;
};

// prettier-ignore
type PipelineDependencies =
  & GameSettings
  & GetUniqueId
  & UpsertMatch
  & CountActiveMatches
  & FindFirstChallenge
  & FindMatch;
