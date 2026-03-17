import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import { UserInfo as UserInfoType } from "@/type/user.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class UserInfo extends Model<UserInfoType, UserInfoType> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  UserInfo.init(
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "user_accounts", // 关联的表名
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "昵称",
      },
      gender: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "0-未知,1-男,2-女",
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        comment: "生日",
      },
      bio: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null,
        comment: "个性签名",
      },
      avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
        comment: "用户上传头像链接",
      },
      today_use_ai_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "AI功能使用次数",
      },
      total_difficulty: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "完成困难任务总数",
      },
      total_task_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "完成任务总数",
      },
      total_ai_task_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "完成AI生成任务总数",
      },
    },
    {
      sequelize,
      tableName: "user_info",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  );
  UserInfo.beforeUpdate(async (userInfo: UserInfo) => {
    console.log("beforeUpdate 钩子被触发");
    console.log("变更的字段:", userInfo.changed());
    if (userInfo.changed("total_difficulty" as keyof UserInfo)) {
      const newTotalDifficulty = userInfo.dataValues.total_difficulty;
      console.log(
        `检测到 total_difficulty 变更，新的 total_difficulty 值: ${newTotalDifficulty}`,
      );
      const { default: AchievementService } =
        await import("@/services/achievement.js");
      const achievementService = new AchievementService();
      // 检查是否满足成就条件
      const achievements = await achievementService.getAchievementsByType(
        "TASK",
        "task_high_level",
      );
      for (const achievement of achievements) {
        const isAchieved =
          await achievementService.checkAchievementRequirements(
            achievement.dataValues,
            newTotalDifficulty as number,
          );
        if (isAchieved) {
          await achievementService.completeAchievement(
            userInfo.dataValues.user_id!,
            achievement.dataValues.id,
          );
        }
      }
    }
    if (userInfo.changed("total_task_count" as keyof UserInfo)) {
      const newTotalTaskCount = userInfo.dataValues.total_task_count;
      console.log(
        `检测到 total_task_count 变更，新的 total_task_count 值: ${newTotalTaskCount}`,
      );
      const { default: AchievementService } =
        await import("@/services/achievement.js");
      const achievementService = new AchievementService();
      // 检查是否满足成就条件
      const achievements = await achievementService.getAchievementsByType(
        "TASK",
        "task_total",
      );
      for (const achievement of achievements) {
        const isAchieved =
          await achievementService.checkAchievementRequirements(
            achievement.dataValues,
            newTotalTaskCount as number,
          );
        if (isAchieved) {
          await achievementService.completeAchievement(
            userInfo.dataValues.user_id!,
            achievement.dataValues.id,
          );
        }
      }
    }
    if (userInfo.changed("total_ai_task_count" as keyof UserInfo)) {
      const newTotalAiTaskCount = userInfo.dataValues.total_ai_task_count;
      console.log(
        `检测到 total_ai_task_count 变更，新的 total_ai_task_count 值: ${newTotalAiTaskCount}`,
      );
      const { default: AchievementService } =
        await import("@/services/achievement.js");
      const achievementService = new AchievementService();
      // 检查是否满足成就条件
      const achievements = await achievementService.getAchievementsByType(
        "TASK",
        "task_ai_total",
      );
      for (const achievement of achievements) {
        const isAchieved =
          await achievementService.checkAchievementRequirements(
            achievement.dataValues,
            newTotalAiTaskCount as number,
          );
        if (isAchieved) {
          await achievementService.completeAchievement(
            userInfo.dataValues.user_id!,
            achievement.dataValues.id,
          );
        }
      }
    }
  });
  return UserInfo;
};
