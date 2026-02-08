import { DataTypes as SequelizeDataTypes, Model, Sequelize } from "sequelize";
import db from "../shared/db.ts";
import { TaskCategory } from "@/type/task.ts";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class TaskCategories extends Model<TaskCategory, TaskCategory> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  TaskCategories.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "分类ID",
      },

      // 2. 所属用户ID（外键、无符号整数）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "所属用户ID",
        references: {
          model: "user_accounts", // 关联的表名
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // 3. 分类名称（用户内唯一）
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "分类名称（用户内唯一）",
      },

      // 4. 颜色HEX（默认值 #CCCCCC）
      color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: "#CCCCCC",
        comment: "颜色HEX值",
      },

      // 5. 排序值（默认0）
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "分类排序值",
      },
    },
    {
      sequelize,
      tableName: "task_categories",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true, // 启用逻辑删除（自动生成 deletedAt 字段）

      // 唯一约束：同一用户下分类名称不能重复
      indexes: [
        {
          unique: true,
          fields: ["user_id", "name"],
          name: "idx_user_name_unique",
        },
      ],
    },
  );

  return TaskCategories;
};
