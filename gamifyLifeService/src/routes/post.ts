import Router from "koa-router";
import { success } from "../shared/response.js";
import { routerFnc } from "@/shared/commonFnc.js";
import PostService from "@/services/post.js";

const router = new Router({ prefix: "/post" });

const postService = new PostService();

// 获取某个用户的所有动态
router.get("/getUserPosts", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const posts = await postService.getUserPosts(userId);
    ctx.body = success(posts, "动态获取成功");
  });
});

// 获取某个用户的所有已发布的动态
router.get("/getUserPublishedPosts", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const posts = await postService.getUserPublishedPosts(userId);
    ctx.body = success(posts, "已发布动态获取成功");
  });
});

// 获取所有发布状态的动态
router.get("/getAllPublishedPosts", async (ctx) => {
  await routerFnc(ctx, async () => {
    const posts = await postService.getAllPublishedPosts();
    ctx.body = success(posts, "动态获取成功");
  });
});

// 发布动态
router.post("/publish", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const postId = (ctx.request.body as any).postId;
    const post = await postService.publishPost(userId, postId);
    ctx.body = success(post, "动态发布成功");
  });
});

// 将用户某个动态隐藏
router.post("/hide", async (ctx) => {
  await routerFnc(ctx, async () => {
    const postId = (ctx.request.body as any).postId;
    const post = await postService.hideUserPost(postId);
    ctx.body = success(post, "动态隐藏成功");
  });
});

// 取消动态隐藏
router.post("/unhide", async (ctx) => {
  await routerFnc(ctx, async () => {
    const postId = (ctx.request.body as any).postId;
    const post = await postService.unhideUserPost(postId);
    ctx.body = success(post, "动态取消隐藏成功");
  });
});

export default router;
