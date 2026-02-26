import jwt from "koa-jwt";
import { unauthorized } from "../shared/response.js";
import UserAuthService from "../services/userAuth.js";
import type { Context, Next } from "koa";
const publicPaths = [
  "/auth/login",
  "/auth/register", // 登录和注册页面
  "/public", // 静态资源根目录
  "/icons", // 图标资源
  "/images", // 图片资源
];
export default async function tokenAuth(ctx: Context, next: Next) {
  const isPublicPath = publicPaths.some((path) => ctx.url.startsWith(path));
  if (isPublicPath) {
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

    await jwt({ secret: "my_app_secret" })(ctx, next);
  } catch (err) {
    ctx.status = 401;
    ctx.body = unauthorized("Token验证失败");
  }
  // await next();
}
