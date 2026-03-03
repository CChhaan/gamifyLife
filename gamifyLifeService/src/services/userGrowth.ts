import type { UserGrowth } from "@/type/user.js";
import db from "../shared/db.js";
import { nextLevelExp } from "../shared/growthCalc.js";
import { Transaction } from "sequelize";
import PostService from "./post.js";
const postService = new PostService();

export default class UserGrowthService {
  // 获取用户成长信息方法
  async getUserGrowth(userId: number) {
    try {
      const where = { user_id: userId };
      const userGrowth = await db.UserGrowth.findOne({ where });
      if (!userGrowth) {
        throw new Error("用户成长信息不存在");
      }
      return {
        ...userGrowth.toJSON(),
        nextLevelExp: nextLevelExp(userGrowth.dataValues.level!),
      };
    } catch (error: any) {
      console.error("获取用户成长信息失败", error);
      throw new Error(error.message || "获取用户成长信息失败");
    }
  }

  // 用户成长记录提升
  async upgradeUserGrowth(
    userId: number,
    growthData: UserGrowth,
    t: Transaction,
  ) {
    try {
      const where = { user_id: userId };
      const existingGrowth = await db.UserGrowth.findOne({ where });

      if (!existingGrowth) {
        throw new Error("用户成长信息不存在");
      }

      // 判断是否升级
      const nextLevelExpRequired = nextLevelExp(
        existingGrowth.dataValues.level!,
      );
      // 计算新的经验值
      const newExp =
        existingGrowth.dataValues.total_experience! +
        growthData.total_experience!;
      // 计算新的等级
      const newLevel =
        existingGrowth.dataValues.level! +
        Math.floor(newExp / nextLevelExpRequired);
      // 计算最终的经验值（0-99之间）
      const finalExp = newExp % nextLevelExpRequired;

      existingGrowth.update(
        { level: newLevel, total_experience: finalExp },
        { transaction: t },
      );

      existingGrowth.increment(
        {
          gold: growthData.gold,
          mind: growthData.mind,
          body: growthData.body,
          social: growthData.social,
          discipline: growthData.discipline,
        },
        { transaction: t },
      );

      if (newLevel > existingGrowth.dataValues.level!) {
        await postService.createSystemPost(
          userId,
          "USER",
          existingGrowth.dataValues.user_id,
          `我升级到等级${newLevel}！`,
          t,
        );
      }
    } catch (error: any) {
      console.error("更新用户成长信息失败", error);
      throw new Error(error.message || "更新用户成长信息失败");
    }
  }
}
