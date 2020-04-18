import { Players } from "../model";

export const validPlayers = (ps: Players): boolean => {
  const [p1, p2] = ps;
  return p1 !== p2;
};
