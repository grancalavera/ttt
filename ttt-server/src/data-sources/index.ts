import { UserAPI } from "./user";

export const dataSources = () => ({
  userAPI: new UserAPI()
});

export type DataSources = ReturnType<typeof dataSources>;
