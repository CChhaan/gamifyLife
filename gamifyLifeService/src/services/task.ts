import db from "../shared/db.ts";
import { taskAttr, taskExp, taskGold } from "../shared/growthCalc.ts";
import dayjs from "dayjs";
import PetService from "../services/pet.ts";
import { Task } from "@/type/task.ts";

const petService = new PetService();

export default class TaskService {
  // 验证高价值任务（核心防刷逻辑）
  private validateHighValueTask(
    task: Task,
    actualTimeSpentMinutes: number,
  ): boolean {
    const { difficulty, due_time, createdAt } = task;

    // 基础条件：难度必须 > 3
    if (!difficulty || difficulty <= 3) {
      return false;
    }

    // 计算预期时间（从创建到截止日期）
    const createdTime = dayjs(createdAt);
    const dueTime = dayjs(due_time, "YYYY-M-D H:mm");
    const expectedDurationMinutes = dueTime.diff(createdTime, "minute");

    // 基础条件：预期时间必须 > 2 天
    if (expectedDurationMinutes <= 2 * 24 * 60) {
      return false;
    }

    // 实际耗时也必须 > 预计耗时天数的一半（防止短时间内完成高难度任务）
    if (actualTimeSpentMinutes <= expectedDurationMinutes / 2) {
      return false;
    }

    //通过所有检查
    return true;
  }
  //  计算奖励倍数
  private calculateRewardMultiplier(
    completionIndex: number,
    todayHighValueCompletions: number,
    isHighValue: boolean,
  ): number {
    let ratio = 1;
    // 高价值任务：更激进的激励
    if (isHighValue) {
      // 前 5 个：130%
      if (todayHighValueCompletions <= 5) {
        ratio *= 1.3;
      }
      // 6-10 个：80%
      if (todayHighValueCompletions <= 10) {
        ratio *= 0.8;
      }
      // 超过10个：30%
      else {
        ratio *= 0.3;
      }
    }
    // 普通任务：平缓递减
    // 1-10 个：100%
    if (completionIndex <= 10) {
      ratio *= 1;
    }
    // 11-15 个：70%
    if (completionIndex <= 15) {
      ratio *= 0.7;
    }
    // 16-20 个：40%
    if (completionIndex > 15) {
      ratio *= 0.4;
    }
    return ratio;
  }

  // 属性增益乘法
  private multiplyAttrGains(
    gains: Record<string, number>,
    multiplier: number,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(gains)) {
      result[key] = Math.ceil(value * multiplier);
    }
    return result;
  }

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
      const tasks = await db.Tasks.findAll({ where: { user_id: userId } });
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
        { ...taskData, final_exp, final_gold, estimated_attr_gains: attrMap },
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
      const task = await db.Tasks.findAll({ where: { id: taskId } });
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

  // 放弃任务
  async abandonTask(taskId: string) {
    try {
      const task = await db.Tasks.findByPk(taskId);
      if (!task) {
        throw new Error("任务不存在");
      }
      await task.update({ status: "ABANDONED" });
    } catch (error: any) {
      console.error("放弃任务失败", error);
      throw new Error(error.message || "放弃任务失败");
    }
  }

  // 完成任务
  async finishTask(taskId: any, userId: number) {
    const t = await db.sequelize.transaction();
    try {
      // 1. 获取任务信息
      const task = (await db.Tasks.findByPk(taskId, { transaction: t }))!;
      if (!task) {
        throw new Error("任务不存在");
      }

      if (task.dataValues.status === "COMPLETED") {
        throw new Error("任务已完成");
      }

      // 如果该任务有父任务且父任务未完成
      if (task.dataValues.parent_task_id) {
        const parentTask = await db.Tasks.findByPk(
          task.dataValues.parent_task_id,
          { transaction: t },
        );
        if (!parentTask || parentTask.dataValues.status !== "COMPLETED") {
          throw new Error("父任务未完成");
        }
      }

      // 2. 计算实际耗时
      const completedTime = dayjs(); // 完成时间（现在）
      const createdTime = dayjs(task.dataValues.createdAt); // 创建时间
      const actualTimeSpentMinutes = completedTime.diff(createdTime, "minute");

      // 3. 判断是否为高价值任务
      const highValueValidation = this.validateHighValueTask(
        task.dataValues,
        actualTimeSpentMinutes,
      );

      // 4. 获取用户growth数据
      const userGrowth = (await db.UserGrowth.findByPk(userId, {
        transaction: t,
      }))!;

      // 5. 检查每日完成限制
      const userDailyLog = (await db.UserDailyLogs.findByPk(userId, {
        transaction: t,
      }))!;
      const todayCompletions =
        userDailyLog?.dataValues.today_task_completion_count || 0;
      const todayHighValueCompletions =
        userDailyLog?.dataValues.today_high_value_task_count || 0;

      if (todayCompletions >= 20) {
        await t.rollback();
        return {
          success: false,
          code: "DAILY_LIMIT_EXCEEDED",
          message: "今日已完成 20 个任务，明天继续加油！",
        };
      }

      // 6. 计算奖励倍数
      const rewardMultiplier = this.calculateRewardMultiplier(
        todayCompletions + 1,
        todayHighValueCompletions + 1,
        highValueValidation,
      );

      // 7. 计算最终收益
      const goldEarned = Math.ceil(
        task.dataValues.final_gold! * rewardMultiplier,
      );
      const expEarned = Math.ceil(
        task.dataValues.final_exp! * rewardMultiplier,
      );
      const attrGains = this.multiplyAttrGains(
        task.dataValues.estimated_attr_gains!,
        rewardMultiplier,
      );

      // 9. 更新任务状态
      await task.update(
        { status: "COMPLETED", completed_at: new Date().toString() },
        { transaction: t },
      );

      await userGrowth.increment(
        {
          total_experience: expEarned,
          gold: goldEarned,
          ...attrGains,
        },
        { transaction: t },
      );

      await userDailyLog.increment(
        {
          today_task_completion_count: 1,
          today_high_value_task_count: highValueValidation ? 1 : 0,
        },
        { transaction: t },
      );

      // 宠物经验加10，亲密度加5
      await petService.addPetExp(userId, 10, t);
      await petService.addPetLove(userId, 5, t);

      await t.commit();

      return {
        success: true,
        reward: {
          score: goldEarned,
          experience: expEarned,
          attributes: attrGains,
        },
        details: {
          isHighValue: highValueValidation,
          baseScore: task.dataValues.final_gold,
          multiplier: rewardMultiplier,
          actualTimeSpentMinutes,
          completionIndex: todayCompletions + 1,
          todayHighValueCompletions: todayHighValueCompletions + 1,
          remaining: 20 - (todayCompletions + 1),
        },
      };
    } catch (error: any) {
      await t.rollback();
      console.error("完成任务失败", error);
      throw new Error(error.message || "完成任务失败");
    }
  }
}
