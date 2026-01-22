import db from "../shared/db.js";

export default class UserInfoService {
  // 获取用户信息方法
  async getUserInfo(userId) {
    try {
      const userInfo = await db.UserInfo.findOne({
        where: { user_id: userId },
      });
      return userInfo;
    } catch (error) {
      console.error("获取用户信息失败", error);
      throw new Error(error.message || "获取用户信息失败");
    }
  }

  // 修改用户信息方法
  async updateUserInfo(userId, userInfo) {
    try {
      const existingInfo = await db.UserInfo.findOne({
        where: { user_id: userId },
      });

      if (!existingInfo) {
        throw new Error("用户不存在");
      }

      const hasChanges = Object.keys(userInfo).some((key) => {
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
    } catch (error) {
      console.error("更新用户信息失败", error);
      throw new Error(error.message || "更新用户信息失败");
    }
  }
}
