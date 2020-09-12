import { failure, isSuccess, Result, success } from "@grancalavera/ttt-etc"
import {
  DomainError,
  IllegalChallengerError,
  includesErrorOfKind,
} from "../domain/error"
import { Match, MatchDescription } from "../domain/model"
import {
  alice,
  bob,
  matchId,
  mockWorkflowDependencies,
  upsertFailure,
  WorkflowScenario,
} from "../test-support"
import { createChallenge } from "./create-challenge"
import { CreateChallengeInput } from "./support"

const spyOnUpsert = jest.fn()
const mock = mockWorkflowDependencies({ spyOnUpsert })

const matchDescription: MatchDescription = {
  id: matchId,
  owner: alice,
}

const challengeMatch: Match = {
  ...matchDescription,
  state: { kind: "Challenge", move: [alice, 0] },
}

const scenarios: WorkflowScenario<CreateChallengeInput>[] = [
  {
    name: "illegal challenger",
    runWorkflow: createChallenge(mock()),
    input: { matchDescription, move: [bob, 0] },
    expectedResult: failure([
      new IllegalChallengerError(matchDescription, bob),
    ]),
  },
  {
    name: "upsert failed",
    runWorkflow: createChallenge(mock({ upsertFails: true })),
    input: { matchDescription, move: [alice, 0] },
    expectedResult: upsertFailure(challengeMatch),
    expectedMatch: challengeMatch,
  },
  {
    name: "create challenge",
    runWorkflow: createChallenge(mock()),
    input: { matchDescription, move: [alice, 0] },
    expectedResult: success(challengeMatch),
    expectedMatch: challengeMatch,
  },
]

describe.each(scenarios)("create challenge workflow", (scenario) => {
  const { name, runWorkflow, input, expectedResult, expectedMatch } = scenario
  let actual: Result<Match, DomainError[]>

  beforeEach(async () => {
    spyOnUpsert.mockClear()
    actual = await runWorkflow(input)
  })

  describe(name, () => {
    it("workflow", () => expect(actual).toEqual(expectedResult))

    it("side effects", () => {
      if (isSuccess(expectedResult)) {
        expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch)
      } else {
        const includesErrorKind = includesErrorOfKind(expectedResult.error)

        if (includesErrorKind("IllegalChallengerError")) {
          expect(spyOnUpsert).not.toHaveBeenCalled()
        }

        if (includesErrorKind("UpsertFailedError")) {
          expect(spyOnUpsert).toHaveBeenNthCalledWith(1, expectedMatch)
        }
      }
    })
  })
})
