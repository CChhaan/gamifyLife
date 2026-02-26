import Router from "koa-router";
import { success } from "../shared/response.js";
import UserInfoService from "../services/userInfo.js";
import { UserInfo } from "@/type/user.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/userInfo" });

const userInfoService = new UserInfoService();

// 获取用户信息接口
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const userInfo = await userInfoService.getUserInfo(userId);
    ctx.body = success(userInfo, "用户信息获取成功");
  });
});

// 更新用户信息接口
router.post("/updateUserInfo", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const userInfo = ctx.request.body as UserInfo;
    const updatedInfo = await userInfoService.updateUserInfo(userId, userInfo);
    ctx.body = success(updatedInfo, "用户信息更新成功");
  });
});

export default router;
