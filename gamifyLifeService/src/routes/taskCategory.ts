import Router from "koa-router";
import { success, badRequest } from "../shared/response.ts";
import TaskCategoryService from "../services/taskCategory.ts";

const router = new Router({ prefix: "/taskCategory" });

const taskCategoryService = new TaskCategoryService();
// 获取任务分类接口
router.get("/", async (ctx) => {
  try {
    const taskCategories = await taskCategoryService.getTaskCategories(
      ctx.state.user.userId,
    );
    ctx.body = success(taskCategories, "获取任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 创建任务分类接口
router.post("/createTaskCategory", async (ctx) => {
  try {
    const newCategory = await taskCategoryService.createTaskCategory(
      ctx.state.user.userId,
      ctx.request.body,
    );
    ctx.body = success(newCategory, "创建任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 删除任务分类接口
router.delete("/deleteTaskCategory/:categoryId", async (ctx) => {
  try {
    const categoryId = ctx.params.categoryId;
    const result = await taskCategoryService.deleteTaskCategory(categoryId);
    ctx.body = success(result, "删除任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

// 更新任务分类接口
router.put("/updateTaskCategory/:categoryId", async (ctx) => {
  try {
    const categoryId = ctx.params.categoryId;
    const updatedCategory = await taskCategoryService.updateTaskCategory(
      categoryId,
      ctx.request.body,
    );
    ctx.body = success(updatedCategory, "更新任务分类成功");
  } catch (error) {
    ctx.status = 400;
    ctx.body = badRequest(error.message);
  }
});

export default router;
