import Router from "koa-router";
import { success, badRequest, conflict } from "../shared/response.ts";
import UserInfoService from "../services/userInfo.ts";

const router = new Router({ prefix: "/userInfo" });

const userInfoService = new UserInfoService();

// 获取用户信息接口
router.get("/", async (ctx) => {
  try {
    const userInfo = await userInfoService.getUserInfo(ctx.state.user.userId);
    ctx.body = success(userInfo, "获取用户信息成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 更新用户信息接口
router.post("/updateUserInfo", async (ctx) => {
  try {
    const updatedInfo = await userInfoService.updateUserInfo(
      ctx.state.user.userId,
      ctx.request.body,
    );
    ctx.body = success(updatedInfo, "更新用户信息成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
