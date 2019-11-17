import { Response } from "express";
import {
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import {
  createAccessToken,
  createRefreshToken,
  isAuth,
  sendRefreshToken
} from "../auth";
import { TTTContext } from "../context";
import { User } from "../entity/user";
import { getRepository } from "typeorm";

// there's no login in ttt, just auto anonymous registration
// if your refresh token expires your user becomes unreachable
// and a new user is created
// must somehow handle stale games, a game in which some user has
// not played in time t

@ObjectType()
class RegisterResponse {
  @Field(() => String)
  accessToken!: string;

  @Field(() => User)
  user!: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  whoami(@Ctx() { payload }: TTTContext) {
    console.log(JSON.stringify(payload, null, 2));
    return `your user id is ${payload!.userId}`;
  }

  @Mutation(() => RegisterResponse)
  async register(@Ctx() { res }: TTTContext): Promise<RegisterResponse> {
    const { user, accessToken } = await registerUser(res);
    return { user, accessToken };
  }
}

export const registerUser = async (res: Response) => {
  const user = new User();
  await user.save();
  await user.reload();
  sendRefreshToken(res, createRefreshToken(user));
  return {
    user,
    accessToken: createAccessToken(user)
  };
};
