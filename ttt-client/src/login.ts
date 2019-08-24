import ApolloClient from "apollo-client";

export const createLoginLogout = (client: ApolloClient<object>) => ({
  doLogin: (token: string) => {
    localStorage.setItem("token", token);
    client.writeData({ data: { isLoggedIn: true } });
  },
  doLogout: () => {
    localStorage.removeItem("token");
    client.writeData({ data: { isLoggedIn: false } });
  }
});
