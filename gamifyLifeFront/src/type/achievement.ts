/**
 * 成就大类枚举（对应数据库 ENUM 类型）
 */
export const AchievementType = {
  TASK: "任务成就", // 任务类成就
  GROWTH: "成长成就", // 成长类成就
  PET: "宠物成就", // 宠物相关成就
  SOCIAL: "社交成就", // 社交类成就
  GOLD: "金币成就", // 金币类成就
  DIY: "自定义成就", // 自定义成就
} as const;

/**
 * 混合条件逻辑枚举（对应数据库 ENUM 类型）
 */
export enum ConditionLogic {
  AND = "AND", // 所有条件都满足（默认）
  OR = "OR", // 满足任一条件即可
}

/**
 * 成就条件项类型（conditions JSON 数组的子项）
 * 可根据你的业务扩展具体的条件类型
 */
export interface AchievementCondition {
  // 条件类型（如：完成任务、达到分数、累计登录等）
  type: string;
  // 成就对应的目标ID
  target_id?: number;
  // 数量/次数（如：完成5次、登录7天）
  count?: number;
  // 其他自定义字段
  [key: string]: any;
}

/**
 * 成就奖励项类型（rewards JSON 数组的子项）
 * 可根据你的业务扩展具体的奖励类型
 */
export interface AchievementReward {
  // 奖励类型（如：金币、徽章、经验、道具等）
  type: string;
  // 奖励属性名称
  attribute_name?: InfluenceAttr;
  // 奖励数量（如：100金币、50经验）
  amount?: number;
  // 徽章ID/道具ID（仅徽章/道具类型有效）
  id?: number;
  // 其他自定义字段
  [key: string]: any;
}

/**
 * 成就主类型（对应数据库表结构）
 */
export interface Achievement {
  // 成就ID（主键、自增）
  id: number;
  // 成就标题
  title: string;
  // 成就描述
  description: string;
  // 图标URL（可选）
  icon_url?: string | null;
  // 成就大类（默认 MISC）
  type: "TASK" | "GROWTH" | "PET" | "SOCIAL" | "GOLD" | "DIY";
  // 混合条件逻辑（默认 AND）
  condition_logic?: "AND" | "OR";
  // 条件数组（JSON类型）
  conditions: AchievementCondition[];
  // 奖励数组（JSON类型）
  rewards: AchievementReward[];
  // 是否隐藏：0-不隐藏（默认），1-隐藏
  is_hidden: 0 | 1;
  // 是否启用：1-启用（默认），0-禁用
  is_active: 0 | 1;
  // 创建时间（ISO格式字符串）
  createdAt?: string;
  // 更新时间（ISO格式字符串）
  updatedAt?: string;
  /** 用户成就关联表 */
  userAchievements?: UserAchievementAttributes[];
}

/**
 * 用户成就关联表基础类型定义
 */
export interface UserAchievementAttributes {
  /** 记录ID */
  id?: number;
  /** 用户ID */
  user_id: number;
  /** 成就ID */
  achievement_id: number;
  /** 是否已经领取了奖励 (0:未领取, 1:已领取) */
  gift_got: 0 | 1;
  /** 是否已解锁 (0:未解锁, 1:已解锁) */
  is_unlocked: 0 | 1;
  /** 解锁时间 (未解锁时为null) */
  unlocked_at: Date | null;
  /** 创建时间 */
  createdAt?: Date;
  /** 更新时间 */
  updatedAt?: Date;
}
