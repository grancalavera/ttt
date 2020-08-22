import { Challenge, Game } from "../../domain/model";
import {
  alice,
  bob,
  defaultChallengeId,
  defaultGameId,
  toChallenger,
  toOpponent,
} from "../../test/support";
import { CreateGameInput } from "./workflow";

export const alicesChallenge: Challenge = {
  challengeId: defaultChallengeId,
  challenger: toChallenger(alice),
  challengerPosition: 0,
};

export const aliceAcceptsHerOwnChallengeWithTheSamePosition: CreateGameInput = {
  challenge: alicesChallenge,
  opponent: toOpponent(alice),
  opponentPosition: 0,
};

export const aliceAcceptsHerOwnChallengeWithOtherPosition: CreateGameInput = {
  challenge: alicesChallenge,
  opponent: toOpponent(alice),
  opponentPosition: 1,
};

export const bobAcceptsAlicesChalengeWithHerSamePosition: CreateGameInput = {
  challenge: alicesChallenge,
  opponent: toOpponent(bob),
  opponentPosition: 0,
};

export const bobAcceptsAlicesChalengeWithHisOwnPosition: CreateGameInput = {
  challenge: alicesChallenge,
  opponent: toOpponent(bob),
  opponentPosition: 1,
};

export const aliceChallengesBobGame: Game = {
  gameId: defaultGameId,
  players: [alice, bob],
  moves: [
    [alice, 0],
    [bob, 1],
  ],
  size: 3,
  status: { kind: "OpenGame", next: alice },
};
