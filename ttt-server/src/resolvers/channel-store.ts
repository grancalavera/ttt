import uuid from "uuid";

type ChannelId = string;
type UserId = string;

export interface Channel {
  id: ChannelId;
  userId: UserId;
}

const channels: Map<ChannelId, UserId> = new Map();

export const openChannel = (userId: UserId) => {
  const channelId = uuid();
  channels.set(channelId, userId);

  console.log(channels);

  return channelId;
};
