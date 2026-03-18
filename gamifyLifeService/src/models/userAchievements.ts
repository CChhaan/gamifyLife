import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import { UserAchievementAttributes } from "@/type/achievement.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class UserAchievements extends Model<
    UserAchievementAttributes,
    UserAchievementAttributes
  > {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      this.belongsTo(models.Achievements, {
        foreignKey: "achievement_id",
        targetKey: "id",
        as: "achievement",
      });
    }
  }

  UserAchievements.init(
    {
      // 记录ID
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "记录ID",
      },
      // 用户ID
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "用户ID",
        // 外键约束（关联User表）
        references: {
          model: "user_accounts", // 关联的表名
          key: "id", // 关联的字段名
        },
        onUpdate: "CASCADE", // 更新时级联
        onDelete: "CASCADE", // 删除时限制
      },
      // 成就ID
      achievement_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "成就ID",
        // 外键约束（关联Achievement表）
        references: {
          model: "achievements", // 关联的表名
          key: "id", // 关联的字段名
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      // 是否已经领取了奖励
      gift_got: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "是否已经领取了奖励",
      },
      // 是否已解锁
      is_unlocked: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "是否已解锁",
      },
      // 解锁时间
      unlocked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "解锁时间",
      },
    },
    {
      sequelize,
      tableName: "user_achievements",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
      indexes: [
        {
          name: "user_achievements_user_id_post_id_interaction_type_unique", // 固定索引名称
          unique: true,
          fields: ["user_id", "achievement_id"],
        },
      ],
    },
  );

  return UserAchievements;
};
