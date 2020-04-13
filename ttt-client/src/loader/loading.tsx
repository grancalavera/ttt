import { Colors, Intent, Spinner } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";
import { useLoading } from "./use-loading";
import { Content } from "../common/layout";

export const Loading: React.FC = () => {
  const { isLoading } = useLoading();

  return isLoading ? (
    <ContentOverlay>
      <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
    </ContentOverlay>
  ) : null;
};

const ContentOverlay = styled(Content)`
  background-color: ${Colors.DARK_GRAY2}AA;
`;
