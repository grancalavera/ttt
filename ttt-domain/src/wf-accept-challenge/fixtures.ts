import { Challenge, CreateGameInput } from "model";
import { alice, defaultChallengeId } from "test";
import { bob, toChallenger, toOpponent } from "test/players";

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
