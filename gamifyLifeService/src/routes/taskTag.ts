import Router from "koa-router";
import { success } from "../shared/response.ts";
import TaskTagService from "../services/taskTag.ts";
import type { InfluenceAttr, TaskTag } from "@/type/task.ts";
import { routerFnc } from "@/shared/commonFnc.ts";

const router = new Router({ prefix: "/taskTag" });

const taskTagService = new TaskTagService();

// 获取任务标签接口
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId
    const taskTags = await taskTagService.getTaskTagList(userId);
    ctx.body = success(taskTags, "任务标签获取成功");
  })
});

// 创建任务标签接口
router.post("/createTaskTag", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId
    const tagData = ctx.request.body as TaskTag;
    const newTaskTag = await taskTagService.createTaskTag(userId, tagData);
    ctx.body = success(newTaskTag, "任务标签创建成功");
  })
});

// 删除任务标签接口
router.delete("/deleteTaskTag/:tagId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId
    const tagId = ctx.params.tagId;
    const result = await taskTagService.deleteTaskTag(userId, tagId);
    ctx.body = success(result, "任务标签删除成功");
  })
});

// 修改标签名称接口
router.put("/updateTaskTagName/:tagId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId
    const tagId = ctx.params.tagId;
    const newName = (ctx.request.body as TaskTag).name!;
    const updatedTag = await taskTagService.updateTaskTagName(userId, tagId, newName);
    ctx.body = success(updatedTag, "任务标签更新成功");
  })
});

// 修改标签影响属性
router.put("/updateTaskTagProperty/:tagId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId
    const tagId = ctx.params.tagId;
    const attributes = ctx.request.body as { primary_attr: InfluenceAttr | ""; secondary_attr: InfluenceAttr | "" };
    const updatedTag = await taskTagService.updateTaskTagAttributes(userId, tagId, attributes);
    ctx.body = success(updatedTag, "任务标签属性更新成功");
  })
});

export default router;
