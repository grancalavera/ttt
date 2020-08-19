export type WithOptionalTypename = { __typename?: string };
export type WithTypename<T extends WithOptionalTypename> = T & { __typename: string };

export const hasTypename = <T extends WithOptionalTypename>(
  candidate: T | undefined
): candidate is WithTypename<T> => {
  return typeof candidate?.__typename === "string";
};
