import { Resolver, Mutation, UseMiddleware } from "type-graphql";
import { isAuth } from "../auth";

@Resolver()
export class GameResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  join() {
    return true;
  }
}
