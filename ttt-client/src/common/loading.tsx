import { Colors, Intent, Spinner } from "@blueprintjs/core";
import React, { useContext } from "react";
import styled from "styled-components/macro";
import { AppContext } from "../app-context";
import { Content } from "./layout";

export const Loading: React.FC = () => {
  const { loading } = useContext(AppContext);

  console.log(`Loading   -> ${loading}`);

  return loading ? (
    <ContentOverlay>
      <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
    </ContentOverlay>
  ) : null;
};

const ContentOverlay = styled(Content)`
  background-color: ${Colors.DARK_GRAY2}AA;
`;
