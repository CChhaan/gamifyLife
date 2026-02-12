import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.ts";
import { Pet } from "@/type/pets.ts";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Pets extends Model<Pet, Pet> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }

  Pets.init(
    {
      // 宠物ID
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "宠物ID",
      },
      // 所属用户ID（单宠物制，唯一）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        comment: "所属用户（单宠物制）",

        references: {
          model: "user_accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // 宠物昵称
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "伙伴",
        comment: "宠物昵称",
      },
      // 成长阶段
      stage: {
        type: DataTypes.ENUM("INFANT", "YOUTH", "ADULT", "PERFECT"),
        allowNull: false,
        defaultValue: "INFANT",
        comment: "成长阶段",
      },
      // 宠物等级
      level: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        comment: "宠物等级",
      },
      // 宠物经验值
      exp: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "宠物经验值",
      },
      // 已进化次数
      evolution_count: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "已进化次数",
      },
      // 饥饿值（0-100）
      hunger: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 80,
        comment: "饥饿值0-100",
      },
      // 好感度（0-100）
      affection: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 10,
        comment: "好感度0-100",
      },
      // 当前状态
      status: {
        type: DataTypes.ENUM("NORMAL", "HUNGRY", "SICK", "SLEEPING"),
        allowNull: false,
        defaultValue: "NORMAL",
        comment: "当前状态",
      },
      // 上次互动时间
      last_interaction_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "上次互动时间",
      },
      // 上次进化时间
      last_evolution_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "上次进化时间",
      },
      // 上周宠物等级快照
      last_weekly_snapshot_level: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: "上周宠物等级快照",
      },
      // 上周好感度快照
      last_weekly_snapshot_affection: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: "上周好感度快照",
      },
    },
    {
      sequelize,
      tableName: "pets",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return Pets;
};
