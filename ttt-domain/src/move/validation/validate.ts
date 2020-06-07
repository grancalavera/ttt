import { validations } from "validation";
import { validatePlayer } from "./validate-player";
import { validatePosition } from "./validate-position";

export const validate = validations([validatePlayer, validatePosition]);
