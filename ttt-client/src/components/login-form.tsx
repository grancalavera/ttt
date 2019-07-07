import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (args: { alias: string; email: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin({ email, alias });
  };

  return (
    <form onSubmit={onSubmit}>
      <p>
        <label>alias</label> <input type="text" onChange={onAliasChange}></input>
      </p>
      <p>
        <label>email</label> <input type="text" onChange={onEmailChange}></input>
      </p>
      <button type="submit">Log In</button>
    </form>
  );
};
