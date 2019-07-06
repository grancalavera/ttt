export interface User {
  id: number;
  alias: string;
  email: string;
}

export type UnknownUser = Omit<User, "id">;

export interface GQLContext {
  user?: User;
}
