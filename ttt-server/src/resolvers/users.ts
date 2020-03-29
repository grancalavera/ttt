import { Context } from "context";
import { UserRegisterMutationResult } from "generated/graphql";

export const register = async (ctx: Context): Promise<UserRegisterMutationResult> => {
  const user = await ctx.dataSources.users.register();
  return user;
};
