export enum PetStage {
  INFANT = "INFANT", // 幼年期
  YOUTH = "YOUTH", // 青年期
  ADULT = "ADULT", // 成年期
  PERFECT = "PERFECT", // 完美期
}

// 2. 宠物状态枚举
export enum PetStatus {
  NORMAL = "NORMAL", // 正常
  HUNGRY = "HUNGRY", // 饥饿
  SICK = "SICK", // 生病
  SLEEPING = "SLEEPING", // 睡眠中
}

// 3. 宠物模型类型（对应数据库字段）
export interface Pet {
  id?: number; // 宠物ID
  user_id: number; // 所属用户ID
  nickname?: string; // 宠物昵称
  stage?: "INFANT" | "YOUTH" | "ADULT" | "PERFECT"; // 成长阶段
  level?: number; // 宠物等级
  exp?: number; // 经验值
  evolution_count?: number; // 已进化次数
  hunger?: number; // 饥饿值(0-100)
  affection?: number; // 好感度(0-100)
  status?: "NORMAL" | "HUNGRY" | "SICK" | "SLEEPING"; // 当前状态
  last_interaction_at?: Date | null; // 上次互动时间
  last_evolution_at?: Date | null; // 上次进化时间
  last_weekly_snapshot_level?: number; // 上周等级快照
  last_weekly_snapshot_affection?: number; // 上周好感度快照
  last_hunger_update_at?: Date; // 上次饥饿值更新时间
  created_at?: Date; // 创建时间
  updated_at?: Date; // 更新时间
}
