import Router from "koa-router";
import { success, badRequest } from "../shared/response.ts";
import TaskTagService from "../services/taskTag.ts";

const router = new Router({ prefix: "/taskTag" });

const taskTagService = new TaskTagService();

// 获取任务标签接口
router.get("/", async (ctx) => {
  try {
    const taskTags = await taskTagService.getTaskTagList(ctx.state.user.userId);
    ctx.body = success(taskTags, "获取任务标签成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 创建任务标签接口
router.post("/createTaskTag", async (ctx) => {
  try {
    const newTaskTag = await taskTagService.createTaskTag(
      ctx.state.user.userId,
      ctx.request.body,
    );
    ctx.body = success(newTaskTag, "创建任务标签成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 删除任务标签接口
router.delete("/deleteTaskTag/:tagId", async (ctx) => {
  try {
    const tagId = ctx.params.tagId;
    const result = await taskTagService.deleteTaskTag(
      ctx.state.user.userId,
      tagId,
    );
    ctx.body = success(result, "删除任务标签成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 修改标签名称接口
router.put("/updateTaskTagName/:tagId", async (ctx) => {
  try {
    const tagId = ctx.params.tagId;
    const updatedTag = await taskTagService.updateTaskTagName(
      ctx.state.user.userId,
      tagId,
      ctx.request.body.name,
    );
    ctx.body = success(updatedTag, "更新任务标签成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 修改标签影响属性
router.put("/updateTaskTagProperty/:tagId", async (ctx) => {
  try {
    const tagId = ctx.params.tagId;
    const updatedTag = await taskTagService.updateTaskTagAttributes(
      ctx.state.user.userId,
      tagId,
      ctx.request.body,
    );
    ctx.body = success(updatedTag, "更新任务标签属性成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
