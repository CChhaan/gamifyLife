import db from "../shared/db.ts";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import sequelize from "@/shared/sequelize.ts";
import readPrompt from "@/prompts/readPrompt.ts";
import { Task } from "@/type/task.ts";
import TaskService from "../services/task.ts";
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.AI_TOKEN,
});
const taskService = new TaskService();

export default class AiTaskService {
  // 异步处理AI任务
  private async processAITask(jobId: string, content: string, userId: number) {
    const t = await sequelize.transaction();
    try {
      // 用户标签列表
      const tags = (await db.TaskTags.findAll()).map((tag) => tag.dataValues);
      // 用户分类列表
      const categories = (await db.TaskCategories.findAll()).map(
        (category) => category.dataValues,
      );
      const prompt = readPrompt("aiCreateTask")
        .replaceAll("${tags}", JSON.stringify(tags))
        .replaceAll("${categories}", JSON.stringify(categories))
        .replaceAll("${userId}", userId.toString());
      let messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content,
        },
      ];
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages,
        response_format: {
          type: "json_object",
        },
      });
      //   ai工单表新增数据
      //   ai草稿任务表新增数据
      const taskData = JSON.parse(response.choices[0].message.content!).map(
        (task: Task) => ({
          ...task,
          ai_job_id: jobId,
        }),
      );
      await db.AiDraftTasks.bulkCreate(taskData, {
        transaction: t,
      });
      await db.AiWorkOrders.update(
        { status: "SUCCESS" },
        {
          where: { id: jobId },
          transaction: t,
        },
      );
      await t.commit();
      return response;
    } catch (error) {
      await t.rollback();
      console.error("AI任务处理失败", error);
      throw error;
    }
  }

  // ai创建任务
  async aiCreateTask(content: string, userId: number) {
    try {
      const newAiWork = await db.AiWorkOrders.create({
        user_id: userId,
        input_goal: content,
        status: "PENDING",
      });

      this.processAITask(newAiWork.dataValues.id!, content, userId).catch(
        (error) => {
          console.error("AI任务处理失败:", error);
          // 更新工单状态为失败
          db.AiWorkOrders.update(
            { status: "FAILED" },
            { where: { id: newAiWork.dataValues.id } },
          );
        },
      );

      return newAiWork;
    } catch (error: any) {
      console.error("ai创建任务失败", error);
      throw new Error(error.message || "ai创建任务失败");
    }
  }

  // 查询 AI 工单状态
  async getAIJobStatus(jobId: string) {
    try {
      const job = await db.AiWorkOrders.findOne({
        where: { id: jobId },
        include: [db.AiDraftTasks],
      });

      if (!job) {
        throw new Error("工单不存在");
      }

      return job;
    } catch (error: any) {
      console.error("查询工单状态失败", error);
      throw new Error(error.message || "查询工单状态失败");
    }
  }

  // 获取AI工单列表及其下面所有的临时草稿任务
  async getAITaskListWithDraft(userId: number) {
    try {
      const result = await db.AiWorkOrders.findAll({
        where: {
          user_id: userId,
        },
        include: [db.AiDraftTasks],
      });
      return result;
    } catch (error: any) {
      console.log("获取AI创建任务列表失败");
      throw new Error(error.message || "获取AI创建任务列表失败");
    }
  }

  // 修改AI创建的任务
  async updateAITask(id: number, taskData: Task) {
    try {
      const res = await db.AiDraftTasks.update(taskData, {
        where: {
          id,
        },
      });
      return res;
    } catch (error: any) {
      console.log("修改AI创建的任务失败");
      throw new Error(error.message || "修改AI创建的任务失败");
    }
  }

  // 删除AI创建的任务
  async deleteAITask(id: number) {
    try {
      const res = await db.AiDraftTasks.destroy({
        where: {
          id,
        },
      });
      return res;
    } catch (error: any) {
      console.log("删除AI创建的任务失败");
      throw new Error(error.message || "删除AI创建的任务失败");
    }
  }

  // 应用AI工单下的所有临时草稿任务
  async applyAITask(jobId: string) {
    try {
      const tasks = await db.AiDraftTasks.findAll({
        where: {
          ai_job_id: jobId,
        },
      });
      tasks.forEach(async (task) => {
        await db.Tasks.create(task.dataValues);
      });
      return "success";
    } catch (error: any) {
      console.log("应用AI创建的任务失败");
      throw new Error(error.message || "应用AI创建的任务失败");
    }
  }
}
