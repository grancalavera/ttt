import { ApolloLink, Observable } from "@apollo/client";

// see https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-context/src/index.ts
export const pauseLink = (wait: number = 1000) => {
  return new ApolloLink((operation, forward) => {
    console.log(
      `wait for ${wait} milliseconds before executing ${operation.operationName}`
    );
    return new Observable((observer) => {
      setTimeout(() => {
        console.log(`continue to execute ${operation.operationName}`);
        return forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      }, wait);
    });
  });
};
