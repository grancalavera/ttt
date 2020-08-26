import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc";
import { Match } from "../../domain/model";
import {
  alice,
  bob,
  hasErrorKind,
  matchId,
  maxActiveMatches,
  mockDependencies,
  upsertError,
  upsertFailure,
} from "../../test/support";
import { WorkflowError } from "../errors";
import {
  IllegalMatchStateError,
  MatchNotFoundError,
  TooManyActiveMatchesError,
} from "../support";
import { createGameWorkflow } from "./create-game";
import { CreateGame, CreateGameInput, IllegalGameOpponentError } from "./workflow";

interface Scenario {
  name: string;
  runWorkflow: CreateGame;
  input: CreateGameInput;
  expected: Result<Match, WorkflowError[]>;
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

const alicesInvalidInput: CreateGameInput = { matchId, opponent: alice };
const bobsValidInput: CreateGameInput = { matchId, opponent: bob };
const findSuccess = success(matchOnChallengeState);

const scenarios: Scenario[] = [
  {
    name: "too many active matches",
    runWorkflow: createGameWorkflow(mockDependencies({ activeMatches: 1 })),
    input: bobsValidInput,
    expected: failure([new TooManyActiveMatchesError(bob, maxActiveMatches)]),
  },
  {
    name: "match not found",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: failure(new MatchNotFoundError(matchId)),
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input: bobsValidInput,
    expected: failure([new MatchNotFoundError(matchId)]),
  },
  {
    name: "illegal match state",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: success(matchOnNewState),
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input: alicesInvalidInput,
    expected: failure([
      new IllegalMatchStateError(matchId, "Challenge", matchOnNewState.state.kind),
    ]),
  },
  {
    name: "illegal challenge opponent",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: findSuccess,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input: alicesInvalidInput,
    expected: failure([new IllegalGameOpponentError(alicesInvalidInput)]),
  },
  {
    name: "upsert failed",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: findSuccess,
        spyOnFind,
        upsertResult: upsertFailure,
        spyOnUpsert: spyOnUpsert,
      })
    ),
    input: bobsValidInput,
    expected: failure([upsertError]),
  },
  {
    name: "create game",
    runWorkflow: createGameWorkflow(
      mockDependencies({
        findResult: findSuccess,
        spyOnFind,
        spyOnUpsert,
      })
    ),
    input: bobsValidInput,
    expected: success({
      id: matchId,
      owner: alice,
      state: {
        kind: "Game",
        moves: [[alice, 0]],
        next: bob,
        players: [alice, bob],
      },
    }),
  },
];

describe.each(scenarios)("create game workflow", (scenario) => {
  const { name, runWorkflow, input, expected } = scenario;
  let actual: Result<Match, WorkflowError[]>;

  beforeEach(async () => {
    spyOnFind.mockClear();
    spyOnUpsert.mockClear();
    actual = await runWorkflow(input);
  });

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expected));

    it("side effects", () => {
      if (isSuccess(expected)) {
        expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expected.value);
      } else {
        const hasKind = hasErrorKind(expected.error);

        if (hasKind("TooManyActiveMatchesError")) {
          expect(spyOnFind).not.toHaveBeenCalled();
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (
          hasKind(
            "MatchNotFoundError",
            "IllegalMatchStateError",
            "IllegalGameOpponentError",
            "IllegalMoveError"
          )
        ) {
          expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
          expect(spyOnUpsert).not.toHaveBeenCalled();
        }

        if (hasKind("UpsertFailedError")) {
          expect(spyOnFind).toHaveBeenNthCalledWith(1, input.matchId);
          expect(spyOnUpsert).toHaveBeenCalledTimes(1);
        }
      }
    });
  });
});
