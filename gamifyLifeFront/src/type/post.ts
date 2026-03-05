import type { UserInfo } from "./user";

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

export const PostTypeTextMap = {
  MILESTONE: "里程碑",
  ACHIEVEMENT: "成就",
  TASK: "任务",
  PET: "宠物",
  USER: "用户",
  SYSTEM: "系统",
} as const;

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
  userInfo?: UserInfo;
}
