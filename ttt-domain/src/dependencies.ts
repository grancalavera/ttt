import { AsyncResult } from "@grancalavera/ttt-etc";
import { Match, Player } from ".";
import { DomainError } from "./domain/error";

export interface UpsertMatch {
  readonly upsertMatch: (match: Match) => AsyncResult<void, DomainError>;
}

export interface GetUniqueId {
  readonly getUniqueId: () => string;
}

export type CountActiveMatches = {
  countActiveMatches: (player: Player) => Promise<number>;
};

export interface GameSettings {
  readonly gameSize: number;
  readonly maxActiveMatches: number;
}
