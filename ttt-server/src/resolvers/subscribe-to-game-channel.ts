import { FilterFn, ResolverFn, withFilter } from "apollo-server";
import { GameChannelMessage, SubscriptionGameChannelArgs } from "../generated/graphql";
import { PUBSUB_GAME_CHANNEL, pubSub } from "./pub-sub";

const resolveGameChannelSubscription: ResolverFn = () =>
  pubSub.asyncIterator([PUBSUB_GAME_CHANNEL]);

const filterGameChannelSubscription: FilterFn = (
  message: GameChannelMessage,
  args: SubscriptionGameChannelArgs
) => {
  const result = message.channelId === args.channelId;
  return result;
};

export const subscribeToGameChannel = {
  subscribe: withFilter(resolveGameChannelSubscription, filterGameChannelSubscription),
};
