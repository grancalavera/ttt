import { Alert, H5 } from "@blueprintjs/core";
import React, { ErrorInfo } from "react";
import { useStore } from "app-store";

interface FatalErrorHandlerProps {
  title: string;
}

interface FatalErrorHandlerState {
  errorResult: DoesNotHaveError | HasError;
  showError: boolean;
}

interface HasError {
  kind: "HasError";
  error: any;
}

interface DoesNotHaveError {
  kind: "DoesNotHaveError";
}

const resetError = (): FatalErrorHandlerState => ({
  errorResult: { kind: "DoesNotHaveError" },
  showError: false,
});

const createError = (error: any): FatalErrorHandlerState => ({
  errorResult: { kind: "HasError", error },
  showError: true,
});

export class FatalErrorHandler extends React.Component<
  FatalErrorHandlerProps,
  FatalErrorHandlerState
> {
  constructor(props: FatalErrorHandlerProps) {
    super(props);
    this.state = resetError();
  }

  static getDerivedStateFromError(error: any) {
    return createError(error);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error.message ?? error.toString());
    console.error(error.stack ? error.stack : "");
    console.error(errorInfo.componentStack);
  }

  render() {
    switch (this.state.errorResult.kind) {
      case "DoesNotHaveError":
        return this.props.children;
      case "HasError": {
        return (
          <ErrorAlert
            show={this.state.showError}
            title={this.props.title}
            error={this.state.errorResult.error}
            onConfirm={() => this.setState({ showError: false })}
          />
        );
      }
      default: {
        const never: never = this.state.errorResult;
        throw new Error(`unknown error result ${never}`);
      }
    }
  }
}

interface Props {
  show: boolean;
  title: string;
  error: any;
  onConfirm: () => void;
}

const ErrorAlert: React.FC<Props> = ({ error, title, show, onConfirm }) => {
  const theme = useStore((s) => s.theme);

  return (
    <Alert
      isOpen={show}
      className={theme}
      intent="danger"
      icon="error"
      onConfirm={onConfirm}
    >
      <>
        <H5>{title}</H5>
        <p>{error.message ?? error.toString()}</p>
      </>
    </Alert>
  );
};
