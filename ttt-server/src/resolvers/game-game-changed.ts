import { FilterFn, ResolverFn, withFilter } from "apollo-server";
import { UserEntity } from "entity/user-entity";
import { WebSocketContext } from "../context";
import { Subscription, SubscriptionGameChangedArgs } from "../generated/graphql";
import { pubSub, PUBSUB_GAME_CHANNEL } from "../pub-sub";
import { doesGameBelongsToChannel, doesUserBelongsToChannel } from "./channel-store";

type SubscriptionGameChanged = Pick<Subscription, "gameChanged">;

const resolveGameChannelSubscription: ResolverFn = () =>
  pubSub.asyncIterator([PUBSUB_GAME_CHANNEL]);

const filterGameChangedSubscription: FilterFn = (
  { gameChanged }: SubscriptionGameChanged,
  { channelId }: SubscriptionGameChangedArgs,
  context: WebSocketContext
) => {
  return context.secure(user => {
    ensureUserBelongsToChannel(channelId, user);
    return doesGameBelongsToChannel(channelId, gameChanged.id);
  });
};

export const subscribeToGameChanged = {
  subscribe: withFilter(resolveGameChannelSubscription, filterGameChangedSubscription),
};

const ensureUserBelongsToChannel = (channelId: string, user: UserEntity) => {
  if (!doesUserBelongsToChannel(channelId, user.id)) {
    throw new Error(`user "${user.id}" does belong to channel "${channelId}"`);
  }
};
