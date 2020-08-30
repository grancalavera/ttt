import { GlobalCommandHandler } from "./support";

export const globalCommandHandler: GlobalCommandHandler = (d) => (command) =>
  command.kind === "JoinGameCommand"
    ? d.joinGame(command.input)
    : d.playMove(command.input);
