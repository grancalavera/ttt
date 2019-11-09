import { Query, Resolver, ObjectType, Field } from "type-graphql";
import fieldConfig from "graphql-query-complexity/dist/estimators/fieldConfig";
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
  hello() {
    return "hi";
  }
}

// import { TTTContext } from "../environment";
// import { LoginResult, User } from "../generated/models";
// import { userFromModel } from "../model";
// import { pubsub, PUBSUB_USER_CREATED } from "../pubsub";
// import uuid from "uuid";

// export const getMe = (context: TTTContext): User | null => {
//   const { userStatus } = context;
//   return userStatus.isLoggedIn ? userStatus.user : null;
// };

// export const login = async (
//   context: TTTContext,
//   id: string | null | undefined
// ): Promise<LoginResult> => {
//   const {
//     dataSources: { gameStore },
//     userStatus
//   } = context;

//   if (userStatus.isLoggedIn) {
//     return {
//       user: { id: userStatus.user.id },
//       created: false
//     };
//   } else {
//     const { userModel, created } = await gameStore.findOrCreateUser(id || uuid());
//     if (created) {
//       pubsub.publish(PUBSUB_USER_CREATED, { userCreated: userFromModel(userModel) });
//     }
//     return {
//       user: { id: userModel.id },
//       created
//     };
//   }
// };

// export const getAllUsers = async (context: TTTContext) => {
//   const userModels = await context.dataSources.gameStore.findAllUsers();
//   const users = userModels.map(userFromModel);
//   return users;
// };
