import Router from "koa-router";
import { success } from "../shared/response.js";
import { routerFnc } from "@/shared/commonFnc.js";
import AchievementService from "@/services/achievement.js";

const router = new Router({ prefix: "/achievement" });

const achievementService = new AchievementService();

// 获取所有成就
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const achievements = await achievementService.getAllAchievements(userId);
    ctx.body = success(achievements, "成就获取成功");
  });
});

// 领取成就奖励
router.post("/reward", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const { achievementId } = ctx.request.body as any;
    await achievementService.getAchievementReward(userId, achievementId);
    ctx.body = success({}, "成就奖励领取成功");
  });
});

export default router;
