import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { Post } from "@/type/post.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  // 成就配置：属性名 -> (成就类型, 字段名) 的映射
  // const ACHIEVEMENT_CONFIG: Record<any, [string, string]> = {
  //   post: ["SOCIAL", "post"],
  //   like: ["SOCIAL", "like"],
  // };
  class Posts extends Model<Post, Post> {
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
      this.hasMany(models.PostInteractions, {
        foreignKey: "post_id",
        sourceKey: "id",
        as: "interactions",
      });
    }
  }

  Posts.init(
    {
      // 动态ID
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "动态ID",
      },
      // 关联用户（主角）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "关联用户ID（主角）",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: { model: "user_accounts", key: "id" },
      },
      // 动态类型
      post_type: {
        type: DataTypes.ENUM(
          "MILESTONE",
          "ACHIEVEMENT",
          "TASK",
          "PET",
          "USER",
          "SYSTEM",
        ),
        allowNull: false,
        comment: "动态类型",
      },

      // 关联目标ID
      target_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
        comment: "关联目标ID",
      },
      // 系统生成标题
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "系统生成标题",
      },
      // 点赞数
      like_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "点赞数",
      },
      // 点踩数
      dislike_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "点踩数",
      },
      // 浏览数
      view_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "浏览数",
      },
      // 状态
      status: {
        type: DataTypes.ENUM("DRAFT", "PUBLISHED", "HIDDEN"),
        allowNull: false,
        defaultValue: "DRAFT",
        comment: "动态状态：草稿/已发布/已隐藏",
      },

      // 用户确认发布时间
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "用户确认发布时间",
      },
    },
    {
      sequelize,
      tableName: "posts",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  Posts.beforeUpdate(async (post: Posts) => {
    // 检查点赞数是否改变
    if (
      post.changed("like_count" as keyof Posts) &&
      post.dataValues.like_count !== undefined
    ) {
      const { default: AchievementService } =
        await import("@/services/achievement.js");
      const achievementService = new AchievementService();
      const achievements = await achievementService.getAchievementsByType(
        "SOCIAL",
        "like",
      );
      for (const achievement of achievements) {
        const isAchieved =
          await achievementService.checkAchievementRequirements(
            achievement.dataValues,
            post.dataValues.like_count,
          );
        if (isAchieved) {
          await achievementService.completeAchievement(
            post.dataValues.user_id!,
            achievement.dataValues.id,
          );
        }
      }
    }
  });

  return Posts;
};
