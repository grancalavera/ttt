import { UserEntity } from "entity/user-entity";
import { User } from "generated/graphql";

export const ping = () => "pong";

export const whoami = (user: UserEntity): User => {
  const { id, tokenVersion } = user;
  return { id, tokenVersion };
};
