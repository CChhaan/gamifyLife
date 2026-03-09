import Router from "koa-router";
import { success } from "../shared/response.js";
import { routerFnc } from "@/shared/commonFnc.js";
import PostInteractionService from "@/services/postInteraction.js";

const router = new Router({ prefix: "/postInteraction" });

const postInteractionService = new PostInteractionService();

// 点赞
router.post("/like", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { postId } = ctx.request.body as any;
    const userId = ctx.state.user.userId;
    const result = await postInteractionService.likePost(postId, userId);
    ctx.body = success(result, "点赞成功");
  });
});

// 取消点赞
router.post("/unlike", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { postId } = ctx.request.body as any;
    const userId = ctx.state.user.userId;
    const result = await postInteractionService.unlikePost(postId, userId);
    ctx.body = success(result, "取消点赞成功");
  });
});

// 点踩
router.post("/dislike", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { postId } = ctx.request.body as any;
    const userId = ctx.state.user.userId;
    const result = await postInteractionService.dislikePost(postId, userId);
    ctx.body = success(result, "点踩成功");
  });
});

// 取消点踩
router.post("/unDislike", async (ctx) => {
  await routerFnc(ctx, async () => {
    const { postId } = ctx.request.body as any;
    const userId = ctx.state.user.userId;
    const result = await postInteractionService.unDislikePost(postId, userId);
    ctx.body = success(result, "取消点踩成功");
  });
});

// 获取用户的帖子互动数据
router.get("/userInteractions", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const result = await postInteractionService.getUserPostInteractions(userId);
    ctx.body = success(result, "获取用户帖子互动数据成功");
  });
});

export default router;
