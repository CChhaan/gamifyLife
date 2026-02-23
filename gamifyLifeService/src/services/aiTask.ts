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
      const tags = (
        await db.TaskTags.findAll({ where: { user_id: userId } })
      ).map((tag) => tag.dataValues);
      // 用户分类列表
      const categories = (
        await db.TaskCategories.findAll({ where: { user_id: userId } })
      ).map((category) => category.dataValues);
      // 生成AI提示词
      const prompt = readPrompt("aiCreateTask")
        .replaceAll("${tags}", JSON.stringify(tags))
        .replaceAll("${categories}", JSON.stringify(categories))
        .replaceAll("${userId}", userId.toString());

      let messages: ChatCompletionMessageParam[] = [
        { role: "system", content: prompt },
        { role: "user", content },
      ];
      const response = (
        await openai.chat.completions.create({
          model: "deepseek-chat",
          messages,
          response_format: { type: "json_object" },
        })
      ).choices[0].message.content;
      const taskData = JSON.parse(response!).map((task: Task) => ({
        ...task,
        ai_job_id: jobId,
      }));

      // 更新数据库相关表段
      await db.AiDraftTasks.bulkCreate(taskData, { transaction: t });
      await db.AiWorkOrders.update(
        { status: "SUCCESS" },
        { where: { id: jobId }, transaction: t }
      );

      await t.commit();
      return response;
    } catch (error) {
      await t.rollback();
      console.error("AI任务处理失败", error);
      throw error;
    }
  }

  // AI 生成任务
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
          newAiWork.update({ status: "FAILED" });
        }
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
      console.error("工单状态查询失败", error);
      throw new Error(error.message || "工单状态查询失败");
    }
  }

  // 获取 AI 工单列表
  async getAITaskListWithDraft(userId: number) {
    try {
      const result = await db.AiWorkOrders.findAll({
        where: { user_id: userId },
        include: [db.AiDraftTasks],
        order: [["createdAt", "DESC"]],
      });
      return result;
    } catch (error: any) {
      console.log("AI创建任务列表获取失败");
      throw new Error(error.message || "AI创建任务列表获取失败");
    }
  }

  // 修改 AI 草稿任务
  async updateAITask(taskData: Task) {
    try {
      const task = (await db.AiDraftTasks.findByPk(taskData.id))!;
      if (task.dataValues.status !== "UNUSED") {
        throw new Error("已应用的任务无法修改");
      }
      const res = await task.update(taskData);
      return res;
    } catch (error: any) {
      console.log("AI创建的任务修改失败");
      throw new Error(error.message || "AI创建的任务修改失败");
    }
  }

  // 删除 AI 草稿任务
  async deleteAITask(id: any) {
    try {
      const task = (await db.AiDraftTasks.findByPk(id))!;
      if (task.dataValues.status !== "UNUSED") {
        throw new Error("已应用的任务无法删除");
      }
      const res = await task.destroy();
      return res;
    } catch (error: any) {
      console.log("AI创建的任务删除失败");
      throw new Error(error.message || "AI创建的任务删除失败");
    }
  }

  // 应用 AI 工单中的所有任务
  async applyAITask(userId: any, jobId: string) {
    const t = await db.sequelize.transaction();
    try {
      const tasks = await db.AiDraftTasks.findAll({
        where: { ai_job_id: jobId },
        transaction: t,
      });
      for (const task of tasks) {
        if (task.dataValues.status !== "UNUSED") {
          continue;
        }
        await taskService.createTask(userId, task.dataValues);
        await task.update({ status: "PENDING" }, { transaction: t });
      }
      await db.AiWorkOrders.update(
        { status: "CONSUMED" },
        { where: { id: jobId }, transaction: t }
      );
      await t.commit();
      return { success: true };
    } catch (error: any) {
      await t.rollback();
      console.log("AI创建的任务应用失败");
      throw new Error(error.message || "AI创建的任务应用失败");
    }
  }
}
