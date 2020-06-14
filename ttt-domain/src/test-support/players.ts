import { Player, Challenger, Opponent } from "../model";

export const alice: Player = { playerId: "alice" };
export const bob: Player = { playerId: "bob" };
export const chris: Player = { playerId: "chris" };
export const dave: Player = { playerId: "dave" };

export const toChallenger = ({ playerId }: Player): Challenger => ({
  challengerId: playerId,
});

export const toOpponent = ({ playerId }: Player): Opponent => ({
  opponentId: playerId,
});
