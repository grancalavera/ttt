import { Challenger, Opponent, Player } from "../domain/model";
import { AsyncResult } from "@grancalavera/ttt-etc";

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

export const arePlayersTheSame = (p1: Player, p2: Player) => p1.playerId === p2.playerId;
