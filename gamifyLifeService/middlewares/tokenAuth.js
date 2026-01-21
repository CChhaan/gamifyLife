import jwt from "koa-jwt";
import { error } from "../shared/response.js";

export default async function tokenAuth(ctx, next) {
  if (ctx.url === "/auth/login" || ctx.url === "/auth/register") {
    await next();
  } else {
    return jwt({
      secret: "my_app_secret",
    })(ctx, next);
  }
}
