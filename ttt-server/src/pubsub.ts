import { PubSub } from "apollo-server";

export const PUBSUB_GAME = "PUBSUB_GAME";
export const PUBSUB_MOVES = "PUBSUB_MOVES";

export const pubsub = new PubSub();
