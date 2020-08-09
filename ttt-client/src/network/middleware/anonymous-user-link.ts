import { ApolloLink, FetchResult, NextLink, Observable, Operation } from "@apollo/client";
import { decode } from "jsonwebtoken";

type UsafeJWT = { [key: string]: any } | null | string;
type SafeJWT = { exp: number };

const isExpired = (jwt: SafeJWT) => {
  return 1000 * jwt.exp < Date.now();
};

const isValid = (jwt: UsafeJWT): jwt is SafeJWT => {
  return (
    jwt !== null && typeof jwt !== "string" && jwt.exp && typeof jwt.exp === "number"
  );
};

export class AnonymousUserLink extends ApolloLink {
  private accessToken = "";
  private jwt: SafeJWT | null = null;

  constructor(private endpoint: string) {
    super();
  }

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return this.isAuthorized()
      ? this.forwardCredentials(operation, forward)
      : this.requestCredentials(operation, forward);
  }

  private updateCredentials(accessToken: string) {
    const jwt = decode(accessToken);

    if (isValid(jwt)) {
      this.accessToken = accessToken;
      this.jwt = jwt;
    } else {
      this.resetCredentials();
    }
  }

  private resetCredentials() {
    this.accessToken = "";
    this.jwt = null;
  }

  private isAuthorized(): boolean {
    return this.accessToken !== "" && this.jwt !== null && !isExpired(this.jwt);
  }

  private setAuthorizationHeader(operation: Operation) {
    const context = operation.getContext();
    const { authorization, ...headers } = context.headers || {};
    if (this.isAuthorized()) {
      operation.setContext({
        headers: {
          ...headers,
          authorization: `bearer ${this.accessToken}`,
        },
      });
    } else {
      operation.setContext({ headers });
    }
  }

  private forwardCredentials(
    operation: Operation,
    forward: NextLink
  ): Observable<FetchResult> {
    this.setAuthorizationHeader(operation);
    return forward(operation);
  }

  private requestCredentials(
    operation: Operation,
    forward: NextLink
  ): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      (async () => {
        const response = await fetch(this.endpoint, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const { accessToken } = await response.json();
          this.updateCredentials(accessToken);
        } else {
          this.resetCredentials();
        }

        this.setAuthorizationHeader(operation);

        forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })();
    });
  }
}
