import { UserEntity } from "entity/user-entity";
import { openChannel } from "./channel-store";

export const open = () => (user: UserEntity) => {
  // this function has side effects
  const channelId = openChannel(user.id);
  return channelId;
};
