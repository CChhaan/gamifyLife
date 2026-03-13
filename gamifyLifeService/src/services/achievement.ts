import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
import { Transaction } from "sequelize";
import chalk from "chalk";
import websocketService from "../websocket/websocket.js";
import { Achievement } from "@/type/achievement.js";
export default class AchievementService {
  // 获取对应数据表和字段的成就列表
  async getAchievementsByType(achievementType: string, field: string) {
    try {
      const achievements = await db.Achievements.findAll({
        where: { type: achievementType, conditions: { field: field } },
      });
      return achievements;
    } catch (error: any) {
      console.error(chalk.red("获取成就列表失败:", error));
      throw new Error(error.message || "获取成就列表失败");
    }
  }
  // 判断字段的数值是否达成某项成就的要求
  async checkAchievementRequirements(
    achievement: Achievement,
    count: number,
  ): Promise<boolean> {
    try {
      const { count: requiredCount } = achievement.conditions[0];
      if (requiredCount !== undefined && count >= requiredCount) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(chalk.red("检查成就要求失败:", error));
      throw new Error(error.message || "检查成就要求失败");
    }
  }
  // 获取所有成就
  async getAllAchievements(userId: any) {
    try {
      const achievements = await db.Achievements.findAll({
        include: [
          { model: db.UserAchievements, as: "userAchievements" },
          {
            model: db.UserAchievements,
            as: "userAchievements",
            where: { user_id: userId },
            required: false, // 使用LEFT JOIN，即使没有互动记录也会返回帖子
          },
        ],
      });
      return achievements;
    } catch (error: any) {
      console.error(chalk.red("获取所有成就失败:", error));
      throw new Error(error.message || "获取所有成就失败");
    }
  }

  // 完成成就
  async completeAchievement(
    userId: number,
    achievementId: number,
    transaction?: Transaction,
  ) {
    try {
      // 如果成就本身已经完成了，不做任何事
      const existingAchievement = await db.UserAchievements.findOne({
        where: {
          user_id: userId,
          achievement_id: achievementId,
          is_unlocked: 1,
        },
      });
      if (existingAchievement) {
        return existingAchievement;
      }
      const userAchievement = await db.UserAchievements.create(
        {
          user_id: userId,
          achievement_id: achievementId,
          is_unlocked: 1,
          unlocked_at: new Date(),
          gift_got: 0,
        },
        { updateOnDuplicate: ["unlocked_at", "gift_got"], transaction },
      );
      // 获取完成的成就
      const completedAchievement = await db.Achievements.findOne({
        where: { id: achievementId },
      });
      console.log(
        chalk.yellow("用户完成成就:", completedAchievement!.dataValues.title),
      );
      return userAchievement;
    } catch (error: any) {
      console.error(chalk.red("完成成就失败:", error));
      throw new Error(error.message || "完成成就失败");
    }
  }
}
