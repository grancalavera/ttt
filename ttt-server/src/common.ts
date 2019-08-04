import {
  coerceToPlayer,
  coerceToPosition,
  CoreMove,
  CorePlayer,
  CorePosition
} from "@grancalavera/ttt-core";

import { Avatar, Move } from "./generated/models";

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}

export const chooseAvatar = (): Avatar => (Math.random() < 0.5 ? Avatar.X : Avatar.O);

const corePlayerFromMove = (move: Move): CorePlayer => coerceToPlayer(move.avatar);

const corePositionFromMove = (move: Move): CorePosition =>
  [move.position]
    .map(p => p.replace("P", ""))
    .map(p => parseInt(p))
    .map(p => coerceToPosition(p))[0];

export const coreMoveFromMove = (move: Move): CoreMove => [
  corePlayerFromMove(move),
  corePositionFromMove(move)
];
