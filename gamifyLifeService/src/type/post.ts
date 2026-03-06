/**
 * 动态元数据类型（JSON字段的结构，可根据实际业务扩展）
 */
export interface PostMetadata {
  // 示例字段，根据你的业务实际需求调整
  originalData?: Record<string, any>; // 原始数据
  extraInfo?: Record<string, any>; // 额外信息
}

export type PostType =
  | "MILESTONE"
  | "ACHIEVEMENT"
  | "TASK"
  | "PET"
  | "USER"
  | "SYSTEM";

/**
 * 动态表基础类型（数据库字段映射）
 */
export interface Post {
  /** 动态ID */
  id?: number;
  /** 关联用户ID（主角） */
  user_id: number;
  /** 动态类型 */
  post_type?: PostType;
  /** 关联目标ID（可选） */
  target_id?: number;
  /** 系统生成标题 */
  title: string;
  /** 系统生成内容 */
  content?: string;
  /** 点赞数 */
  like_count?: number;
  /** 点踩数 */
  dislike_count?: number;
  /** 浏览数 */
  view_count?: number;
  /** 动态状态 */
  status?: "DRAFT" | "PUBLISHED" | "HIDDEN";
  /** 逻辑删除标志 */
  deletedAt?: Date;
  /** 用户确认发布时间（可选） */
  published_at?: Date;
  /** 创建时间 */
  createdAt?: Date;
  /** 更新时间 */
  updatedAt?: Date;
}

/**
 * 互动类型枚举（与数据库 ENUM 对应）
 */
export enum InteractionType {
  LIKE = "点赞", // 点赞
  DISLIKE = "点踩", // 点踩
  VIEW = "浏览", // 浏览
}

/**
 * 互动表基础类型（与数据库字段一一对应）
 */
export interface Interaction {
  /** 记录ID */
  id?: bigint;
  /** 互动用户ID */
  user_id: number;
  /** 动态ID */
  post_id: number;
  /** 互动类型 */
  interaction_type: "LIKE" | "DISLIKE" | "VIEW";
  /** 是否有效（1：有效，0：取消） */
  is_active: 0 | 1;
  /** 首次互动时间 */
  createdAt?: Date;
  /** 最后更新时间 */
  updatedAt?: Date;
}

/**
 * 创建互动记录的参数类型（无需传 id/created_at/updated_at，由数据库自动生成）
 */
export interface CreateInteractionDto {
  user_id: number;
  post_id: number;
  interaction_type: InteractionType;
  /** 可选，默认值 1 */
  is_active?: 0 | 1;
}
