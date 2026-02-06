import db from "../shared/db.ts";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { taskAttr, taskExp, taskGold } from "../shared/growthCalc.ts";
import dayjs from "dayjs";
import { Task } from "@/type/task.ts";
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.AI_TOKEN,
});

export default class TaskService {
  // 创建任务
  async createTask(userId: number, taskData: Task): Promise<Task> {
    try {
      const { difficulty, tag_id_1, tag_id_2, due_time } = taskData;
      const finishTime = dayjs().diff(
        dayjs(due_time, "YYYY-M-D H:mm"),
        "hour",
        true,
      );
      const { level } = await db.UserGrowth.findByPk(userId);
      const tag1 = await db.TaskTags.findByPk(tag_id_1);
      const tag2 = await db.TaskTags.findByPk(tag_id_2);
      const final_exp = taskExp(difficulty, level, Math.ceil(-finishTime));
      const final_gold = taskGold(difficulty, Math.ceil(-finishTime));

      const attrMap = {};
      if (tag1) {
        if (tag1.primary_attr) {
          attrMap[tag1.primary_attr]
            ? (attrMap[tag1.primary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag1.primary_attr] = taskAttr(level, difficulty));
        }
        if (tag1.secondary_attr) {
          attrMap[tag1.secondary_attr]
            ? (attrMap[tag1.secondary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag1.secondary_attr] = taskAttr(level, difficulty));
        }
      }
      if (tag2) {
        if (tag2.primary_attr) {
          attrMap[tag2.primary_attr]
            ? (attrMap[tag2.primary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag2.primary_attr] = taskAttr(level, difficulty));
        }
        if (tag2.secondary_attr) {
          attrMap[tag2.secondary_attr]
            ? (attrMap[tag2.secondary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag2.secondary_attr] = taskAttr(level, difficulty));
        }
      }

      const newTask = await db.Tasks.create({
        ...taskData,
        final_exp,
        final_gold,
        estimated_attr_gains: attrMap,
        user_id: userId,
      });
      return newTask;
    } catch (error) {
      console.error("新建任务失败", error);
      throw new Error(error.message || "新建任务失败");
    }
  }

  // 获取用户任务列表
  async getTasks(userId: number): Promise<Task[]> {
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

  // 修改任务
  async updateTask(taskData: Task, userId) {
    try {
      const { difficulty, tag_id_1, tag_id_2, due_time } = taskData;
      const finishTime = dayjs().diff(
        dayjs(due_time, "YYYY-M-D H:mm"),
        "hour",
        true,
      );
      const { level } = await db.UserGrowth.findByPk(userId);
      const tag1 = await db.TaskTags.findByPk(tag_id_1);
      const tag2 = await db.TaskTags.findByPk(tag_id_2);
      const final_exp = taskExp(difficulty, level, Math.ceil(-finishTime));
      const final_gold = taskGold(difficulty, Math.ceil(-finishTime));

      const attrMap = {};
      if (tag1) {
        if (tag1.primary_attr) {
          attrMap[tag1.primary_attr]
            ? (attrMap[tag1.primary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag1.primary_attr] = taskAttr(level, difficulty));
        }
        if (tag1.secondary_attr) {
          attrMap[tag1.secondary_attr]
            ? (attrMap[tag1.secondary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag1.secondary_attr] = taskAttr(level, difficulty));
        }
      }
      if (tag2) {
        if (tag2.primary_attr) {
          attrMap[tag2.primary_attr]
            ? (attrMap[tag2.primary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag2.primary_attr] = taskAttr(level, difficulty));
        }
        if (tag2.secondary_attr) {
          attrMap[tag2.secondary_attr]
            ? (attrMap[tag2.secondary_attr] += taskAttr(level, difficulty))
            : (attrMap[tag2.secondary_attr] = taskAttr(level, difficulty));
        }
      }

      const newTask = await db.Tasks.update(
        {
          ...taskData,
          final_exp,
          final_gold,
          estimated_attr_gains: attrMap,
        },
        { where: { id: taskData.id } },
      );
      return newTask;
    } catch (error) {
      console.error("更新任务失败", error);
      throw new Error(error.message || "更新任务失败");
    }
  }

  // 获取用户任务详情
  async getTask(taskId) {
    try {
      const task = await db.Tasks.findAll(taskId);
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
      let messages: ChatCompletionMessageParam[] = [
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
