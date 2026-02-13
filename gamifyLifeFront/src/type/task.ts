export interface TaskCategory {
  id: number;
  user_id: number;
  name: string;
  color: string;
  display_order: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export type InfluenceAttr = "mind" | "body" | "social" | "discipline";

export const InfluenceAttrTextMap = {
  mind: "心智",
  body: "体魄",
  social: "社交",
  discipline: "自律",
} as const;

export const TaskStatusTextMap = {
  PENDING: "进行中",
  COMPLETED: "已完成",
  OVERDUE: "已逾期",
  ABANDONED: "已放弃",
} as const;

export interface TaskTag {
  id?: number;
  user_id?: number;
  name?: string;
  primary_attr?: InfluenceAttr | "";
  secondary_attr?: InfluenceAttr | null | "";
}

// 任务接口定义
export interface Task {
  id?: number; // 任务ID，可选
  user_id?: number; // 用户ID，可选
  title: string; // 任务标题，必填
  description?: string; // 任务描述，可选，可为null
  category_id?: number; // 任务分类ID，可选，可为null
  parent_task_id?: number; // 父任务ID，可选，可为null
  is_ai_generated: 0 | 1; // 是否AI生成，0或1
  is_recurring: 0 | 1; // 是否为重复任务，0或1
  recurring_rule?: "DAILY" | "WEEKLY" | "MONTHLY"; // 重复规则，可选，可为null
  status: "PENDING" | "COMPLETED" | "OVERDUE" | "ABANDONED" | "UNUSED"; // 任务状态，必填
  difficulty?: number; // 任务难度，可选，可为null
  final_exp?: number; // 最终获得经验值，必填
  final_gold?: number; // 最终获得金币，必填
  estimated_attr_gains?: {
    // 预计属性增益，可选，可为null
    [key: string]: number;
  };
  tag_id_1?: number; // 标签1 ID，可选，可为null
  tag_id_2?: number; // 标签2 ID，可选，可为null
  due_time?: string; // 截止时间，可选，可为null
  completed_at?: string; // 完成时间，可选，可为null
  ai_job_id?: string; // AI任务ID，可选，可为null
  ai_goal_input?: string; // AI目标输入，可选，可为null
  updatedAt?: Date;
  createdAt?: Date;
}

// 工单状态枚举
export enum TicketStatus {
  PENDING = "待处理",
  PROCESSING = "处理中",
  SUCCESS = "处理成功",
  FAILED = "处理失败",
  CONSUMED = "已使用",
}

// 工单基础类型
export interface Ticket {
  /** 工单ID（UUID v4） */
  id?: string;
  /** 发起用户ID（关联用户表 user_accounts.id） */
  user_id: number;
  /** 用户输入的原始目标 */
  input_goal: string;
  /** 处理状态 */
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CONSUMED";
  /** 失败信息（成功/处理中时为 null） */
  error_message: string | null;
  // 补充 Sequelize 自动生成的字段
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 逻辑删除时间（若启用 paranoid 模式） */
  deletedAt?: string | null;
  AIDraftTasks?: Task[];
}
