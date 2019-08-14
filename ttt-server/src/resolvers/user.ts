import { assertNever } from "../common";
import { TTTContext } from "../environment";
import { User } from "../generated/models";
import { LOGGED_IN, LOGGED_OUT } from "../model";

export const me = (context: TTTContext): User | null => {
  const { userStatus } = context;
  return userStatus.kind === LOGGED_IN ? userStatus.user : null;
};

export const login = async (email: string, context: TTTContext) => {
  const {
    dataSources: { gameStore },
    userStatus
  } = context;
  let userEmail;

  switch (userStatus.kind) {
    case LOGGED_IN:
      userEmail = userStatus.user.email;
      break;
    case LOGGED_OUT:
      const user = await gameStore.findOrCreateUser(email);
      userEmail = user.email;
      break;
    default:
      assertNever(userStatus);
  }

  return userEmail ? new Buffer(userEmail).toString("base64") : null;
};
