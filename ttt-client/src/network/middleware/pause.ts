import { ApolloLink, FetchResult, Observable } from "@apollo/client";

export const pause = (wait: number = 1000) =>
  new ApolloLink(
    (operation, forward) =>
      new Observable<FetchResult>(observer => {
        const { next, complete, error } = observer;
        setTimeout(() => {
          forward(operation).subscribe({
            next,
            complete,
            error
          });
        }, wait);
      })
  );
