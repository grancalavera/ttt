import { NonEmptyArray } from "@grancalavera/ttt-etc";
import {
  Match,
  MatchDescription,
  MatchId,
  MatchStateName,
  Player,
  Position,
} from "./model";

export type DomainError =
  | NoChallengesFoundError
  | TooManyActiveMatchesError
  | MatchNotFoundError
  | UpsertFailedError
  | IllegalMatchStateError
  | IllegalGameOpponentError
  | IllegalChallengerError
  | IllegalMoveError;

export const includesErrorOfKind = (errors: DomainError[]) => (
  ...kinds: NonEmptyArray<DomainError["kind"]>
) => errors.some((e) => kinds.includes(e.kind));

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";
  get message(): string {
    return `player ${this.player.id} already reached the max count of ${this.maxActiveMatches} active matches`;
  }
  constructor(readonly player: Player, readonly maxActiveMatches: number) {}
}

export class NoChallengesFoundError {
  readonly kind = "NoChallengesFoundError";
}

export class MatchNotFoundError {
  readonly kind = "MatchNotFoundError";
  get message(): string {
    return `match ${this.matchId} not found`;
  }
  constructor(readonly matchId: MatchId) {}
}

export class UpsertFailedError {
  readonly kind = "UpsertFailedError";
  constructor(readonly match: Match, readonly message: string) {}
}

export class IllegalMatchStateError {
  readonly kind = "IllegalMatchStateError";
  get message(): string {
    return `match ${
      this.match.matchDescription.id
    } is on an illegal state: wanted any state of ${this.wantedStates.join(
      ", "
    )}, actual state ${this.match.matchState.kind}`;
  }
  constructor(readonly match: Match, readonly wantedStates: MatchStateName[]) {}
}

export class IllegalMoveError {
  readonly kind = "IllegalMoveError";
  get message(): string {
    return `position ${this.position} already played on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly position: Position) {}
}

export class IllegalChallengerError {
  readonly kind = "IllegalChallengerError";
  get message(): string {
    return `illegal challenger ${this.challenger.id} for match ${this.matchDescription.id} owned by player ${this.matchDescription.owner.id}: a challenger must own the game`;
  }
  constructor(readonly matchDescription: MatchDescription, readonly challenger: Player) {}
}

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message(): string {
    return `${this.opponent.id} cannot be both the owner and opponent on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly opponent: Player) {}
}
