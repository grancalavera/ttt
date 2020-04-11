import { Maybe } from "@grancalavera/ttt-core";

export type WithOptionalTypename = { __typename?: string };
export type WithTypename<T extends WithOptionalTypename> = T & { __typename: string };

export const hasTypename = <T extends WithOptionalTypename>(
  candidate: Maybe<T>
): candidate is WithTypename<T> => {
  return typeof candidate?.__typename === "string";
};
