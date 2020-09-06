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
  readonly message: string;
  constructor(readonly typename: string) {
    this.message = `unknown on type ${this.typename}`;
  }
}

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";
  readonly message: string;
  constructor(readonly player: Player, readonly maxActiveMatches: number) {
    this.message = `player ${this.player.id} already reached the max count of ${this.maxActiveMatches} active matches`;
  }
}

export class NoChallengesFoundError {
  readonly kind = "NoChallengesFoundError";
}

export class MatchNotFoundError {
  readonly kind = "MatchNotFoundError";
  readonly message: string;
  constructor(readonly matchId: MatchId) {
    this.message = `match ${this.matchId} not found`;
  }
}

export class UpsertFailedError {
  readonly kind = "UpsertFailedError";
  readonly message: string;
  constructor(readonly match: Match) {
    this.message = `failed to upsert match ${this.match.id}`;
  }
}

export class IllegalMatchStateError {
  readonly kind = "IllegalMatchStateError";
  readonly message: string;
  constructor(readonly match: Match, readonly wantedStates: MatchStateName[]) {
    this.message = `match ${
      this.match.id
    } is on an illegal state: wanted any state of ${this.wantedStates.join(
      ", "
    )}, actual state ${this.match.state.kind}`;
  }
}

export class IllegalMoveError {
  readonly kind = "IllegalMoveError";
  readonly message: string;

  constructor(readonly matchDescription: MatchDescription, readonly position: Position) {
    this.message = `position ${this.position} already played on match ${this.matchDescription.id}`;
  }
}

export class IllegalChallengerError {
  readonly kind = "IllegalChallengerError";
  readonly message: string;
  constructor(readonly matchDescription: MatchDescription, readonly challenger: Player) {
    this.message = `illegal challenger ${this.challenger.id} for match ${this.matchDescription.id} owned by player ${this.matchDescription.owner.id}: a challenger must own the game`;
  }
}

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  readonly message: string;
  constructor(readonly matchId: MatchId, readonly opponent: Player) {
    this.message = `${this.opponent.id} cannot be both the owner and opponent on match ${this.matchId}`;
  }
}

export class UnknownPlayerError {
  readonly kind = "UnknownPlayerError";
  readonly message: string;
  constructor(
    readonly matchDescription: MatchDescription,
    readonly unknownPlayer: Player
  ) {
    this.message = `player ${this.unknownPlayer.id} does not belong to match ${this.matchDescription.id}`;
  }
}

export class WrongTurnError {
  readonly kind = "WrongTurnError";
  readonly message: string;
  constructor(
    readonly matchDescription: MatchDescription,
    readonly wrongTurnPlayer: Player
  ) {
    this.message = `is not ${this.wrongTurnPlayer.id} turn in match ${this.matchDescription.id}`;
  }
}
