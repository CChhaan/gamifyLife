import Router from "koa-router";
import { success, badRequest } from "../shared/response.ts";
import TaskService from "../services/task.ts";
import { Task } from "@/type/task.ts";

const router = new Router({ prefix: "/task" });

const taskService = new TaskService();

router.get("/", async (ctx) => {
  try {
    const tasks = await taskService.getTasks(ctx.state.user.userId);
    ctx.body = success(tasks, "获取任务分类成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 创建任务接口
router.post("/createTask", async (ctx) => {
  try {
    const newTask = await taskService.createTask(
      ctx.state.user.userId,
      ctx.request.body as Task,
    );
    ctx.body = success(newTask, "创建任务分类成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 获取用户任务详情接口
router.get("/getTaskDetail", async (ctx) => {
  try {
    const taskDetail = await taskService.getTask(+ctx.query.taskId!);
    ctx.body = success(taskDetail, "获取任务详情成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 更新任务接口
router.put("/updateTask", async (ctx) => {
  try {
    const updatedTask = await taskService.updateTask(
      ctx.request.body as Task,
      ctx.state.user.userId,
    );
    ctx.body = success(updatedTask, "更新任务成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 删除任务接口
router.delete("/deleteTask/:taskId", async (ctx) => {
  try {
    await taskService.deleteTask(ctx.params.taskId!);
    ctx.body = success(null, "删除任务成功");
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
