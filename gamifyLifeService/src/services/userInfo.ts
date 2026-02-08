import { UserInfo } from "@/type/user.ts";
import db from "../shared/db.ts";

export default class UserInfoService {
  // 获取用户信息方法
  async getUserInfo(userId: number) {
    try {
      const userInfo = await db.UserInfo.findOne({
        where: { user_id: userId },
      });
      return userInfo;
    } catch (error: any) {
      console.error("获取用户信息失败", error);
      throw new Error(error.message || "获取用户信息失败");
    }
  }

  // 修改用户信息方法
  async updateUserInfo(userId: number, userInfo: UserInfo) {
    try {
      const existingInfo = (await db.UserInfo.findOne({
        where: { user_id: userId },
      }))?.dataValues;

      if (!existingInfo) {
        throw new Error("用户不存在");
      }

      const hasChanges = (Object.keys(userInfo) as (keyof UserInfo)[]).some((key) => {
        return existingInfo[key] !== userInfo[key];
      });

      if (hasChanges) {
        await db.UserInfo.update(userInfo, {
          where: { user_id: userId },
        });
        return await db.UserInfo.findOne({
          where: { user_id: userId },
        });
      }

      return "用户信息无变化";
    } catch (error: any) {
      console.error("更新用户信息失败", error);
      throw new Error(error.message || "更新用户信息失败");
    }
  }
}
