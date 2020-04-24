import { Players } from "../../model";
import { InvalidPlayers, ValidationResult } from "validation-result";
import * as result from "validation-result";

export const validatePlayers = (ps: Players): ValidationResult<InvalidPlayers> => {
  const [p1, p2] = ps;
  return p1 !== p2 ? result.valid() : result.invalidPlayers(ps);
};
