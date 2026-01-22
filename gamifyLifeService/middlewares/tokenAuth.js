import jwt from "koa-jwt";
import { error } from "../shared/response.js";

export default async function tokenAuth(ctx, next) {
  if (ctx.url === "/auth/login" || ctx.url === "/auth/register") {
    await next();
    return;
  }
  try {
    const token = ctx.header.authorization?.replace("Bearer ", "");

    // 检查 token 是否在黑名单中
    if (token && UserAuthService.isTokenBlacklisted(token)) {
      ctx.status = 401;
      ctx.body = error("Token已失效");
      return;
    }

    await jwt({
      secret: "my_app_secret",
    })(ctx, next);
  } catch (err) {
    ctx.status = 401;
    ctx.body = error("Token验证失败");
  }
}
