import { User } from "./generated/models";
import { DataSources } from "./data-sources";

export interface Context {
  user?: User;
  dataSources: DataSources;
}
