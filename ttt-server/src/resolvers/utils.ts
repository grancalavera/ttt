import { Query, Resolver } from "type-graphql";

@Resolver()
export class UtilsResolver {
  @Query(() => String)
  ping() {
    return "pong";
  }
}
