import { UserEntity } from "entity/user-entity";

export const ping = () => "pong";
export const whoami = (user: UserEntity) => user.id;
