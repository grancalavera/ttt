import { FilterFn, ResolverFn, withFilter } from "apollo-server";
import { UserEntity } from "entity/user-entity";
import { WebSocketContext } from "../context";
import { Subscription, SubscriptionGameChannelArgs } from "../generated/graphql";
import { pubSub, PUBSUB_GAME_CHANNEL } from "./pub-sub";

type SubscriptionGameChannel = Pick<Subscription, "gameChannel">;

const resolveGameChannelSubscription: ResolverFn = () =>
  pubSub.asyncIterator([PUBSUB_GAME_CHANNEL]);

const filterGameChannelSubscription: FilterFn = (
  { gameChannel }: SubscriptionGameChannel,
  { channelId }: SubscriptionGameChannelArgs,
  context: WebSocketContext
) => {
  return context.secure(user => {
    ensureChannelBelongsToUser(gameChannel.channelId, user);
    const result = gameChannel.channelId === channelId;
    return result;
  });
};

export const subscribeToGameChannel = {
  subscribe: withFilter(resolveGameChannelSubscription, filterGameChannelSubscription),
};

// here we need to make sure the user owns the channel
const ensureChannelBelongsToUser = (channelId: string, user: UserEntity) => {
  throw new Error(`user ${user.id} does not own channel ${channelId}`);
};
