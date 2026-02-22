import Router from "koa-router";
import { success } from "../shared/response.ts";
import AITaskService from "../services/aiTask.ts";
import { routerFnc } from "@/shared/commonFnc.ts";

const router = new Router({ prefix: "/aiTask" });

const aiTaskService = new AITaskService();

// AI生成任务接口
router.post("/aiCreateTask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const content = (ctx.request.body as any).content;
    const newTask = await aiTaskService.aiCreateTask(content, userId);
    ctx.body = success(newTask, "任务生成成功");
  })
});

// 获取AI工单状态
router.get("/aiTaskStatus", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.request.query.taskId as string;
    const taskStatus = await aiTaskService.getAIJobStatus(taskId);
    ctx.body = success(taskStatus, "AI工单状态获取成功");
  })
});

// 获取AI工单列表及其下属任务
router.get("/aiTaskListWithDraft", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const taskList = await aiTaskService.getAITaskListWithDraft(userId);
    ctx.body = success(taskList, "AI工单列表获取成功");
  })
});

// 修改AI创建的任务
router.put("/updateAITask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskData = ctx.request.body as any
    const task = await aiTaskService.updateAITask(taskData);
    ctx.body = success(task, "任务修改成功");
  })
});

// 应用AI工单下的所有临时草稿任务
router.post("/applyAITask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const jobId = (ctx.request.body as any).id;
    const task = await aiTaskService.applyAITask(userId, jobId);
    ctx.body = success(task, "草稿任务应用成功");
  })
});

export default router;
