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
      const { level } = (await db.UserGrowth.findByPk(userId))!.dataValues;
      const tag1 = (await db.TaskTags.findByPk(tag_id_1))!.dataValues;
      const tag2 = (await db.TaskTags.findByPk(tag_id_2))?.dataValues || null;
      const final_exp = taskExp(difficulty, level, Math.ceil(-finishTime));
      const final_gold = taskGold(difficulty, Math.ceil(-finishTime));

      const attrMap: Record<string, number> = {};
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
      const taskId = taskData.id || `${userId}-${Date.now()}`;
      const newTask = await db.Tasks.create({
        ...taskData,
        id: taskId,
        final_exp,
        final_gold,
        estimated_attr_gains: attrMap,
        user_id: userId,
      });
      return newTask.dataValues;
    } catch (error: any) {
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
      return tasks.map((task) => task.dataValues);
    } catch (error: any) {
      console.error("获取任务列表失败", error);
      throw new Error(error.message || "获取任务列表失败");
    }
  }

  // 修改任务
  async updateTask(taskData: Task, userId: number) {
    try {
      const { difficulty, tag_id_1, tag_id_2, due_time } = taskData;
      const finishTime = dayjs().diff(
        dayjs(due_time, "YYYY-M-D H:mm"),
        "hour",
        true,
      );
      const { level } = (await db.UserGrowth.findByPk(userId))!.dataValues;
      const tag1 = (await db.TaskTags.findByPk(tag_id_1))!.dataValues;
      const tag2 = (await db.TaskTags.findByPk(tag_id_2))!.dataValues;
      const final_exp = taskExp(difficulty, level, Math.ceil(-finishTime));
      const final_gold = taskGold(difficulty, Math.ceil(-finishTime));

      const attrMap: Record<string, number> = {};
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
    } catch (error: any) {
      console.error("更新任务失败", error);
      throw new Error(error.message || "更新任务失败");
    }
  }

  // 获取用户任务详情
  async getTask(taskId: number) {
    try {
      const task = await db.Tasks.findAll({
        where: { id: taskId },
      });
      return task;
    } catch (error: any) {
      console.error("获取任务详情失败", error);
      throw new Error(error.message || "获取任务详情失败");
    }
  }

  // 删除任务
  async deleteTask(taskId: number) {
    try {
      await db.Tasks.destroy({ where: { id: taskId } });
    } catch (error: any) {
      console.error("删除任务失败", error);
      throw new Error(error.message || "删除任务失败");
    }
  }

  // 完成任务
  async finishTask(taskId: number, userId: number) {
    try {
      // 更新任务状态
      const task = (await db.Tasks.findByPk(taskId))!.dataValues;
      await db.Tasks.update({ status: "COMPLETED" }, { where: { id: taskId } });
      // 更新用户属性
    } catch (error: any) {
      console.error("完成任务失败", error);
      throw new Error(error.message || "完成任务失败");
    }
  }

  // 放弃任务

  // ai创建任务
  async aiCreateTask(content: string, userId: number) {
    try {
      // 用户标签列表
      const tags = (await db.TaskTags.findAll()).map((tag) => tag.dataValues);
      // 用户分类列表
      const categories = (await db.TaskCategories.findAll()).map(
        (category) => category.dataValues,
      );
      let messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `你是一个任务智能规划助手，负责将用户输入的需求，转化为一系列详细的可实现的具有游戏化体验的任务，严格以JSON格式输出，贴合游戏化的核心逻辑，具体要求如下：
1.  基础规则：

- 可选标签列表：${JSON.stringify(tags)}（标签对应游戏内任务标签，影响用户属性，按需选取1-2个）
- 可选分类列表：${JSON.stringify(categories)}（分类对应游戏内“任务类型”，如“主线任务”“副本任务”“支线任务”等，仅选取1个）
- 任务难度等级：1-5（对应游戏关卡难度，1为新手级，2为初级，3为中级，4为高级，5为巅峰级，需结合用户需求合理匹配）

2.  游戏化核心要求（必遵循）：

- title（任务名称）：需带游戏感，格式参考“任务核心+ 趣味后缀”，例：撰写人工智能文章·知识解锁挑战
- description（任务描述）：融入游戏化话术，语言生动，避免生硬，例：“完成一篇关于人工智能的文章，要求：字数不少于1000字，解锁人工智能核心知识点解析”
- status（任务状态）：固定为“PENDING”（对应游戏内“未闯关”状态）
- category_id（分类ID）：对应可选分类列表的ID，匹配游戏内“任务类型”
- tag_id_1/tag_id_2（标签ID）：对应可选标签列表的ID，优先选取贴合“游戏任务属性”的标签
- parent_task_id（父任务ID）：（完成任务 A 才能进行任务 B）父子是链表关系，无父任务则置为null
- due_time（任务截止时间）：需结合用户需求合理匹配

3.  示例参考（严格对齐格式）：

EXAMPLE INPUT: 我需要写一篇关于人工智能的文章

EXAMPLE JSON OUTPUT:

[{
"id": ${userId}-${Date.now()},
"title": "撰写人工智能文章·知识解锁挑战",
"description": "完成一篇关于人工智能的文章，要求字数不少于1000字，包含对人工智能的深入分析，解锁核心知识点",
"category_id": 1,
"status": "PENDING",
"difficulty": 3,
"tag_id_1": 1,
"tag_id_2": 2,
"due_time": "2026-2-10 19:00:00",
"parent_task_id": null,
}]

4.  补充说明：
- 难度匹配：简单需求（如“写一段短句”）对应1-2级，中等需求（如“写一篇千字文章”）对应3级，复杂需求（如“写一篇带数据的深度报告”）对应4-5级
- 趣味适配：描述中可适当加入游戏化词汇，但不偏离用户原始需求，不添加无关内容
- 格式要求：JSON格式严格对齐示例，不遗漏必填字段，不添加多余字段，标签和分类ID严格匹配提供的可选列表，无语法错误
- 如果你认为一个任务无法满足用户需求，可以返回数组，包含多个任务，但每个任务需严格遵循上述格式，尽可能做到详细周到

          `,
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
      return response;
    } catch (error: any) {
      console.error("ai创建任务失败", error);
      throw new Error(error.message || "ai创建任务失败");
    }
  }
}
