import { Intent, Spinner, Colors } from "@blueprintjs/core";
import React from "react";
import { Content } from "./layout";
import styled from "styled-components/macro";

interface LoadingProps {
  isLoading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isLoading }) =>
  isLoading ? (
    <Layout>
      <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
    </Layout>
  ) : null;

const Layout = styled(Content)`
  background-color: ${Colors.DARK_GRAY2}AA;
`;
