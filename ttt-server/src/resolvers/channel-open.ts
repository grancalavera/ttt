import { UserEntity } from "entity/user-entity";
import { openChannel } from "./channel-store";

export const open = () => (user: UserEntity): string => {
  const channelId = openChannel(user.id);
  return channelId;
};
