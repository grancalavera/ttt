import { Alert, H5 } from "@blueprintjs/core";
import { assertNever } from "@grancalavera/ttt-core";
import React, { ErrorInfo } from "react";

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
  showError: false
});

const createError = (error: any): FatalErrorHandlerState => ({
  errorResult: { kind: "HasError", error },
  showError: true
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
        const error = this.state.errorResult.error;
        return (
          <Alert
            isOpen={this.state.showError}
            className="bp3-dark"
            intent="danger"
            icon="error"
            onConfirm={() => this.setState({ showError: false })}
          >
            <>
              <H5>{this.props.title}</H5>
              <p>{error.message ?? error.toString()}</p>
            </>
          </Alert>
        );
      }
      default:
        assertNever(this.state.errorResult);
    }
  }
}
