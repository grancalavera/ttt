import { NonEmptyArray } from "@grancalavera/ttt-etc"

// aggregate root

export interface Match extends MatchDescription {
  readonly state: MatchState
}

export interface MatchDescription {
  readonly id: MatchId
  readonly owner: Player
}

export type MatchState = New | Challenge | Game | GameOver
export type MatchStateName = MatchState["kind"]

// states

export interface New {
  readonly kind: "New"
}

export interface Challenge {
  readonly kind: "Challenge"
  readonly move: Move
}

export interface Game extends GameBaseState {
  readonly kind: "Game"
  readonly next: Player
}

export type GameOver = Draw | Victory

export interface Draw extends GameBaseState {
  readonly kind: "Draw"
}

export interface Victory extends GameBaseState {
  readonly kind: "Victory"
  readonly winner: Winner
}

// domain objects

export type Players = [Player, Player]
export type Move = [Player, Position]
export type Moves = NonEmptyArray<Move>
export type Winner = [Player, Position[]]

export interface Player {
  readonly id: PlayerId
}

export type PlayerId = Id
export type MatchId = Id
export type Position = number
type Id = string

interface GameBaseState {
  readonly players: Players
  readonly moves: Moves
}

// support

export const extractMatchDescription = ({
  id,
  owner,
}: Match): MatchDescription => ({
  id,
  owner,
})
