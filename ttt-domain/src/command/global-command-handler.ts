import { assertNever } from "@grancalavera/ttt-etc";
import { GlobalCommandHandler } from "./support";

export const globalCommandHandler: GlobalCommandHandler = (dependencies) => (command) => {
  const { joinGame, playMove } = dependencies;
  switch (command.kind) {
    case "JoinGameCommand":
      return joinGame(command.input);
    case "PlayMoveCommand":
      return playMove(command.input);
    default:
      assertNever(command);
  }
};
