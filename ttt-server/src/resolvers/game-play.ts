import { Context } from "context";
import { PlayInput } from "generated/graphql";
import { UserEntity } from "entity/user-entity";

export const play = (ctx: Context, input: PlayInput) => async (
  user: UserEntity
) => {
  throw new Error("`play` mutation not implemented");
};
