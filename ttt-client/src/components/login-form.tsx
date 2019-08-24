import * as isEmail from "isemail";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { color, ColorProps } from "styled-system";
import { Button, Input } from "./button";

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
      <Box color="green" bg="pink">
        <p>
          <label>email</label> <Input type="text" onChange={onEmailChange}></Input>
        </p>

        <Button primary={true} onClick={() => onLogin({ email })} disabled={disabled}>
          Log In
        </Button>
      </Box>
    </form>
  );
};

const Box = styled.div<ColorProps>`
  ${color}
`;
