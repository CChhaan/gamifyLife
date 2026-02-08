import Router from "koa-router";
import UserAuthService from "../services/userAuth.ts";
import { success, badRequest, conflict } from "../shared/response.ts";
import { UserAccount } from "@/type/user.ts";

const router = new Router({ prefix: "/auth" });

const userAuthService = new UserAuthService();

// 用户注册接口
router.post("/register", async (ctx) => {
  try {
    const { account, password, email } = ctx.request.body as UserAccount & { password: string };

    if (!account || !password || !email) {
      ctx.status = 400;
      ctx.body = badRequest("缺少必要的注册信息");
      return;
    }

    const newUser = await userAuthService.registerUser(
      account,
      password,
      email,
    );
    ctx.status = 200;
    ctx.body = success(newUser, "注册成功");
  } catch (error: any) {
    if (error.message.includes("已存在")) {
      ctx.status = 409;
      ctx.body = conflict("账户或邮箱已存在");
    } else {
      ctx.status = 400;
      ctx.body = badRequest(error.message);
    }
  }
});

// 用户登录接口
router.post("/login", async (ctx) => {
  try {
    const { account, email, password } = ctx.request.body as UserAccount & { password: string };

    if (!(account || email) || !password) {
      ctx.status = 400;
      ctx.body = badRequest("缺少必要的登录信息");
      return;
    }

    const token = await userAuthService.loginUser(account, email, password);
    ctx.status = 200;
    ctx.body = success(token, "登录成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 用户退出登录接口
router.post("/logout", async (ctx) => {
  try {
    const token = ctx.header.authorization?.replace("Bearer ", "");
    await userAuthService.logoutUser(token);
    ctx.status = 200;
    ctx.body = success(null, "退出登录成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
