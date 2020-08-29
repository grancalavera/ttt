import { Match } from "../../domain/model";
import { MoveInput, StandardDependencies, WorkflowResult } from "../support";

export type PlayMoveWorkflow = (dependencies: StandardDependencies) => PlayMove;

export type PlayMove = (input: MoveInput) => WorkflowResult<Match>;
