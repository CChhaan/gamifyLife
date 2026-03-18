import Router from "koa-router";
import { success } from "../shared/response.js";
import { routerFnc } from "@/shared/commonFnc.js";
import RankingService from "@/services/ranking.js";
import { CycleType, RankingType } from "@/type/ranking.js";

const router = new Router({ prefix: "/ranking" });

const rankingService = new RankingService();

// 获取某个用户的所有排行榜
router.get("/getUserRankings", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const rankings = await rankingService.getUserRankings(userId);
    ctx.body = success(rankings, "排行榜获取成功");
  });
});

// 获取所有类型的最新排行榜
router.get("/getAllRankings", async (ctx) => {
  await routerFnc(ctx, async () => {
    const rankings = await rankingService.getAllRankings();
    ctx.body = success(rankings, "所有排行榜获取成功");
  });
});

// 获取某个用户指定类型的排行榜数据
router.get("/getUserRanking", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { rankingType, cycleType } = ctx.query as {
      rankingType: RankingType;
      cycleType: CycleType;
    };
    const userId = ctx.state.user.userId;
    const ranking = await rankingService.getRanking(
      rankingType,
      cycleType,
      userId,
    );
    ctx.body = success(ranking, "排行榜数据获取成功");
  });
});

// 获取指定类型的最新排行榜数据
router.get("/getRanking", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { rankingType, cycleType } = ctx.query as {
      rankingType: RankingType;
      cycleType: CycleType;
    };
    const ranking = await rankingService.getRanking(rankingType, cycleType);
    ctx.body = success(ranking, "排行榜数据获取成功");
  });
});

export default router;
