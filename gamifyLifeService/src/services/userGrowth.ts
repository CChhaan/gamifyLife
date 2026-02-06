import db from "../shared/db.ts";
import { nextLevelExp } from "../shared/growthCalc.ts";

export default class UserGrowthService {
  // 获取用户成长信息方法
  async getUserGrowth(userId) {
    try {
      const userGrowth = await db.UserGrowth.findOne({
        where: { user_id: userId },
      });
      return {
        ...userGrowth.toJSON(),
        nextLevelExp: nextLevelExp(userGrowth.level),
      };
    } catch (error) {
      console.error("获取用户成长信息失败", error);
      throw new Error(error.message || "获取用户成长信息失败");
    }
  }
}
