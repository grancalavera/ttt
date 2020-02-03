import { Colors, Intent, Spinner } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";
import { useIsLoading } from "../hooks/use-loader";
import { Content } from "./layout";

export const Loading: React.FC = () => {
  const isLoading = useIsLoading();

  return isLoading ? (
    <ContentOverlay>
      <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
    </ContentOverlay>
  ) : null;
};

const ContentOverlay = styled(Content)`
  background-color: ${Colors.DARK_GRAY2}AA;
`;
