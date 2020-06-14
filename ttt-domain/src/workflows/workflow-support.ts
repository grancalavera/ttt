import { Challenger, Opponent, Player, Players, Position } from "../model";
import { AsyncResult } from "../result";

export interface UniqueIdProducer {
  readonly getUniqueId: () => string;
}

export type Find<TRef, T, E> = (ref: TRef) => AsyncResult<T, E>;
export type Create<T, E> = (data: T) => AsyncResult<void, E>;
export type Update<TRef, T, E> = (ref: TRef, data: T) => AsyncResult<void, E>;

export const challengerToPlayer = ({ challengerId }: Challenger): Player => ({
  playerId: challengerId,
});

export const opponentToPlayer = ({ opponentId }: Opponent): Player => ({
  playerId: opponentId,
});

export const arePlayersTheSame = ([p1, p2]: Players) => p1.playerId === p2.playerId;

export const arePositionsTheSame = ([pos1, pos2]: [Position, Position]) => pos1 === pos2;
