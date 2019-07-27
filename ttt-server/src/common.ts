import { Avatar } from "./generated/models";

export function assertNever(value: never): never {
  throw new Error(`unexpected value ${value}`);
}

export const chooseAvatar = (): Avatar => (Math.random() < 0.5 ? Avatar.X : Avatar.O);
