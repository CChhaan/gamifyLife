import db from "../shared/db.ts";
import { taskAttr, taskExp, taskGold } from "../shared/growthCalc.ts";
import dayjs from "dayjs";
import { Task } from "@/type/task.ts";

export default class TaskService {
  // 创建任务
  async createTask(userId: number, taskData: Task): Promise<Task> {
    const t = await db.sequelize.transaction();

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
      if (taskData.status === "UNUSED") {
        await db.AiDraftTasks.update(
          { status: "PENDING" },
          { where: { id: taskData.id }, transaction: t },
        );
      }
      const newTask = await db.Tasks.create(
        {
          ...taskData,
          status: "PENDING",
          id: taskId,
          final_exp,
          final_gold,
          estimated_attr_gains: attrMap,
          user_id: userId,
        },
        { transaction: t },
      );
      await t.commit();
      return newTask.dataValues;
    } catch (error: any) {
      await t.rollback();
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
      const tag2 = (await db.TaskTags.findByPk(tag_id_2))?.dataValues;
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
  async getTask(taskId: any) {
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
  async deleteTask(taskId: string) {
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
}
