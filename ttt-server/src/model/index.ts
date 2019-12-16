export type Typename<T extends { __typename?: string }> = Exclude<
  T["__typename"],
  undefined
>;
