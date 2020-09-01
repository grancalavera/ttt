import { alice, matchId } from "../test/support";
import { globalCommandHandler } from "./global-command-handler";
import {
  JoinGameCommand,
  JoinGameInput,
  PlayMoveCommand,
  PlayMoveInput,
} from "./support";

const spyOnJoinGame = jest.fn();
const spyOnPlayMove = jest.fn();

const handleCommand = globalCommandHandler({
  joinGame: spyOnJoinGame,
  playMove: spyOnPlayMove,
});

describe("global command handler", () => {
  it("join game", () => {
    const input: JoinGameInput = { player: alice };
    handleCommand(new JoinGameCommand(input));
    expect(spyOnJoinGame).toHaveBeenNthCalledWith(1, input);
  });

  it("play move", () => {
    const input: PlayMoveInput = { matchId, move: [alice, 0] };
    handleCommand(new PlayMoveCommand(input));
    expect(spyOnPlayMove).toHaveBeenNthCalledWith(1, input);
  });
});
