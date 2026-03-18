import { Transaction } from "sequelize";
import db from "../shared/db.js";

export default class TaskTagService {
  // 获取用户账号日志方法
  async getAccLogList(userId: number) {
    try {
      const accLogs = await db.UserAccLogs.findAll({
        where: { user_id: userId },
      });
      return accLogs;
    } catch (error: any) {
      console.error("获取用户账号日志失败", error);
      throw new Error(error.message || "获取用户账号日志失败");
    }
  }

  // 定时任务：根据参数将所有的周、月、年日志积累值置零
  async resetAccLogs(resetType: "weekly" | "monthly" | "yearly") {
    try {
      await db.UserAccLogs.update(
        { [resetType + "_experience"]: 0, [resetType + "_gold"]: 0 },
        { where: {} },
      );
    } catch (error: any) {
      console.error("重置用户账号日志失败", error);
      throw new Error(error.message || "重置用户账号日志失败");
    }
  }

  // 根据参数，更新某一项的积累值
  async updateAccLog(
    userId: number,
    field: "experience" | "gold",
    value: number,
    t?: Transaction,
  ) {
    try {
      await db.UserAccLogs.increment(
        {
          ["weekly_" + field]: value,
          ["monthly_" + field]: value,
          ["yearly_" + field]: value,
        },
        { where: { user_id: userId }, transaction: t },
      );
    } catch (error: any) {
      console.error("更新用户账号日志失败", error);
      throw new Error(error.message || "更新用户账号日志失败");
    }
  }
}
