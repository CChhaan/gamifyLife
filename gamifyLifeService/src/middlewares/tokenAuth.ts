import jwt from "koa-jwt";
import { unauthorized } from "../shared/response.ts";
import UserAuthService from "../services/userAuth.ts";
import type { Context, Next } from "koa";

export default async function tokenAuth(ctx: Context, next: Next) {
  if (ctx.url === "/auth/login" || ctx.url === "/auth/register") {
    await next();
    return;
  }
  try {
    const token = ctx.header.authorization?.replace("Bearer ", "");

    // 检查 token 是否在黑名单中
    if (token && UserAuthService.isTokenBlacklisted(token)) {
      ctx.status = 401;
      ctx.body = unauthorized("Token已失效");
      return;
    }

    await jwt({
      secret: "my_app_secret",
    })(ctx, next);
  } catch (err) {
    ctx.status = 401;
    ctx.body = unauthorized("Token验证失败");
  }
}
