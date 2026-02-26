import {
  DataTypes as SequelizeDataTypes,
  Sequelize,
  Model,
  UUIDV4,
} from "sequelize";
import db from "../shared/db.js";
import { Ticket } from "@/type/task.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class AiWorkOrders extends Model<Ticket, Ticket> {
    static associate(models: typeof db) {
      this.hasMany(models.AiDraftTasks, {
        foreignKey: "ai_job_id",
        sourceKey: "id",
      });
    }
  }

  AiWorkOrders.init(
    {
      id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4(),
        comment: "工单ID（UUID v4）",
      },
      // 2. 发起用户（外键 FK，关联用户表）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "user_accounts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        comment: "发起用户",
      },
      // 3. 用户输入的原始目标
      input_goal: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "用户输入的原始目标",
      },
      // 4. 处理状态（ENUM）
      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PROCESSING",
          "SUCCESS",
          "FAILED",
          "CONSUMED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
        comment: "处理状态",
      },

      // 9. 失败信息
      error_message: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
        comment: "失败信息",
      },
    },
    {
      sequelize,
      tableName: "ai_work_orders",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return AiWorkOrders;
};
