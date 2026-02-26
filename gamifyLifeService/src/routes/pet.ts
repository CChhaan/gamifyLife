import Router from "koa-router";
import { success, badRequest } from "../shared/response.js";
import PetService from "../services/pet.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/pet" });

const petService = new PetService();

// 获取用户宠物信息
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const pets = await petService.getPetInfo(userId);
    ctx.body = success(pets);
  });
});

// 创建宠物
router.post("/createPet", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const petName = (ctx.request.body as any).pet_name as string;
    const newPet = await petService.createPet(userId, petName);
    ctx.body = success(newPet);
  });
});

export default router;
