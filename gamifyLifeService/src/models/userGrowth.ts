import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import { UserGrowth as UserGrowthType } from "@/type/user.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  // 成就配置：属性名 -> (成就类型, 字段名) 的映射
  const ACHIEVEMENT_CONFIG: Record<any, [string, string]> = {
    gold: ["GOLD", "gold"],
    consume: ["GOLD", "consume"],
    level: ["GROWTH", "level"],
    attr_single: ["GROWTH", "attr_single"],
    attr_all: ["GROWTH", "attr_all"],
  };

  const attributes: Array<keyof UserGrowthType> = [
    "mind",
    "body",
    "social",
    "discipline",
  ];

  // 通用的成就检查函数
  async function checkAchievements(
    userGrowth: UserGrowth,
    property: keyof UserGrowthType,
    newValue: number,
  ) {
    const config = ACHIEVEMENT_CONFIG[property];
    if (!config) return;

    const [type, field] = config;
    console.log(`检测到 ${property} 变更，新的值: ${newValue}`);
    const { default: AchievementService } =
      await import("@/services/achievement.js");
    const achievementService = new AchievementService();
    // 特殊处理属性类成就
    if (type === "GROWTH") {
      if (field === "attr_single") {
        // 检查是否有任意属性达到目标值
        for (const attr of attributes) {
          const attrValue = userGrowth.dataValues[attr] as number;
          if (attrValue >= newValue) {
            const achievements = await achievementService.getAchievementsByType(
              type,
              field,
            );
            for (const achievement of achievements) {
              const isAchieved =
                await achievementService.checkAchievementRequirements(
                  achievement.dataValues,
                  attrValue,
                );
              if (isAchieved) {
                await achievementService.completeAchievement(
                  userGrowth.dataValues.user_id!,
                  achievement.dataValues.id,
                );
              }
            }
          }
        }
      } else {
        // 检查是否所有属性都达到目标值
        const allMet = attributes.every(
          (attr) => (userGrowth.dataValues[attr] as number) >= newValue,
        );

        if (allMet) {
          const achievements = await achievementService.getAchievementsByType(
            type,
            field,
          );
          for (const achievement of achievements) {
            const isAchieved =
              await achievementService.checkAchievementRequirements(
                achievement.dataValues,
                newValue,
              );
            if (isAchieved) {
              await achievementService.completeAchievement(
                userGrowth.dataValues.user_id!,
                achievement.dataValues.id,
              );
            }
          }
        }
      }
      return;
    }

    const achievements = await achievementService.getAchievementsByType(
      type,
      field,
    );

    for (const achievement of achievements) {
      const isAchieved = await achievementService.checkAchievementRequirements(
        achievement.dataValues,
        newValue,
      );
      if (isAchieved) {
        await achievementService.completeAchievement(
          userGrowth.dataValues.user_id!,
          achievement.dataValues.id,
        );
      }
    }
  }

  class UserGrowth extends Model<UserGrowthType, UserGrowthType> {
    static associate(models: typeof db) {
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
      consume: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "总消费金额",
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
    },
    {
      sequelize,
      tableName: "user_growth", // 对应数据库表名
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  );

  // 监听是否达成成就
  UserGrowth.beforeUpdate(async (userGrowth: UserGrowth) => {
    let anyAttributeChanged = false;

    // 检查是否有属性变化
    for (const attr of attributes) {
      if (userGrowth.changed(attr as keyof UserGrowth)) {
        anyAttributeChanged = true;
        break;
      }
    }

    // 如果有属性变化，检查属性类成就
    if (anyAttributeChanged) {
      await checkAchievements(
        userGrowth,
        "attr_single" as keyof UserGrowthType,
        0,
      );
      await checkAchievements(
        userGrowth,
        "attr_all" as keyof UserGrowthType,
        0,
      );
    }

    for (const property of Object.keys(ACHIEVEMENT_CONFIG) as Array<
      keyof UserGrowthType
    >) {
      if (
        userGrowth.changed(property as keyof UserGrowth) &&
        userGrowth.dataValues[property] !== undefined
      ) {
        await checkAchievements(
          userGrowth,
          property,
          userGrowth.dataValues[property] as number,
        );
      }
    }
  });

  return UserGrowth;
};
