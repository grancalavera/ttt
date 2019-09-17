import { Router, RequestHandler, ErrorRequestHandler } from "express";

const router = Router();

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

// ResponseGame[]
router.get("/", (req, res) => {
  res.status(418).end();
});

// ResponseGame
router.get("/:id", (req, res) => {
  res.status(418).end();
});

// ResponseMove
/*
interface Body {
  player:'X'|'O';
  position: 0 | 1 | 2
            3 | 4 | 5
            6 | 7 | 8;
  gameId:string
}
*/
const validateMoveRequest: RequestHandler[] = [];

const handleMoveRequest: RequestHandler = (req, res) => {
  res.status(418).end();
};

router.post("/moves", validateMoveRequest, handleMoveRequest);

export { router };
