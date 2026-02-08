import Router from "koa-router";
import { success, badRequest, conflict } from "../shared/response.ts";
import UserGrowthService from "../services/userGrowth.ts";

const router = new Router({ prefix: "/userGrowth" });

const userGrowthService = new UserGrowthService();

// 获取用户成长信息接口
router.get("/", async (ctx) => {
  try {
    const userGrowth = await userGrowthService.getUserGrowth(
      ctx.state.user.userId,
    );
    ctx.body = success(userGrowth, "获取用户成长信息成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
