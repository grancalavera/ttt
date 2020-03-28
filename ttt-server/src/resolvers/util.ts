import { UserEntity } from "entity/user-entity";
import { pubSub, PUBSUB_GAME_CHANNEL } from "../pub-sub";
import { GameChannelMessage } from "generated/graphql";

export const ping = () => {
  const gameChannel: GameChannelMessage = { channelId: "ping", game: "pong" };
  pubSub.publish(PUBSUB_GAME_CHANNEL, { gameChannel });
  return "pong";
};
export const whoami = (user: UserEntity) => user.id;
