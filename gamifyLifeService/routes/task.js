import Router from "koa-router";
import { success, badRequest } from "../shared/response.js";
import TaskService from "../services/task.js";

const router = new Router({ prefix: "/task" });

const taskService = new TaskService();

router.get("/", async (ctx) => {
  try {
    const tasks = await taskService.getTasks(ctx.state.user.userId);
    ctx.body = success(tasks, "获取任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 创建任务接口
router.post("/createTask", async (ctx) => {
  try {
    const newTask = await taskService.createTask(
      ctx.state.user.userId,
      ctx.request.body,
    );
    ctx.body = success(newTask, "创建任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 获取用户任务详情接口
router.get("/getTaskDetail", async (ctx) => {
  try {
    const taskDetail = await taskService.getTask(
      ctx.state.user.userId,
      ctx.query.taskId,
    );
    ctx.body = success(taskDetail, "获取任务详情成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// AI生成任务接口
router.post("/aiCreateTask", async (ctx) => {
  try {
    const newTask = await taskService.aiCreateTask(
      //   ctx.state.user.userId,
      ctx.request.body,
    );
    ctx.body = success(newTask, "生成任务成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
