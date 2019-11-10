import {
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { isAuth, createAccessToken, createRefreshToken, sendRefreshToken } from "../auth";
import { TTTContext } from "../context";
import { User } from "../entity/user";
import { Response } from "express";

// there's no login in et3, just auto anonymous registration
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
  @Query(() => String)
  ping() {
    console.log("UserResolver.ping()");
    return "pong";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  whoami(@Ctx() { payload }: TTTContext) {
    console.log(JSON.stringify(payload, null, 2));
    return `your user id is ${payload!.userId}`;
  }

  @Mutation(() => RegisterResponse)
  async register(@Ctx() { res, createConnection }: TTTContext): Promise<
    RegisterResponse
  > {
    try {
      const user = new User();
      const connection = await createConnection();
      await connection.manager.save(user);
      await user.reload();
      await connection.close();
      sendRefreshToken(res, createRefreshToken(user));
      return { user, accessToken: createAccessToken(user) };
    } catch (e) {
      console.error("failed to register anonymous user");
      console.error(e);
      throw new Error("unknown error");
    }
  }
}
