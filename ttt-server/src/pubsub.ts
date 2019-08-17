import { PubSub } from "apollo-server";

export const PUBSUB_GAME_ADDED = "PUBSUB_GAME_ADDED";
export const PUBSUB_GAME_CHANGED = "PUBSUB_GAME_CHANGED";
export const PUBSUB_MOVE_PLAYED = "PUBSUB_MOVE_PLAYED";

// TODO: move to datasource
export const pubsub = new PubSub();
