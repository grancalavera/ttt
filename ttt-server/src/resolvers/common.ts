import { ErrorCode, ErrorResponse } from "@grancalavera/ttt-api";

import { assertNever } from "../common";
import { ErrorGameOver, ErrorWrongMove, ErrorWrongTurn } from "../generated/models";

export const handleSimpleError = (error?: any) => {
  const errorResponse = getErrorResponse(error);
  throw new Error(errorResponse.message);
};

export const handleMoveError = (
  error?: any
): ErrorGameOver | ErrorWrongMove | ErrorWrongTurn => {
  const { code, message } = getErrorResponse(error);
  switch (code) {
    case ErrorCode.GameOver:
      return {
        __typename: "ErrorGameOver",
        message
      };
    case ErrorCode.WrongMove:
      return {
        __typename: "ErrorWrongMove",
        message
      };
    case ErrorCode.WrongTurn:
      return {
        __typename: "ErrorWrongTurn",
        message
      };
    case ErrorCode.InvalidMove:
    case ErrorCode.NotFound:
      throw new Error(message);
    default:
      return assertNever(code);
  }
};

const getErrorResponse = (error?: any): ErrorResponse => {
  if (
    error &&
    error.extensions &&
    error.extensions.response &&
    error.extensions.response.body &&
    error.extensions.response.body.code &&
    typeof error.extensions.response.body.code === "string" &&
    error.extensions.response.body.message &&
    typeof error.extensions.response.body.message === "string" &&
    error.extensions.response.body.context &&
    typeof error.extensions.response.body.context === "object"
  ) {
    return error.extensions.response.body as ErrorResponse;
  } else {
    throw new Error(error);
  }
};
