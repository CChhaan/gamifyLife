import db from "../shared/db.js";
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-e0bbbc2476284255879470c8e418eaac",
});

export default class TaskService {
  // 创建任务
  async createTask(userId, taskData) {
    try {
      const newTask = await db.Tasks.create({
        ...taskData,
        user_id: userId,
      });
      return newTask;
    } catch (error) {
      console.error("新建任务失败", error);
      throw new Error(error.message || "新建任务失败");
    }
  }

  // 获取用户任务列表
  async getTasks(userId) {
    try {
      const tasks = await db.Tasks.findAll({
        where: { user_id: userId },
      });
      return tasks;
    } catch (error) {
      console.error("获取任务列表失败", error);
      throw new Error(error.message || "获取任务列表失败");
    }
  }

  // 获取用户任务详情
  async getTask(taskId) {
    try {
      const task = await db.Tasks.findByPk(taskId);
      return task;
    } catch (error) {
      console.error("获取任务详情失败", error);
      throw new Error(error.message || "获取任务详情失败");
    }
  }

  // 删除任务
  async deleteTask(taskId) {
    try {
      await db.Tasks.destroy({ where: { id: taskId } });
    } catch (error) {
      console.error("删除任务失败", error);
      throw new Error(error.message || "删除任务失败");
    }
  }

  // ai创建任务
  async aiCreateTask(taskData) {
    try {
      let messages = [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: taskData.content,
        },
      ];
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages,
        response_format: {
          type: "json_object",
        },
      });
      return response;
    } catch (error) {
      console.error("ai创建任务失败", error);
      throw new Error(error.message || "ai创建任务失败");
    }
  }
}
