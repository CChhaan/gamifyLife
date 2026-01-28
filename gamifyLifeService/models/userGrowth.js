import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserGrowth extends Model {
    static associate(models) {
      // 关联用户账号表（user_accounts）
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  UserGrowth.init(
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
      level: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        comment: "当前等级",
      },
      total_experience: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "累计总经验",
      },
      gold: {
        type: DataTypes.INTEGER, // 允许负数，不用 UNSIGNED
        allowNull: false,
        defaultValue: 0,
        comment: "金币（可负）",
      },
      mind: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "心智属性",
      },
      body: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "体魄属性",
      },
      social: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "社交属性",
      },
      discipline: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "自律属性",
      },
      today_high_value_task_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "今日高价值任务完成数（防刷C规则）",
      },
      last_reset_date: {
        type: DataTypes.DATEONLY, // 仅存储日期（无时间）
        allowNull: false,
        defaultValue: DataTypes.NOW, // 等价于 MySQL 的 CURDATE()
        comment: "上次重置计数日期",
      },
    },
    {
      sequelize,
      tableName: "user_growth", // 对应数据库表名
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  );

  return UserGrowth;
};
