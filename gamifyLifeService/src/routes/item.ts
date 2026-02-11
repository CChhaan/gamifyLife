import Router from "koa-router";
import { success, badRequest } from "../shared/response.ts";
import ItemService from "../services/item.ts";
import { Inventory } from "@/type/item.ts";

const router = new Router({ prefix: "/items" });

const itemService = new ItemService();

router.get("/", async (ctx) => {
  try {
    const tasks = await itemService.getSysItems();
    ctx.body = success(tasks, "获取系统道具成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 用户购买道具
router.post("/buyItem", async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const items = ctx.request.body as Inventory[];
    const result = await itemService.buySysItem(userId, items);
    ctx.body = success(result, "购买道具成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 获取用户道具
router.get("/userItems", async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const items = await itemService.getUserItems(userId);
    ctx.body = success(items, "获取用户道具成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
