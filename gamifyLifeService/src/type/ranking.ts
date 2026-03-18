/**
 * 榜单类型枚举（与数据库 ENUM 对应）
 */
export enum RankingType {
  EXP = "EXP",
  ATTR_SINGLE = "ATTR_SINGLE",
  ATTR_ALL = "ATTR_ALL",
  EXP_PET = "EXP_PET",
  GOLD = "GOLD",
}

/**
 * 周期类型枚举（与数据库 ENUM 对应）
 */
export enum CycleType {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEAR = "YEAR",
}

/**
 * 榜单快照表基础类型（与数据库字段一一对应）
 */
export interface IRankingSnapshot {
  /** 快照ID */
  id?: number;
  /** 榜单类型 */
  ranking_type: "EXP" | "ATTR_SINGLE" | "ATTR_ALL" | "EXP_PET" | "GOLD";
  /** 周期类型 */
  cycle_type: "WEEKLY" | "MONTHLY" | "YEAR";
  /** 快照生成时间（Timestamp 类型在TS中映射为 Date） */
  snapshot_time: Date;
}

/**
 * 榜单详情基础类型
 */
export interface IRankingDetail {
  id?: number;
  snapshot_id: number;
  user_id: number;
  rank: number;
  score: number;
  metadata?: Record<string, any> | null;
}
