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
}

export interface UserGrowth {
  level: number;
  total_experience: number;
  gold: number;
  mind: number;
  body: number;
  social: number;
  discipline: number;
  last_reset_date: Date;
  user_id: number;
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
