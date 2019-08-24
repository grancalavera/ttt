import * as isEmail from "isemail";
import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (args: { email: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const disabled = !isEmail.validate(email);

  return (
    <form>
      <p>
        <label>email</label> <input type="text" onChange={onEmailChange}></input>
      </p>

      <button onClick={() => onLogin({ email })} disabled={disabled}>
        Log In
      </button>
    </form>
  );
};
