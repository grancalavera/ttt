import { Context } from "context";

export const list = (ctx: Context) => ctx.dataSources.users.find();
export const register = (ctx: Context) => ctx.dataSources.users.register();
