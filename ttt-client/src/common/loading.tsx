import { Colors, Intent, Spinner } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";
import { Content } from "./layout";

interface LoadingProps {
  loading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ loading }) =>
  loading ? (
    <ContentOverlay>
      <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
    </ContentOverlay>
  ) : null;

const ContentOverlay = styled(Content)`
  background-color: ${Colors.DARK_GRAY2}AA;
`;
