import React, { useState } from "react";
import "styled-components/macro";

import * as isEmail from "isemail";
import { Button, Input } from "./button";
import styled from "styled-components/macro";
import { color, ColorProps } from "styled-system";

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

  const disabled = !isEmail.validate(email) || !alias;

  return (
    <form>
      <Box color="green" bg="pink">
        <p>
          <label>alias</label> <Input type="text" onChange={onAliasChange}></Input>
        </p>
        <p>
          <label>email</label> <Input type="text" onChange={onEmailChange}></Input>
        </p>

        <Button
          primary={true}
          onClick={() => onLogin({ email, alias })}
          disabled={disabled}
        >
          Log In
        </Button>
      </Box>
    </form>
  );
};

const Box = styled.div<ColorProps>`
  ${color}
`;
