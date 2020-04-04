import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import { GameBeginMutationInput, GameBeginMutationResult } from "generated/graphql";

export const begin = (input: GameBeginMutationInput, ctx: Context) => (
  user: UserEntity
): GameBeginMutationResult => {
  const { channelId } = input;
  console.log(`create or join new game on channel ${channelId}`);
  return { ok: true };
};
