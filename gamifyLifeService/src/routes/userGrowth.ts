import Router from "koa-router";
import { success } from "../shared/response.ts";
import UserGrowthService from "../services/userGrowth.ts";
import { routerFnc } from "@/shared/commonFnc.ts";

const router = new Router({ prefix: "/userGrowth" });

const userGrowthService = new UserGrowthService();

// 获取用户成长信息接口
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const userGrowth = await userGrowthService.getUserGrowth(userId);
    ctx.body = success(userGrowth, "用户成长信息获取成功");
  })
});

export default router;
