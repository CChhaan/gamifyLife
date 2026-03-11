import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import { Achievement } from "@/type/achievement.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Achievements extends Model<Achievement, Achievement> {}

  Achievements.init(
    {
      // 成就ID（主键、自增、无符号整数）
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "成就ID",
      },
      // 成就标题
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "成就标题",
      },
      // 成就描述
      description: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "成就描述",
      },
      // 图标URL（可选）
      icon_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
        comment: "成就图标URL",
      },
      // 成就大类（枚举）
      type: {
        type: DataTypes.ENUM("TASK", "GROWTH", "PET", "SOCIAL", "MISC", "DIY"),
        allowNull: false,
        defaultValue: "MISC",
        comment: "成就大类",
      },
      // 混合条件逻辑（枚举）
      condition_logic: {
        type: DataTypes.ENUM("AND", "OR"),
        allowNull: false,
        defaultValue: "AND",
        comment: "混合条件逻辑",
      },
      // 条件数组（JSON类型）
      conditions: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: "成就条件数组",
      },
      // 奖励数组（JSON类型）
      rewards: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: "成就奖励数组",
      },
      // 是否隐藏（布尔型，TINYINT(1)）
      is_hidden: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "是否隐藏：0-不隐藏，1-隐藏",
      },
      // 是否启用（布尔型，TINYINT(1)）
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: "是否启用：0-禁用，1-启用",
      },
      // 展示顺序
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "展示顺序",
      },
    },
    {
      sequelize,
      tableName: "achievements",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return Achievements;
};
