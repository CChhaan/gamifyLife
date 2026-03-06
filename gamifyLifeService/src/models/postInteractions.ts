import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { Interaction } from "@/type/post.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class PostInteractions extends Model<Interaction, Interaction> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      this.belongsTo(models.UserInfo, {
        foreignKey: "user_id", // 重点：用同一个 user_id
        targetKey: "user_id", // UserInfo 里的字段是 user_id
        as: "userInfo",
      });
      this.belongsTo(models.Posts, {
        foreignKey: "post_id",
        targetKey: "id",
        as: "post",
      });
    }
  }

  PostInteractions.init(
    {
      // 记录ID
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "记录ID",
      },
      // 互动用户ID
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "互动用户ID",
        references: { model: "user_accounts", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      // 动态ID
      post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "动态ID",
        references: { model: "posts", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      // 互动类型（点赞/点踩）
      interaction_type: {
        type: DataTypes.ENUM("LIKE", "DISLIKE", "VIEW"),
        allowNull: false,
        comment: "互动类型（LIKE：点赞，DISLIKE：点踩，VIEW：浏览）",
      },
      // 是否有效（1有效，0取消）
      is_active: {
        type: DataTypes.TINYINT(),
        allowNull: false,
        defaultValue: 1,
        comment: "是否有效（1：有效，0：取消）",
      },
    },
    {
      sequelize,
      tableName: "post_interactions",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return PostInteractions;
};
