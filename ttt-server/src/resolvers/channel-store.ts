import { v4 as uuid } from "uuid";

type ChannelId = string;
type UserId = string;
type GameId = string;

export interface Channel {
  readonly userId: UserId;
  readonly gameId?: GameId;
}

const channels: Map<ChannelId, Channel> = new Map();

export const openChannel = (userId: UserId) => {
  const channelId = uuid();
  channels.set(channelId, { userId });
  return channelId;
};

export const doesGameBelongsToChannel = (channelId: ChannelId, userId: UserId) =>
  channels.get(channelId)?.userId === userId;

export const doesUserBelongsToChannel = (channelId: ChannelId, gameId: GameId) =>
  channels.get(channelId)?.gameId === gameId;
