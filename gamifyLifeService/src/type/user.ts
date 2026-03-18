export enum UserGender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export interface UserInfo {
  user_id?: number; // 关联 user_accounts.id，非空、无默认值
  nickname: string; // 昵称，非空
  gender?: UserGender; // 性别，默认 0（未知）
  birthday?: Date | null; // 生日，可为空
  bio?: string | null; // 个性签名，可为空
  avatar_url?: string | null; // 头像链接，可为空
  createdAt?: Date; // 创建时间，默认当前时间戳
  updatedAt?: Date; // 更新时间，默认当前时间戳，更新时自动刷新
  today_use_ai_count?: number; // 今日AI功能使用次数，默认0，每日0点重置
  total_difficulty?: number; // 完成困难任务总数，默认0
  total_task_count?: number; // 完成任务总数，默认0
  total_ai_task_count?: number; // 完成AI生成任务总数，默认0
}

export interface UserGrowth {
  level?: number;
  total_experience: number;
  gold: number;
  mind: number;
  body: number;
  social: number;
  discipline: number;
  consume: number;
  user_id?: number;
  nextLevelExp?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface UserAccount {
  id: number;
  account: string;
  password_hash: string;
  email: string;
  role: string;
  status: string;
  last_login_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDailyLog {
  user_id: number;
  date?: Date;
  ai_use_count?: number;
  createdAt?: Date;
  updatedAt?: Date;
  today_task_completion_count?: number; // 今日任务完成总数，可选
  today_high_value_task_count?: number;
}

export interface UserAccLog {
  /** 用户ID（主键） */
  user_id: number;

  // ==================== 经验累计 ====================
  /** 本周累计经验 */
  weekly_experience?: number;
  /** 本月累计经验 */
  monthly_experience?: number;
  /** 本年累计经验 */
  yearly_experience?: number;

  // ==================== 金币累计 ====================
  /** 本周累计金币 */
  weekly_gold?: number;
  /** 本月累计金币 */
  monthly_gold?: number;
  /** 本年累计金币 */
  yearly_gold?: number;

  // ==================== 每周属性累计 ====================
  /** 本周累计mind属性 */
  weekly_mind?: number;
  /** 本周累计body属性 */
  weekly_body?: number;
  /** 本周累计social属性 */
  weekly_social?: number;
  /** 本周累计discipline属性 */
  weekly_discipline?: number;

  // ==================== 每月属性累计 ====================
  /** 本月累计mind属性 */
  monthly_mind?: number;
  /** 本月累计body属性 */
  monthly_body?: number;
  /** 本月累计social属性 */
  monthly_social?: number;
  /** 本月累计discipline属性 */
  monthly_discipline?: number;

  // ==================== 每年属性累计 ====================
  /** 本年累计mind属性 */
  yearly_mind?: number;
  /** 本年累计body属性 */
  yearly_body?: number;
  /** 本年累计social属性 */
  yearly_social?: number;
  /** 本年累计discipline属性 */
  yearly_discipline?: number;
}
