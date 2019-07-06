import { UserAPI } from "./user";

export const dataSources = () => ({
  userAPI: new UserAPI()
});

export type TTTDataSources = ReturnType<typeof dataSources>;
