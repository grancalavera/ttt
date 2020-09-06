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
  | IllegalChallengerError
  | IllegalGameOpponentError
  | IllegalMatchStateError
  | IllegalMoveError
  | MatchNotFoundError
  | NoChallengesFoundError
  | TooManyActiveMatchesError
  | UnknownKindError
  | UnknownPlayerError
  | UpsertFailedError
  | WrongTurnError
  | ZeroError;

export const includesErrorOfKind = (errors: DomainError[]) => (
  ...kinds: NonEmptyArray<DomainError["kind"]>
) => errors.some((e) => kinds.includes(e.kind));

export class ZeroError {
  readonly kind = "ZeroError";
  readonly message = "zero: an iteration or recursion didn't happen as expected";
}

export class UnknownKindError {
  readonly kind = "UnknownKindError";
  get message() {
    return `unknown on type ${this.typename}`;
  }
  constructor(readonly typename: string) {}
}

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";
  get message() {
    return `player ${this.player.id} already reached the max count of ${this.maxActiveMatches} active matches`;
  }
  constructor(readonly player: Player, readonly maxActiveMatches: number) {}
}

export class NoChallengesFoundError {
  readonly kind = "NoChallengesFoundError";
}

export class MatchNotFoundError {
  readonly kind = "MatchNotFoundError";
  get message() {
    return `match ${this.matchId} not found`;
  }
  constructor(readonly matchId: MatchId) {}
}

export class UpsertFailedError {
  readonly kind = "UpsertFailedError";
  get message() {
    return `failed to upsert match ${this.match.id}`;
  }
  constructor(readonly match: Match) {}
}

export class IllegalMatchStateError {
  readonly kind = "IllegalMatchStateError";
  get message() {
    return `match ${
      this.match.id
    } is on an illegal state: wanted any state of ${this.wantedStates.join(
      ", "
    )}, actual state ${this.match.state.kind}`;
  }
  constructor(readonly match: Match, readonly wantedStates: MatchStateName[]) {}
}

export class IllegalMoveError {
  readonly kind = "IllegalMoveError";
  get message() {
    return `position ${this.position} already played on match ${this.matchDescription.id}`;
  }
  constructor(readonly matchDescription: MatchDescription, readonly position: Position) {}
}

export class IllegalChallengerError {
  readonly kind = "IllegalChallengerError";
  get message() {
    return `illegal challenger ${this.challenger.id} for match ${this.matchDescription.id} owned by player ${this.matchDescription.owner.id}: a challenger must own the game`;
  }
  constructor(readonly matchDescription: MatchDescription, readonly challenger: Player) {}
}

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message() {
    return `${this.opponent.id} cannot be both the owner and opponent on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly opponent: Player) {}
}

export class UnknownPlayerError {
  readonly kind = "UnknownPlayerError";
  get message() {
    return `player ${this.unknownPlayer.id} does not belong to match ${this.matchDescription.id}`;
  }
  constructor(
    readonly matchDescription: MatchDescription,
    readonly unknownPlayer: Player
  ) {}
}

export class WrongTurnError {
  readonly kind = "WrongTurnError";
  get message() {
    return `is not ${this.wrongTurnPlayer.id} turn in match ${this.matchDescription.id}`;
  }
  constructor(
    readonly matchDescription: MatchDescription,
    readonly wrongTurnPlayer: Player
  ) {}
}
