import Router from "koa-router";
import { success } from "../shared/response.js";
import AITaskService from "../services/aiTask.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/aiTask" });

const aiTaskService = new AITaskService();

// AI 生成任务
router.post("/aiCreateTask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const content = (ctx.request.body as any).content;
    const newTask = await aiTaskService.aiCreateTask(content, userId);
    ctx.body = success(newTask, "任务生成成功");
  });
});

// 查询 AI 工单状态
router.get("/aiTaskStatus", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.request.query.taskId as string;
    const taskStatus = await aiTaskService.getAIJobStatus(taskId);
    ctx.body = success(taskStatus, "AI工单状态获取成功");
  });
});

// 获取 AI 工单列表
router.get("/aiTaskListWithDraft", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const taskList = await aiTaskService.getAITaskListWithDraft(userId);
    ctx.body = success(taskList, "AI工单列表获取成功");
  });
});

// 修改 AI 草稿任务
router.put("/updateAITask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskData = ctx.request.body as any;
    const task = await aiTaskService.updateAITask(taskData);
    ctx.body = success(task, "任务修改成功");
  });
});

// 删除 AI 草稿任务
router.delete("/deleteAITask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const id = ctx.request.query.id;
    await aiTaskService.deleteAITask(id);
    ctx.body = success(null, "任务删除成功");
  });
});

// 应用 AI 工单中的所有任务
router.post("/applyAITask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const jobId = (ctx.request.body as any).id;
    const task = await aiTaskService.applyAITask(userId, jobId);
    ctx.body = success(task, "草稿任务应用成功");
  });
});

export default router;
