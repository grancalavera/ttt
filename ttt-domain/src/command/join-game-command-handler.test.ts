import { success, Result } from "@grancalavera/ttt-etc";
import { Challenge, MatchDescription } from "../domain/model";
import {
  alice,
  bob,
  CommandScenario,
  matchId,
  mockCommandDependencies,
} from "../test/support";
import { CreateGame, CreateMatch, WorkflowInput } from "../workflow/support";
import { joinGameCommandHandler } from "./join-game-command-handler";
import { JoinGameCommand } from "./support";
import { DomainError } from "../domain/error";

const spyOnFindFirstChallenge = jest.fn();

const matchDescription: MatchDescription = { id: matchId, owner: alice };
const challenge: Challenge = { kind: "Challenge", move: [alice, 0] };

const mock = mockCommandDependencies({
  spyOnFindFirstChallenge,
});

const scenarios: CommandScenario<JoinGameCommand>[] = [
  {
    name: "no challenges found",
    handleCommand: joinGameCommandHandler(mock()),
    command: new JoinGameCommand({ player: alice }),
    expected: success(new CreateMatch({ owner: alice })),
  },
  {
    name: "challenge found",
    handleCommand: joinGameCommandHandler(
      mock({ firstChallengeToFind: [matchDescription, challenge] })
    ),
    command: new JoinGameCommand({ player: bob }),
    expected: success(new CreateGame({ matchDescription, challenge, opponent: bob })),
  },
];

describe.each(scenarios)("join game command handler", (scenario) => {
  const { name, handleCommand, expected, command } = scenario;
  let actual: Result<WorkflowInput, DomainError[]>;

  beforeEach(async () => {
    spyOnFindFirstChallenge.mockClear();
    actual = await handleCommand(command);
  });

  describe(name, () => {
    it("command", () => {
      expect(actual).toEqual(expected);
    });

    it("side effects", () => {
      expect(spyOnFindFirstChallenge).toHaveBeenCalledTimes(1);
    });
  });
});
