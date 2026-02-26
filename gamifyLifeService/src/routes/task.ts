import Router from "koa-router";
import { success } from "../shared/response.js";
import TaskService from "../services/task.js";
import { Task } from "@/type/task.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/task" });

const taskService = new TaskService();

// 获取任务接口
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const tasks = await taskService.getTasks(userId);
    ctx.body = success(tasks, "任务获取成功");
  });
});

// 创建任务接口
router.post("/createTask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const taskData = ctx.request.body as Task;
    const newTask = await taskService.createTask(userId, taskData);
    ctx.body = success(newTask, "任务分类创建成功");
  });
});

// 获取用户任务详情接口
router.get("/getTaskDetail/:taskId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.params.taskId;
    const taskDetail = await taskService.getTask(taskId);
    ctx.body = success(taskDetail, "任务详情获取成功");
  });
});

// 更新任务接口
router.put("/updateTask", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const taskData = ctx.request.body as Task;
    const updatedTask = await taskService.updateTask(taskData, userId);
    ctx.body = success(updatedTask, "任务更新成功");
  });
});

// 删除任务接口
router.delete("/deleteTask/:taskId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.params.taskId;
    await taskService.deleteTask(taskId);
    ctx.body = success(null, "任务删除成功");
  });
});

// 完成任务接口
router.put("/completeTask/:taskId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.params.taskId;
    const userId = ctx.state.user.userId;
    const result = await taskService.finishTask(taskId, userId);
    ctx.body = success(result, "任务完成成功");
  });
});

// 放弃任务接口
router.put("/abandonTask/:taskId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const taskId = ctx.params.taskId;
    const result = await taskService.abandonTask(taskId);
    ctx.body = success(result, "任务放弃成功");
  });
});

export default router;
