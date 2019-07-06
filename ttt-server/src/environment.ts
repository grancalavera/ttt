import { User } from "./generated/models";
import { UserAPI } from "./data-sources/user";

export const dataSources = () => ({
  userAPI: new UserAPI()
});

export type DataSources = ReturnType<typeof dataSources>;

export interface Context {
  user?: User;
  dataSources: DataSources;
}
