import dayjs from "dayjs";
import db from "../shared/db.ts";
import { Sequelize } from "sequelize";

export default class UserDailyLogService {
  // 检查并刷新过期的日志
  async checkAndRefreshExpiredLogs() {
    try {
      const today = dayjs().startOf("day");

      // 查找日期不是今天的所有记录
      const outdatedLogs = await db.UserDailyLogs.findAll({
        where: {
          date: {
            [db.Sequelize.Op.lt]: today.toDate(),
          },
        },
      });

      if (outdatedLogs.length > 0) {
        await this.dailyRefresh();
        console.log(
          `[${new Date()}] 发现 ${outdatedLogs.length} 条过期日志，已刷新`,
        );
      }
    } catch (error: any) {
      console.error("检查过期日志失败", error);
      throw new Error(error.message || "检查过期日志失败");
    }
  }
  // 每日刷新
  async dailyRefresh() {
    try {
      //数据库全部刷新
      const today = dayjs();
      await db.UserDailyLogs.update(
        {
          ai_use_count: 0,
          today_task_completion_count: 0,
          today_high_value_task_count: 0,
          date: today,
        }, // 将 count 重置为 0，更新 date 为今天
        { where: {} }, // 更新所有记录
      );
      console.log(`[${new Date()}] UserDailyLogs 已重置`);
    } catch (error: any) {
      console.error("每日刷新失败", error);
      throw new Error(error.message || "每日刷新失败");
    }
  }

  // 获取用户每日日志
  async getUserDailyLog(userId: number) {
    try {
      const userDailyLog = await db.UserDailyLogs.findByPk(userId);
      return userDailyLog;
    } catch (error: any) {
      console.error("获取用户每日日志失败", error);
      throw new Error(error.message || "获取用户每日日志失败");
    }
  }
}
