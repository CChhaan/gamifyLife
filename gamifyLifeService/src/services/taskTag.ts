import { InfluenceAttr, TaskTag } from "@/type/task.ts";
import db from "../shared/db.ts";

export default class TaskTagService {
  // 获取用户任务标签方法
  async getTaskTagList(userId: number) {
    try {
      const taskTags = await db.TaskTags.findAll({
        where: { user_id: userId },
      });
      return taskTags;
    } catch (error: any) {
      console.error("获取用户任务标签失败", error);
      throw new Error(error.message || "获取用户任务标签失败");
    }
  }

  // 创建标签
  async createTaskTag(userId: number, tagData: TaskTag) {
    try {
      let secondary = tagData.secondary_attr;
      if (!secondary) secondary = null;
      const newTaskTag = await db.TaskTags.create({
        user_id: userId,
        name: tagData.name,
        primary_attr: tagData.primary_attr,
        secondary_attr: secondary,
      });
      return newTaskTag;
    } catch (error: any) {
      console.error("创建标签失败", error);
      throw new Error(error.message || "创建标签失败");
    }
  }
  // 修改标签名称
  async updateTaskTagName(userId: number, tagId: any, newName: string) {
    try {
      const updatedTaskTag = await db.TaskTags.update(
        { name: newName },
        { where: { user_id: userId, id: tagId } }
      );
      return updatedTaskTag;
    } catch (error: any) {
      console.error("修改标签名称失败", error);
      throw new Error(error.message || "修改标签名称失败");
    }
  }

  // 修改标签影响属性
  async updateTaskTagAttributes(
    userId: number,
    tagId: any,
    attributes: {
      primary_attr: InfluenceAttr | "";
      secondary_attr: InfluenceAttr | "";
    }
  ) {
    try {
      const updatedTaskTag = await db.TaskTags.update(
        {
          primary_attr: attributes.primary_attr,
          secondary_attr: attributes.secondary_attr,
        },
        { where: { user_id: userId, id: tagId } }
      );
      return updatedTaskTag;
    } catch (error: any) {
      console.error("修改标签影响属性失败", error);
      throw new Error(error.message || "修改标签影响属性失败");
    }
  }

  // 删除标签
  async deleteTaskTag(userId: any, tagId: any) {
    try {
      const where = { user_id: userId, id: tagId };
      const existingTag = await db.TaskTags.findOne({ where });
      if (!existingTag) {
        throw new Error("标签不存在");
      }
      await db.TaskTags.destroy({ where });
      return { message: "标签删除成功" };
    } catch (error: any) {
      console.error("删除标签失败", error);
      throw new Error(error.message || "删除标签失败");
    }
  }
}
