import { failure, isSuccess, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import {
  alice,
  bob,
  matchId,
  maxActiveMatches,
  mockDependencies,
  upsertFailure,
} from "../../test/support";
import {
  IllegalMatchStateError,
  IllegalMoveError,
  MatchNotFoundError,
  MoveInput,
  TooManyActiveMatchesError,
  WorkflowResult,
} from "../support";
import { createGameWorkflow } from "./create-game";
import { CreateGame, IllegalGameOpponentError } from "./workflow";

interface Scenario {
  name: string;
  runWorkflow: CreateGame;
  input: MoveInput;
  expected: WorkflowResult<Match>;
}

const spyOnFind = jest.fn();
const spyOnUpsert = jest.fn();

const matchOnNewState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "New" },
};

const matchOnChallengeState: Match = {
  id: matchId,
  owner: alice,
  state: { kind: "Challenge", move: [alice, 0] },
};

const alicesInvalidInput: MoveInput = { matchId, move: [alice, 1] };
const bobsInvalidInput: MoveInput = { matchId, move: [bob, 0] };
const bobsValidInput: MoveInput = { matchId, move: [bob, 1] };

const scenarios: Scenario[] = [
  {
    name: "too many active matches",
    runWorkflow: createGameWorkflow(mockDependencies({ activeMatches: 1 })),
    input: bobsValidInput,
    expected: failure(new TooManyActiveMatchesError(bob, maxActiveMatches)),
  },
  {
    name: "match not found",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: failure(new MatchNotFoundError(matchId)),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: bobsValidInput,
    expected: failure(new MatchNotFoundError(matchId)),
  },
  {
    name: "illegal match state",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: success(matchOnNewState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInvalidInput,
    expected: failure(
      new IllegalMatchStateError(
        alicesInvalidInput,
        "Challenge",
        matchOnNewState.state.kind
      )
    ),
  },
  {
    name: "illegal challenge opponent",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: success(matchOnChallengeState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: alicesInvalidInput,
    expected: failure(new IllegalGameOpponentError(alicesInvalidInput)),
  },
  {
    name: "illegal move",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: success(matchOnChallengeState),
        spyOnFind,
        upsertResult: success(undefined),
        spyOnUpsert,
      })
    ),
    input: bobsInvalidInput,
    expected: failure(new IllegalMoveError(bobsInvalidInput)),
  },
  {
    name: "upsert failed",
    runWorkflow: createGameWorkflow(
      mockDependencies({ upsertResult: upsertFailure, spyOnUpsert: spyOnUpsert })
    ),
    input: bobsValidInput,
    expected: upsertFailure,
  },
  {
    name: "create game",
    runWorkflow: createGameWorkflow(mockDependencies({})),
    input: bobsValidInput,
    expected: success({
      id: matchId,
      owner: alice,
      state: {
        kind: "Game",
        moves: [
          [alice, 0],
          [bob, 1],
        ],
        next: alice,
        players: [alice, bob],
      },
    }),
  },
];

describe.each(scenarios)("create game: workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: WorkflowResult<Match>;

  beforeEach(async () => {
    spyOnFind.mockClear();
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);

      if (isSuccess(expected)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        switch (expected.error.kind) {
          case "MatchNotFoundError":
          case "IllegalMatchStateError":
          case "IllegalGameOpponentError":
          case "IllegalMoveError":
          case "TooManyActiveMatchesError":
            expect(spyOnUpsert).not.toHaveBeenCalled();
            break;
          case "UpsertFailedError":
            expect(spyOnUpsert).toHaveBeenCalledTimes(1);
            break;
          default:
            throw new Error(
              `This workflow should never fail with ${expected.error.kind}`
            );
        }
      }
    });
  });
});
