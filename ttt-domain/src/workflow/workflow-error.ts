import { Match, MatchId, MatchStateName, Player } from "../domain/model";

export type WorkflowError =
  | TooManyActiveMatchesError
  | MatchNotFoundError
  | UpsertFailedError
  | IllegalMatchStateError
  | IllegalGameOpponentError
  | IllegalMatchChallengerError
  | IllegalMoveError;

export class TooManyActiveMatchesError {
  readonly kind = "TooManyActiveMatchesError";
  get message(): string {
    return `player ${this.player.id} already reached the max count of ${this.maxActiveMatches} active matches`;
  }
  constructor(readonly player: Player, readonly maxActiveMatches: number) {}
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
    return `match ${this.match.id} is on an illegal state: wanted state ${this.wantedState}, actual state ${this.match.state.kind}`;
  }
  constructor(readonly match: Match, readonly wantedState: MatchStateName) {}
}

export class IllegalMoveError {
  readonly kind = "IllegalMoveError";
  get message(): string {
    return `position ${this.position} already played on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly position: Position) {}
}

export class IllegalMatchChallengerError {
  readonly kind = "IllegalMatchChallengerError";
  get message(): string {
    return `illegal challenger ${this.player.id} for match ${this.match.id} owned by player ${this.match.owner.id}: a challenger must own the game`;
  }
  constructor(readonly match: Match, readonly player: Player) {}
}

export class IllegalGameOpponentError {
  readonly kind = "IllegalGameOpponentError";
  get message(): string {
    return `${this.opponent.id} cannot be both the owner and opponent on match ${this.matchId}`;
  }
  constructor(readonly matchId: MatchId, readonly opponent: Player) {}
}
