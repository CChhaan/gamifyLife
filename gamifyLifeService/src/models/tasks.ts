import type { Task } from "@/type/task.js";
import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Tasks extends Model<Task, Task> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Tasks.init(
    {
      // 1. 任务ID（id）
      id: {
        type: DataTypes.STRING(200),
        allowNull: false,
        primaryKey: true,
        comment: "任务ID",
      },

      // 2. 所属用户（user_id）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "user_accounts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        comment: "所属用户",
      },

      // 3. 任务标题（title）
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "任务标题",
      },

      // 4. 任务描述（description）
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: "任务描述",
      },

      // 5. 任务分类ID（category_id）
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "task_categories",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        comment: "任务分类ID",
      },

      // 6. 父任务ID（parent_task_id）- 自关联
      parent_task_id: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null,
        references: {
          model: "tasks",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        comment: "父任务ID（完成任务 A 才能进行任务 B）",
      },

      // 7. 是否为AI生成（is_ai_generated）
      is_ai_generated: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
        comment: "是否为AI生成",
      },

      // 8. 是否重复任务（is_recurring）
      is_recurring: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
        comment: "是否重复任务",
      },

      // 9. 重复规则（recurring_rule）
      recurring_rule: {
        type: DataTypes.ENUM("DAILY", "WEEKLY", "MONTHLY"),
        allowNull: true,
        defaultValue: null,
        comment: "重复规则",
      },

      // 重复任务已完成次数
      recurring_completed_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "重复任务已完成次数",
      },

      // 10. 任务状态（status）
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "OVERDUE", "ABANDONED"),
        allowNull: false,
        defaultValue: "PENDING",
        comment: "任务状态",
      },

      // 11. 任务难度（difficulty）
      difficulty: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        validate: {
          // 可选：添加自定义验证，限制 1-5
          min: 1,
          max: 5,
        },
        comment: "任务难度1-5",
      },

      // 12. 基础经验值（final_exp）
      final_exp: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "基础经验值",
      },

      // 13. 基础金币值（final_gold）
      final_gold: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "基础金币值",
      },

      // 14. 预估属性增益（estimated_attr_gains）
      estimated_attr_gains: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        comment: '预估属性增益（如{"mind":5,"body":2}）',
      },

      // 15. 标签1（tag_id_1）
      tag_id_1: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "task_tags",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        comment: "标签1",
      },

      // 16. 标签2（tag_id_2）
      tag_id_2: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "task_tags",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        comment: "标签2",
      },

      // 17. 预计完成时间（due_time）
      due_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "预计完成时间（可选）",
        //必须在现在之后
        validate: {
          isAfterNow: function (value: Date) {
            if (value && new Date(value) < new Date())
              throw new Error("Due time must be after now");
          },
        },
      },

      // 18. 实际完成时间（completed_at）
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: "实际完成时间",
      },

      // 19. 关联的AI工单ID（ai_job_id）
      ai_job_id: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
        references: {
          model: "ai_work_orders",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        comment: "关联的AI工单ID",
      },

      // 20. 原始AI目标输入（ai_goal_input）
      ai_goal_input: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
        comment: "原始AI目标输入（记录）",
      },
    },
    {
      sequelize,
      tableName: "tasks",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return Tasks;
};
