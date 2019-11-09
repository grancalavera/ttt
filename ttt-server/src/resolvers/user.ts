import { Ctx, Field, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../apollo-middleware/isAuth";
import { TTTContext } from "../context";
import { User } from "../entity/user";

@ObjectType()
class LoginResponse {
  @Field(() => String)
  accessToken!: string;

  @Field(() => User)
  user!: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  ping() {
    return "pong";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  whoami(@Ctx() { payload }: TTTContext) {
    console.log(JSON.stringify(payload, null, 2));
    return `your user id is ${payload!.userId}`;
  }
}
