import Router from "koa-router";
import { success } from "../shared/response.js";
import TaskCategoryService from "../services/taskCategory.js";
import { TaskCategory } from "@/type/task.js";
import { routerFnc } from "@/shared/commonFnc.js";

const router = new Router({ prefix: "/taskCategory" });

const taskCategoryService = new TaskCategoryService();

// 获取任务分类
router.get("/", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const taskCategories = await taskCategoryService.getTaskCategories(userId);
    ctx.body = success(taskCategories, "任务分类获取成功");
  });
});

// 创建任务分类
router.post("/createTaskCategory", async (ctx) => {
  await routerFnc(ctx, async () => {
    const userId = ctx.state.user.userId;
    const categoryData = ctx.request.body as TaskCategory;
    const newCategory = await taskCategoryService.createTaskCategory(
      userId,
      categoryData,
    );
    ctx.body = success(newCategory, "任务分类创建成功");
  });
});

// 删除任务分类
router.delete("/deleteTaskCategory/:categoryId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const categoryId = ctx.params.categoryId;
    const result = await taskCategoryService.deleteTaskCategory(categoryId);
    ctx.body = success(result, "任务分类删除成功");
  });
});

// 更新任务分类
router.put("/updateTaskCategory/:categoryId", async (ctx) => {
  await routerFnc(ctx, async () => {
    const categoryId = ctx.params.categoryId;
    const categoryData = ctx.request.body as TaskCategory;
    const updatedCategory = await taskCategoryService.updateTaskCategory(
      categoryId,
      categoryData,
    );
    ctx.body = success(updatedCategory, "任务分类更新成功");
  });
});

export default router;
