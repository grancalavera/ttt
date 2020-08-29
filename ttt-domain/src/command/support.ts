import { FindFirstChallenge, FindMatch } from "../dependencies";
import { MatchId, Move, Player } from "../domain/model";
import { WorkflowResult } from "../workflow/support";

export type Command = JoinGameCommand | PlayMoveCommand;

class JoinGameCommand {
  readonly kind = "JoinGameCommand";
  constructor(readonly input: Player) {}
}

class PlayMoveCommand {
  readonly kind = "PlayMoveCommand";
  constructor(readonly input: PlayMoveInput) {}
}

interface PlayMoveInput {
  readonly matchId: MatchId;
  readonly move: Move;
}

type CommandHandler<TDeps, TCommand> = (
  dependencies: TDeps
) => (command: TCommand) => WorkflowResult;

type GlobalCommandHandler = CommandHandler<{}, Command>;
type JoinGameCommandHandler = CommandHandler<FindFirstChallenge, JoinGameCommand>;
type PlayMoveCommandHandler = CommandHandler<FindMatch, PlayMoveCommand>;
