export type UserId = string;

export type Typename<T extends { __typename?: string }> = Exclude<
  T["__typename"],
  undefined
>;
