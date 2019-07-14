import styled from "styled-components/macro";
import { lighten } from "polished";

const c1 = "gray";
const c2 = "white";
const c3 = lighten(0.4, "gray");

interface IButton {
  primary?: boolean;
}

export const Button = styled.button<IButton>`
  background: ${props => (props.primary ? c1 : c2)};
  color: ${props => (props.primary ? c2 : c1)};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid gray;
  border-radius: 3px;

  &:disabled {
    background: ${props => (props.primary ? c3 : c2)};
    color: ${props => (props.primary ? c2 : c3)};
    border: 2px solid ${c3};
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  border: 1px solid ${c1};
`;
