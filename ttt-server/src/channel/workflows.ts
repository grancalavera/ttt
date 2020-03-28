import { UserEntity } from "entity/user-entity";
import { pubSub, PUBSUB_CLOSE_CHANNEL, PUBSUB_OPEN_CHANNEL } from "../pub-sub";

export interface OpenChannelEvent {
  owner: UserEntity;
}

export const openChannel = async (e: OpenChannelEvent) => {
  console.log("open channel");
};

export const closeChannel = async () => {
  console.log("close channel");
};

export const validateChannelBelongsToUser = async () => {};

pubSub.subscribe(PUBSUB_OPEN_CHANNEL, openChannel);
pubSub.subscribe(PUBSUB_CLOSE_CHANNEL, closeChannel);
