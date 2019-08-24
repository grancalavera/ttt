import * as isEmail from "isemail";
import React, { useState } from "react";
import { useMutation, useApolloClient } from "react-apollo";
import { LoginMutation, LoginMutationVariables } from "./generated/models";
import { loader } from "graphql.macro";
import { createLoginLogout } from "./login";

const LOGIN_USER = loader("./mutation-login.graphql");

interface LoginFormProps {
  onLogin?: () => void;
  onError?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {},
  onError = () => {}
}) => {
  const client = useApolloClient();
  const { doLogin } = createLoginLogout(client);
  const [email, setEmail] = useState("");

  const [runLoginMutation, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_USER, {
    onCompleted: ({ login }) => {
      if (login) {
        doLogin(login);
        onLogin();
      }
    },
    onError
  });

  const isEmailDisabled = loading;
  const isSubmitDisabled = !isEmail.validate(email) || loading;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        runLoginMutation({ variables: { email } });
      }}
    >
      <p>
        <label>email</label>{" "}
        <input
          type="text"
          onChange={e => setEmail(e.target.value)}
          value={email}
          disabled={isEmailDisabled}
        ></input>
      </p>

      <button type="submit" disabled={isSubmitDisabled}>
        login
      </button>
      {loading && <p>loading...</p>}
    </form>
  );
};
