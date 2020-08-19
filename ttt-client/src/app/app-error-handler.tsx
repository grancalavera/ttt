import { Alert, H5 } from "@blueprintjs/core";
import { isSome, none, Option, some } from "@grancalavera/ttt-etc";
import React, { ErrorInfo, useState } from "react";
import { useAppState } from "./app-state";

interface State {
  error: Option<any>;
}

export class AppErrorHandler extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { error: none };
  }

  static getDerivedStateFromError(error: any) {
    return { error: some(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error.message ?? error.toString());
    console.error(error.stack ? error.stack : "");
    console.error(errorInfo.componentStack);
  }

  render() {
    return isSome(this.state.error) ? (
      <ErrorAlert error={this.state.error.value} />
    ) : (
      this.props.children
    );
  }
}

interface ErrorAlertProps {
  error: any;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  const theme = useAppState((s) => s.themeClass);
  const [showError, toggleError] = useState(true);

  return (
    <Alert
      isOpen={showError}
      className={theme}
      intent="danger"
      icon="error"
      onConfirm={() => toggleError(false)}
    >
      <H5>Fatal Error</H5>
      <p>{error.message ?? error.toString()}</p>
    </Alert>
  );
};
