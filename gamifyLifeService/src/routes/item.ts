import Router from "koa-router";
import { success } from "../shared/response.js";
import ItemService from "../services/item.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/items" });

const itemService = new ItemService();

// 获取系统道具
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const tasks = await itemService.getSysItems();
    ctx.body = success(tasks, "系统道具获取成功");
  });
});

// 用户购买道具
router.post("/buyItem", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const items = ctx.request.body as any;
    const result = await itemService.buySysItem(userId, items);
    ctx.body = success(result, "道具购买成功");
  });
});

// 获取用户道具
router.get("/userItems", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const items = await itemService.getUserItems(userId);
    ctx.body = success(items, "用户道具获取成功");
  });
});

// 使用道具 - 喂食
router.post("/feed", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const itemId = (ctx.request.body as any).itemId;
    const result = await itemService.useFoodItem(userId, itemId);
    ctx.body = success(result, "道具使用成功");
  });
});

export default router;
