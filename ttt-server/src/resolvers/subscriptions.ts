import { FilterFn, ResolverFn, withFilter } from "apollo-server";
import { Game } from "../generated/models";
import {
  pubsub,
  PUBSUB_GAME_ADDED,
  PUBSUB_GAME_CHANGED,
  PUBSUB_USER_CREATED
} from "../pubsub";

const resolveGameAddedSubscription: ResolverFn = () => {
  return pubsub.asyncIterator([PUBSUB_GAME_ADDED]);
};

const resolveUserCreatedSubscription: ResolverFn = () => {
  return pubsub.asyncIterator([PUBSUB_USER_CREATED]);
};

const resolveGameChangedSubscription: ResolverFn = () => {
  return pubsub.asyncIterator([PUBSUB_GAME_CHANGED]);
};

const filterGameChangedSubscription: FilterFn = (
  { gameChanged }: { gameChanged: Game },
  { gameId }
) => {
  return gameId === gameChanged.id;
};

export const subscribeToUserCreated = { subscribe: resolveUserCreatedSubscription };

export const subscribeToGameAdded = { subscribe: resolveGameAddedSubscription };

export const subscribeToGameChanged = {
  subscribe: withFilter(resolveGameChangedSubscription, filterGameChangedSubscription)
};
