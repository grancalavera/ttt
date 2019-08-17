import { pubsub, PUBSUB_MOVE_PLAYED, PUBSUB_GAME_CHANGED } from "../pubsub";
import { MovePlayed, Game } from "../generated/models";
import { ResolverFn, FilterFn, withFilter } from "apollo-server";

const resolveMovePlayedSubscription: ResolverFn = () =>
  pubsub.asyncIterator([PUBSUB_MOVE_PLAYED]);

const filterMovePlayedSubscription: FilterFn = (
  { movePlayed }: { movePlayed: MovePlayed },
  { gameId }
) => {
  return gameId === movePlayed.gameId;
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

export const subscribeToGameChanged = withFilter(
  resolveGameChangedSubscription,
  filterGameChangedSubscription
);

export const subscribeToMovePlayed = withFilter(
  resolveMovePlayedSubscription,
  filterMovePlayedSubscription
);