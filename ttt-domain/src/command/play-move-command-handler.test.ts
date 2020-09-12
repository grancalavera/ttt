import { failure, Result, success } from "@grancalavera/ttt-etc/dist/result"
import {
  DomainError,
  IllegalMatchStateError,
  MatchNotFoundError,
} from "../domain/error"
import { Game, Match, MatchDescription } from "../domain/model"
import {
  alice,
  bob,
  CommandScenario,
  matchId,
  mockCommandDependencies,
} from "../test-support"
import { CreateChallenge, PlayMove, WorkflowInput } from "../workflow/support"
import { playMoveCommandHandler } from "./play-move-command-handler"
import { PlayMoveCommand } from "./support"

const spyOnFindMatch = jest.fn()
const mock = mockCommandDependencies({ spyOnFindMatch })
const matchDescription: MatchDescription = { owner: alice, id: matchId }

const newMatch: Match = {
  ...matchDescription,
  state: { kind: "New" },
}

const gameMatchState: Game = {
  kind: "Game",
  players: [alice, bob],
  moves: [[alice, 0]],
  next: bob,
}

const gameMatch: Match = {
  ...matchDescription,
  state: gameMatchState,
}

const challengeMatch: Match = {
  ...matchDescription,
  state: { kind: "Challenge", move: [alice, 0] },
}

const drawMatch: Match = {
  ...matchDescription,
  state: { kind: "Draw", players: [alice, bob], moves: [[alice, 0]] },
}

const victoryMatch: Match = {
  ...matchDescription,
  state: {
    kind: "Victory",
    players: [alice, bob],
    moves: [[alice, 0]],
    winner: [alice, []],
  },
}

const scenarios: CommandScenario<PlayMoveCommand>[] = [
  {
    name: "match not found",
    handleCommand: playMoveCommandHandler(mock()),
    command: new PlayMoveCommand({ matchId, move: [alice, 1] }),
    expected: failure([new MatchNotFoundError(matchId)]),
  },
  {
    name: "illegal match state: Challenge",
    handleCommand: playMoveCommandHandler(
      mock({ matchToFind: challengeMatch }),
    ),
    command: new PlayMoveCommand({ matchId, move: [bob, 1] }),
    expected: failure([
      new IllegalMatchStateError(challengeMatch, ["New", "Game"]),
    ]),
  },
  {
    name: "illegal match state: Draw",
    handleCommand: playMoveCommandHandler(mock({ matchToFind: drawMatch })),
    command: new PlayMoveCommand({ matchId, move: [bob, 1] }),
    expected: failure([new IllegalMatchStateError(drawMatch, ["New", "Game"])]),
  },
  {
    name: "illegal match state: Victory",
    handleCommand: playMoveCommandHandler(mock({ matchToFind: victoryMatch })),
    command: new PlayMoveCommand({ matchId, move: [bob, 1] }),
    expected: failure([
      new IllegalMatchStateError(victoryMatch, ["New", "Game"]),
    ]),
  },
  {
    name: "create challenge",
    handleCommand: playMoveCommandHandler(mock({ matchToFind: newMatch })),
    command: new PlayMoveCommand({ matchId, move: [alice, 0] }),
    expected: success(
      new CreateChallenge({ matchDescription, move: [alice, 0] }),
    ),
  },
  {
    name: "play move",
    handleCommand: playMoveCommandHandler(mock({ matchToFind: gameMatch })),
    command: new PlayMoveCommand({ matchId, move: [bob, 1] }),
    expected: success(
      new PlayMove({ matchDescription, game: gameMatchState, move: [bob, 1] }),
    ),
  },
]

describe.each(scenarios)("play move command handler", (scenario) => {
  const { name, handleCommand, command, expected } = scenario
  let actual: Result<WorkflowInput, DomainError[]>

  beforeEach(async () => {
    spyOnFindMatch.mockClear()
    actual = await handleCommand(command)
  })

  describe(name, () => {
    it("command", () => {
      expect(actual).toEqual(expected)
    })

    it("side effects", () => {
      expect(spyOnFindMatch).toHaveBeenCalledTimes(1)
    })
  })
})
