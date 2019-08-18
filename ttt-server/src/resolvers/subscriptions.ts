import {
  pubsub,
  PUBSUB_MOVE_PLAYED,
  PUBSUB_GAME_CHANGED,
  PUBSUB_GAME_ADDED,
  PUBSUB_USER_CREATED
} from "../pubsub";
import { MovePlayed, Game } from "../generated/models";
import { ResolverFn, FilterFn, withFilter } from "apollo-server";

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

const resolveMovePlayedSubscription: ResolverFn = () =>
  pubsub.asyncIterator([PUBSUB_MOVE_PLAYED]);

const filterMovePlayedSubscription: FilterFn = (
  { movePlayed }: { movePlayed: MovePlayed },
  { gameId }
) => {
  return gameId === movePlayed.gameId;
};

export const subscribeToUserCreated = { subscribe: resolveUserCreatedSubscription };

export const subscribeToGameAdded = { subscribe: resolveGameAddedSubscription };

export const subscribeToGameChanged = {
  subscribe: withFilter(resolveGameChangedSubscription, filterGameChangedSubscription)
};

export const subscribeToMovePlayed = {
  subscribe: withFilter(resolveMovePlayedSubscription, filterMovePlayedSubscription)
};
