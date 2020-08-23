import { Player } from "../domain/model";
import { WorkflowResult } from "../workflows/support";
import { success, failure } from "../../../ttt-etc/dist";
import { WorkflowError } from "../workflows/errors";

export const alice: Player = { id: "alice" };
export const bob: Player = { id: "bob" };
export const illegalPlayer: Player = { id: "illegalPlayer" };

export const narrowScenarios = <T extends unknown>(scenarios: T[]) => (
  start?: number,
  end?: number
): T[] => (start === undefined ? scenarios : scenarios.slice(start, end));
