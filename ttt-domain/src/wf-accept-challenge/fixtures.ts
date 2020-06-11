import { Challenge, CreateGameInput } from "model";
import { alice, defaultChallengeId, defaultGameId } from "test";
import { toChallenger, toOpponent, bob } from "test/players";

export const alicesChallenge: Challenge = {
  challengeId: defaultChallengeId,
  challenger: toChallenger(alice),
  position: 0,
};

export const aliceAcceptsHerOwnChallenge: CreateGameInput = {
  challenge: alicesChallenge,
  gameId: defaultGameId,
  opponent: toOpponent(alice),
  position: 0,
};

export const bobAcceptsAlicesChalengeWithHerSamePosition: CreateGameInput = {
  challenge: alicesChallenge,
  gameId: defaultGameId,
  opponent: toOpponent(bob),
  position: 0,
};

export const bobAcceptsAlicesChalengeWithHisOwnPosition: CreateGameInput = {
  challenge: alicesChallenge,
  gameId: defaultGameId,
  opponent: toOpponent(bob),
  position: 1,
};
