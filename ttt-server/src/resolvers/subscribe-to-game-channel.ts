import { FilterFn, ResolverFn, withFilter } from "apollo-server";
import { Subscription, SubscriptionGameChannelArgs } from "../generated/graphql";
import { pubSub, PUBSUB_GAME_CHANNEL } from "./pub-sub";

type SubscriptionGameChannel = Pick<Subscription, "gameChannel">;

const resolveGameChannelSubscription: ResolverFn = () =>
  pubSub.asyncIterator([PUBSUB_GAME_CHANNEL]);

const filterGameChannelSubscription: FilterFn = (
  { gameChannel }: SubscriptionGameChannel,
  { channelId }: SubscriptionGameChannelArgs
) => {
  const result = gameChannel.channelId === channelId;
  return result;
};

export const subscribeToGameChannel = {
  subscribe: withFilter(resolveGameChannelSubscription, filterGameChannelSubscription),
};
