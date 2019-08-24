import React from "react";
import { ApolloConsumer, Mutation } from "react-apollo";
import { loader } from "graphql.macro";
import { LoginMutation, LoginMutationVariables } from "../generated/models";
import { LoginForm } from "../components/login-form";

const LOGIN_USER = loader("../mutation-login.graphql");

export const Login = () => {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation<LoginMutation, LoginMutationVariables>
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            if (login) {
              localStorage.setItem("token", login);
              client.writeData({ data: { isLoggedIn: true } });
            }
          }}
        >
          {(login, { loading, error }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error!</div>;
            return (
              <LoginForm
                onLogin={variables => {
                  login({ variables });
                }}
              />
            );
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};
