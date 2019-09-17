import { RequestHandler, Router } from "express";
import { body, ValidationError, validationResult } from "express-validator";
import { coerceToPlayer, coerceToPosition } from "@grancalavera/ttt-core";
import { playMove } from "./controller-move";

const router = Router();
const INVALID_PLAYER = "INVALID_PLAYER";
const INVALID_POSITION = "INVALID_POSITION";
const MISSING_GAME_ID = "MISSING_GAME_ID";

export interface InvalidRequest {
  error: "InvalidRequest";
  message: string;
}

export interface MissingGameId {
  error: "MissingGameId";
  message: string;
}

export interface InvalidPlayer {
  error: "InvalidPlayer";
  invalidPlayer: any;
  message: string;
}

export interface InvalidPosition {
  error: "InvalidPosition";
  invalidPosition: any;
  message: string;
}

export const invalidPlayer = (player: any): InvalidPlayer => ({
  message: `Invalid player "${player}, valid players are "O" and "X" only`,
  error: "InvalidPlayer",
  invalidPlayer: player
});

export const invalidPosition = (position: any): InvalidPosition => ({
  message: `Invalid position "${position}", valid moves are integer values from 0 inclusive to 8 inclusive`,
  error: "InvalidPosition",
  invalidPosition: position
});

export const missingGameId = (): MissingGameId => ({
  error: "MissingGameId",
  message: "Missing required game id"
});

// ResponseGame[]
router.get("/", (req, res) => {
  res.status(418).end();
});

// ResponseGame
router.get("/:id", (req, res) => {
  res.status(418).end();
});

const validateMoveRequest: RequestHandler[] = [
  body("player")
    .matches(/^(O|X){1}$/)
    .withMessage(INVALID_PLAYER),
  body("position")
    .matches(/^[012345678]{1}$/)
    .withMessage(INVALID_POSITION),
  body("gameId")
    .exists({ checkFalsy: true })
    .withMessage(MISSING_GAME_ID)
];

const handleMoveRequest: RequestHandler = async (req, res) => {
  const { player, position, gameId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ errors: errors.array().map(toResponseError({ player, position })) });
  } else {
    const corePlayer = coerceToPlayer(player);
    const corePosition = coerceToPosition(position);
    await playMove(gameId, corePlayer, corePosition);
    res.status(200).end();
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
      return { error: "InvalidRequest", message: `Invalid request: ${error.msg}` };
  }
};

router.post("/moves", validateMoveRequest, handleMoveRequest);

export { router };
