import { PubSub } from "apollo-server";

export const PUBSUB_GAME_CHANNEL = "GAME_CHANNEL";
export const PUBSUB_OPEN_CHANNEL = "OPEN_CHANNEL";
export const PUBSUB_CLOSE_CHANNEL = "CLOSE_CHANNEL";

export const pubSub = new PubSub();
