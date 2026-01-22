export enum UserGender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export interface UserInfo {
  user_id?: number; // 关联 user_accounts.id，非空、无默认值
  nickname: string; // 昵称，非空
  gender: UserGender; // 性别，默认 0（未知）
  birthday?: Date | null; // 生日，可为空
  bio?: string | null; // 个性签名，可为空
  avatar_url?: string | null; // 头像链接，可为空
  createdAt?: Date; // 创建时间，默认当前时间戳
  updatedAt?: Date; // 更新时间，默认当前时间戳，更新时自动刷新
}
