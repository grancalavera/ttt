import { UserEntity } from "entity/user-entity";
import { openChannel } from "./channel-store";
import { GameOpenMutationResult } from "generated/graphql";

export const open = () => (user: UserEntity): GameOpenMutationResult => {
  // this function has side effects
  const channelId = openChannel(user.id);
  return { channelId };
};
