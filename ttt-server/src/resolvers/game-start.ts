import { isJust } from "@grancalavera/ttt-core";
import { UserEntity } from "entity/user-entity";
import { GameStartMutationInput, GameStartMutationResult } from "generated/graphql";
import { Context } from "context";

export const start = (input: GameStartMutationInput, ctx: Context) => (
  user: UserEntity
): GameStartMutationResult => {
  const { gameId, channelId } = input;
  if (isJust(gameId)) {
    return { ok: false };
  } else {
    return { ok: false };
  }
};
