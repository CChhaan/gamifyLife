import { TaskCategory } from "@/type/task.ts";
import db from "../shared/db.ts";

export default class TaskCategoryService {
  // 获取用户任务分类方法
  async getTaskCategories(userId: number) {
    try {
      const where = { user_id: userId };
      const taskCategories = await db.TaskCategories.findAll({ where });
      return taskCategories;
    } catch (error: any) {
      console.error("获取用户任务分类失败", error);
      throw new Error(error.message || "获取用户任务分类失败");
    }
  }

  // 创建用户任务分类方法
  async createTaskCategory(userId: number, categoryData: TaskCategory) {
    try {
      const newCategory = await db.TaskCategories.create({
        ...categoryData,
        user_id: userId,
      });
      return newCategory;
    } catch (error: any) {
      console.error("创建用户任务分类失败", error);
      throw new Error(error.message || "创建用户任务分类失败");
    }
  }

  // 更新用户任务分类方法
  async updateTaskCategory(categoryId: any, categoryData: TaskCategory) {
    try {
      const where: any = { id: categoryId };
      const existingCategory = await db.TaskCategories.findOne({ where });

      if (!existingCategory) {
        throw new Error("任务分类不存在");
      }

      const hasChanges = (
        Object.keys(categoryData) as (keyof TaskCategory)[]
      ).some((key) => {
        return existingCategory.dataValues[key] !== categoryData[key];
      });

      if (hasChanges) {
        await existingCategory.update(categoryData);
        return existingCategory.toJSON();
      } else {
        return { message: "任务分类无变化" };
      }
    } catch (error: any) {
      console.error("更新用户任务分类失败", error);
      throw new Error(error.message || "更新用户任务分类失败");
    }
  }

  // 删除用户任务分类方法
  async deleteTaskCategory(categoryId: any) {
    try {
      const where: any = { id: categoryId };
      const existingCategory = await db.TaskCategories.findOne({ where });

      if (!existingCategory) {
        throw new Error("任务分类不存在");
      }

      await existingCategory.destroy();

      return { message: "任务分类删除成功" };
    } catch (error: any) {
      console.error("删除用户任务分类失败", error);
      throw new Error(error.message || "删除用户任务分类失败");
    }
  }
}
