import {
  coerceToPlayer,
  coerceToPosition,
  CorePlayer,
  CorePosition
} from "@grancalavera/ttt-core";
import { RequestHandler, Router } from "express";
import { body, check, ValidationError, validationResult } from "express-validator";
import {
  extractException,
  gameNotFound,
  invalidPlayer,
  invalidPosition,
  InvalidRequest,
  invalidRequest,
  missingGameId
} from "./exceptions";
import { findAllGames, findGameById } from "./services/game";
import { playMove } from "./services/move";

const INVALID_PLAYER = "INVALID_PLAYER";
const INVALID_POSITION = "INVALID_POSITION";
const MISSING_GAME_ID = "MISSING_GAME_ID";

const validateGameId = check("gameId")
  .exists()
  .withMessage(MISSING_GAME_ID);

const validateMoveRequest: RequestHandler[] = [
  body("player")
    .matches(/^(O|X){1}$/)
    .withMessage(INVALID_PLAYER),
  body("position")
    .matches(/^[012345678]{1}$/)
    .withMessage(INVALID_POSITION),
  validateGameId
];

const handleGetGameByIdRequest: RequestHandler = async (req, res, next) => {
  const { gameId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ status: 400, body: missingGameId() });
  } else {
    const maybeGame = await findGameById(gameId);
    if (maybeGame) {
      res.status(200).json(maybeGame);
    } else {
      res.status(404).json(gameNotFound(gameId));
    }
  }
};

const handleMoveRequest: RequestHandler = async (req, res, next) => {
  const { player, position, gameId } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      status: 400,
      body: validationErrorsToInvalidRequest(player, position, errors.array())
    });
  }

  let corePlayer: CorePlayer;
  let corePosition: CorePosition;

  try {
    corePlayer = coerceToPlayer(player);
    corePosition = coerceToPosition(position);
  } catch (e) {
    next({ status: 400, body: e.message });
    return;
  }

  try {
    await playMove(gameId, corePlayer, corePosition);
    res.status(200).end();
  } catch (e) {
    next({ status: 400, body: extractException(e) });
  }
};

// `any` is OK b/c this is part of the validation code, and we can actually get
// *anything* from the user at this point :P
const validationErrorsToInvalidRequest = (
  player: any,
  position: any,
  validationErrors: ValidationError[]
): InvalidRequest => {
  const seed: { message: string[]; errors: any[] } = { message: [], errors: [] };
  const { message, errors } = validationErrors.reduce((result, error) => {
    const [err, msg] = toResponseError_(player, position, error);
    result.errors.push(err);
    result.message.push(msg);
    return result;
  }, seed);
  return invalidRequest(message.join(", "), errors);
};

const toResponseError_ = (
  player: any,
  position: any,
  error: ValidationError
): [any, string] => {
  switch (error.msg) {
    case INVALID_PLAYER:
      return [invalidPlayer(player), "InvalidPlayer"];
    case INVALID_POSITION:
      return [invalidPosition(position), "InvalidPosition"];
    case MISSING_GAME_ID:
      return [missingGameId(), "MissingGameId"];
    default:
      return [{}, ""];
  }
};

const router = Router();

router.get("/", async (_, res) => {
  const allGames = await findAllGames();
  res.status(200).json(allGames);
});
router.get("/:gameId", validateGameId, handleGetGameByIdRequest);
router.post("/moves", validateMoveRequest, handleMoveRequest);

export { router };
