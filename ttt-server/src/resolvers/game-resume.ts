import { Context } from "context";
import { UserEntity } from "entity/user-entity";
import { GameResumeMutationInput, GameResumeMutationResult } from "generated/graphql";

export const resume = (input: GameResumeMutationInput, ctx: Context) => (
  user: UserEntity
): GameResumeMutationResult => {
  const { channelId, gameId } = input;
  console.log(`resume game ${gameId} on channel ${channelId}`);
  return { ok: true };
};
