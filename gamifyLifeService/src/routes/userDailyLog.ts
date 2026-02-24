import Router from "koa-router";
import UserDailyLogService from "../services/userDailyLog.ts";
import { success, badRequest, conflict } from "../shared/response.ts";
import { routerFnc } from "@/shared/commonFnc.ts";

const router = new Router({ prefix: "/userDailyLog" });

const userDailyLogService = new UserDailyLogService();

// 获取用户每日日志
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { userId } = ctx.state.user;
    const result = await userDailyLogService.getUserDailyLog(userId);
    ctx.body = success(result, "获取用户每日日志成功");
  });
});

export default router;
