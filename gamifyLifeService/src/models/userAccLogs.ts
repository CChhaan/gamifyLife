import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { UserAccLog } from "@/type/user.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class UserAccLogs extends Model<UserAccLog, UserAccLog> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }

  UserAccLogs.init(
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true, // 一个用户一条记录，完全没问题
        comment: "用户ID",
      },

      // ==================== 经验 ====================
      weekly_experience: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      monthly_experience: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      yearly_experience: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ==================== 金币 ====================
      weekly_gold: {
        type: DataTypes.INTEGER.UNSIGNED, // 修复无符号
        allowNull: false,
        defaultValue: 0,
      },
      monthly_gold: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      yearly_gold: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ==================== 每周属性 ====================
      weekly_mind: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      weekly_body: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      weekly_social: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      weekly_discipline: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ==================== 每月属性 ====================
      monthly_mind: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      monthly_body: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      monthly_social: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      monthly_discipline: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ==================== 每年属性 ====================
      yearly_mind: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      yearly_body: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      yearly_social: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      yearly_discipline: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "user_acc_logs",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  );

  return UserAccLogs;
};
