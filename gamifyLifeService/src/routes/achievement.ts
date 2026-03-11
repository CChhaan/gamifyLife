import Router from "koa-router";
import { success } from "../shared/response.js";
import { routerFnc } from "@/shared/commonFnc.js";
import AchievementService from "@/services/achievement.js";

const router = new Router({ prefix: "/achievement" });

const achievementService = new AchievementService();

// 获取成就大类
router.get("/types", async (ctx) => {});

export default router;
