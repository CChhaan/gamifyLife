import { Context, Next } from "koa";
import { error } from "../shared/response.ts";

export default async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    const status = err.status || 500;
    ctx.status = status;
    ctx.body = error(status, err.message);
  }
}
