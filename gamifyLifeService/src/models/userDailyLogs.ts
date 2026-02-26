import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { UserDailyLog } from "@/type/user.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class UserDailyLogs extends Model<UserDailyLog, UserDailyLog> {
    static associate(models: typeof db) {
      // 关联用户账号表（user_accounts）
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  UserDailyLogs.init(
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "user_accounts", // 关联的用户账号表
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // 用户账号删除时，成长数据也同步删除
        comment: "关联 user_accounts.id",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "日期",
      },
      ai_use_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "当日使用AI次数",
      },

      today_high_value_task_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "今日高价值任务完成数（防刷C规则）",
      },
      today_task_completion_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "今日任务完成总数",
      },
    },
    {
      sequelize,
      tableName: "user_daily_logs", // 对应数据库表名
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  );

  return UserDailyLogs;
};
