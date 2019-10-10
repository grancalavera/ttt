import { RequestHandler, Router } from "express";
import { body, ValidationError, validationResult, check } from "express-validator";
import { coerceToPlayer, coerceToPosition } from "@grancalavera/ttt-core";
import { playMove } from "./services/move";
import { findAllGames, findGameById } from "./services/game";

import {
  InvalidPlayer,
  InvalidPosition,
  InvalidRequest,
  MissingGameId,
  gameNotFound,
  invalidPlayer,
  invalidPosition,
  missingGameId,
  extractException
} from "./etc/exceptions";

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
    next({ status: 400, errors: errors.array().map(missingGameId) });
  } else {
    const maybeGame = await findGameById(gameId);
    if (maybeGame) {
      res.status(200).json(maybeGame);
    } else {
      res.status(404).json({ errors: [gameNotFound(gameId)] });
    }
  }
};

const handleMoveRequest: RequestHandler = async (req, res, next) => {
  const { player, position, gameId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({
      status: 400,
      errors: errors.array().map(toResponseError({ player, position }))
    });
  } else {
    const corePlayer = coerceToPlayer(player);
    const corePosition = coerceToPosition(position);
    try {
      await playMove(gameId, corePlayer, corePosition);
      res.status(200).end();
    } catch (e) {
      next({ status: 400, errors: [extractException(e)] });
    }
  }
};

const toResponseError = ({ player, position }: { player: any; position: any }) => (
  error: ValidationError
): InvalidPlayer | InvalidPosition | MissingGameId | InvalidRequest => {
  switch (error.msg) {
    case INVALID_PLAYER:
      return invalidPlayer(player);
    case INVALID_POSITION:
      return invalidPosition(position);
    case MISSING_GAME_ID:
      return missingGameId();
    default:
      return { name: "InvalidRequest", message: `Invalid request: ${error.msg}` };
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
