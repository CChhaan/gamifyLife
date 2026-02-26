import db from "../shared/db.js";
import { nextLevelExp } from "../shared/growthCalc.js";

export default class UserGrowthService {
  // 获取用户成长信息方法
  async getUserGrowth(userId: number) {
    try {
      const userGrowth = await db.UserGrowth.findOne({
        where: { user_id: userId },
      });
      if (!userGrowth) {
        throw new Error("用户成长信息不存在");
      }
      return {
        ...userGrowth.toJSON(),
        nextLevelExp: nextLevelExp(userGrowth.dataValues.level),
      };
    } catch (error: any) {
      console.error("获取用户成长信息失败", error);
      throw new Error(error.message || "获取用户成长信息失败");
    }
  }
}
