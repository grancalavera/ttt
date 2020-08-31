import { isFailure } from "@grancalavera/ttt-etc";
import { Match, Moves } from "../domain/model";
import { domainFailure } from "../domain/result";
import { nextPlayer, PlayMoveWorkflow } from "./support";

export const playMove: PlayMoveWorkflow = (dependencies) => async (input) => {
  const { upsertMatch } = dependencies;
  const { matchDescription, game, move } = input;

  const moves = [...game.moves, move] as Moves;
  const [player] = move;

  const match: Match = {
    matchDescription,
    matchState: { ...game, moves, next: nextPlayer(player, game.players) },
  };

  const upsertResult = await upsertMatch(match);

  if (isFailure(upsertResult)) {
    return domainFailure(upsertResult);
  }

  throw new Error("PlayMoveWorkflow not implemented");
};
