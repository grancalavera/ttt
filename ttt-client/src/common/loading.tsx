import { Intent, Spinner } from "@blueprintjs/core";
import React from "react";

export const Loading: React.FC = () => (
  <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
);
