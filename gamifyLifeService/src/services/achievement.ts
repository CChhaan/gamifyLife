import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
import { Transaction } from "sequelize";
import chalk from "chalk";
import websocketService from "../websocket/websocket.js";
import { Achievement } from "@/type/achievement.js";
import UserGrowthService from "./userGrowth.js";
import PetService from "./pet.js";

const userGrowthService = new UserGrowthService();

export default class AchievementService {
  // 获取对应数据表和字段的成就列表
  async getAchievementsByType(achievementType: string, fieldName: string) {
    try {
      const where = {
        type: achievementType,
        conditions: sequelize.literal(
          `JSON_CONTAINS(conditions, '${JSON.stringify([{ type: fieldName }])}')`,
        ),
      };
      console.log(chalk.yellow("获取成就列表条件:", JSON.stringify(where)));
      const achievements = await db.Achievements.findAll({ where });
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
        chalk.yellow("完成成就:", JSON.stringify(completedAchievement)),
      );
      // 发送完成成就通知
      await websocketService.sendAchievementNotification(
        userId,
        completedAchievement!.dataValues,
      );
      console.log(
        chalk.yellow("用户完成成就:", completedAchievement!.dataValues.title),
      );
      return userAchievement;
    } catch (error: any) {
      console.error(chalk.red("完成成就失败:", error));
      throw new Error(error.message || "完成成就失败");
    }
  }

  // 领取成就奖励
  async getAchievementReward(userId: number, achievementId: number) {
    const t = await sequelize.transaction();
    try {
      const achievement = await db.Achievements.findOne({
        where: { id: achievementId },
        transaction: t,
      });
      if (!achievement) {
        throw new Error("成就不存在");
      }
      // 检查用户是否已完成该成就
      const userAchievement = await db.UserAchievements.findOne({
        where: {
          user_id: userId,
          achievement_id: achievementId,
          is_unlocked: 1,
        },
        transaction: t,
      });
      if (!userAchievement) {
        throw new Error("用户未完成该成就");
      }
      // 检查用户是否已领取奖励
      if (userAchievement.dataValues.gift_got) {
        throw new Error("用户已领取该成就奖励");
      }
      // 更新用户成就记录，标记为已领取奖励
      await userAchievement.update({ gift_got: 1 }, { transaction: t });
      // 遍历奖励数组
      for (const reward of achievement.dataValues.rewards) {
        switch (reward.type) {
          case "exp":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { total_experience: reward.amount },
              t,
            );
            break;
          case "coin":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { gold: reward.amount },
              t,
            );
            break;
          case "pet_level":
            const petService = new PetService();
            await petService.addPetExp(userId, reward.amount || 0, t);
            break;
          case "social":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { attrGains: { social: reward.amount || 0 } },
              t,
            );
            break;
          case "mind":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { attrGains: { mind: reward.amount || 0 } },
              t,
            );
            break;
          case "body":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { attrGains: { body: reward.amount || 0 } },
              t,
            );
            break;
          case "discipline":
            await userGrowthService.upgradeUserGrowth(
              userId,
              { attrGains: { discipline: reward.amount || 0 } },
              t,
            );
            break;
          default:
            return "";
        }
      }
      // 返回成就奖励信息
      await t.commit();
      return userAchievement;
    } catch (error: any) {
      await t.rollback();
      console.error(chalk.red("领取成就奖励失败:", error));
      throw new Error(error.message || "领取成就奖励失败");
    }
  }
}
