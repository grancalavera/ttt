import { User } from "entity/user";

export const ping = () => "pong";
export const whoami = (user: User) => `your user id is ${user.id}`;
