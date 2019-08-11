import { ErrorResponse } from "@grancalavera/ttt-api";

export const handleSimpleError = (error?: any) => {
  const errorResponse = getErrorResponse(error);
  throw new Error(errorResponse.message);
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
