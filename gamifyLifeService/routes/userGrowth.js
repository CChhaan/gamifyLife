import Router from "koa-router";
import { success, badRequest, conflict } from "../shared/response.js";
import UserGrowthService from "../services/userGrowth.js";

const router = new Router({ prefix: "/userGrowth" });

const userGrowthService = new UserGrowthService();

// 获取用户成长信息接口
router.get("/", async (ctx) => {
  try {
    const userGrowth = await userGrowthService.getUserGrowth(
      ctx.state.user.userId,
    );
    ctx.body = success(userGrowth, "获取用户成长信息成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
