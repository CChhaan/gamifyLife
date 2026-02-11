import Router from "koa-router";
import { success, badRequest } from "../shared/response.ts";
import AITaskService from "../services/aiTask.ts";

const router = new Router({ prefix: "/aiTask" });

const aiTaskService = new AITaskService();

// AI生成任务接口
router.post("/aiCreateTask", async (ctx) => {
  try {
    const newTask = await aiTaskService.aiCreateTask(
      //   ctx.state.user.userId,
      (ctx.request.body as any).content as string,
      ctx.state.user.userId,
    );
    ctx.body = success(newTask, "生成任务成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 获取AI工单状态
router.get("/aiTaskStatus", async (ctx) => {
  try {
    const taskStatus = await aiTaskService.getAIJobStatus(
      ctx.request.query.taskId as string,
    );
    ctx.body = success(taskStatus, "获取AI工单状态成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 获取AI工单列表及其下属任务
router.get("/aiTaskListWithDraft", async (ctx) => {
  try {
    const taskList = await aiTaskService.getAITaskListWithDraft(
      ctx.state.user.userId,
    );
    ctx.body = success(taskList, "获取AI工单列表成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 修改AI创建的任务
router.put("/updateAITask", async (ctx) => {
  try {
    const task = await aiTaskService.updateAITask(
      (ctx.request.body as any).id,
      ctx.request.body as any,
    );
    ctx.body = success(task, "修改任务成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 应用AI工单下的所有临时草稿任务
router.post("/applyAITask", async (ctx) => {
  try {
    const task = await aiTaskService.applyAITask(
      ctx.state.user.userId,
      (ctx.request.body as any).id,
    );
    ctx.body = success(task, "应用草稿任务成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
