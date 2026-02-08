import jwt from "jsonwebtoken";
import db from "../shared/db.ts";
import { sha256 } from "../shared/security.ts";

export default class UserAuthService {
  static tokenBlacklist = new Set();

  static isTokenBlacklisted(token: any) {
    return this.tokenBlacklist.has(token);
  }

  // 用户注册方法
  async registerUser(account: string, password: string, email: string) {
    const transaction = await db.sequelize.transaction();
    try {
      const newUser = await db.UserAccounts.create(
        {
          account,
          password_hash: password,
          email,
          UserGrowth: {}, // UserGrowth 仅需 user_id，其他字段用默认值即可
          TaskCategories: {
            name: "默认分类",
            color: "#CCCCCC", // 补充默认值（模型已配置的话可省略）
            display_order: 0,
          },
          TaskTags: {
            name: "默认标签",
            primary_attr: "mind",
            secondary_attr: "body",
          },
        },
        {
          include: [db.UserInfo, db.UserGrowth, db.TaskCategories, db.TaskTags],
          transaction,
        },
      );
      newUser.dataValues.UserInfo = await db.UserInfo.create(
        {
          user_id: newUser.dataValues.id,
          nickname: `用户${newUser.dataValues.id}`,
        },
        { transaction },
      );

      const result = newUser.toJSON();
      await transaction.commit();

      return {
        ...result,
        password_hash: undefined,
      };
    } catch (error: any) {
      await transaction.rollback();
      console.error("注册用户失败：", error);
      throw new Error(error.message || "注册用户失败，请稍后重试");
    }
  }

  // 用户登录方法
  async loginUser(account: string, email: string, password: string) {
    try {
      let user;
      if (account) {
        user = await db.UserAccounts.findOne({
          where: {
            account,
            password_hash: sha256(password),
          },
        });
      } else if (email) {
        user = await db.UserAccounts.findOne({
          where: {
            email,
            password_hash: sha256(password),
          },
        });
      }

      if (!user) {
        throw new Error("用户名或密码错误");
      } else {
        const token = jwt.sign(
          { userId: user.dataValues.id },
          process.env.JWT_SECRET || "my_app_secret",
        );
        await db.UserAccounts.update(
          { last_login: new Date() },
          { where: { id: user.dataValues.id } },
        );
        return token;
      }
    } catch (error: any) {
      console.error("登录失败：", error);
      throw new Error(error.message || "登录失败，请稍后重试");
    }
  }

  // 用户退出登录方法
  async logoutUser(token: any) {
    try {
      UserAuthService.tokenBlacklist.add(token);
      return true;
      // 清除令牌
    } catch (error: any) {
      console.error("退出登录失败", error);
      throw new Error(error.message || "退出登录失败");
    }
  }
}
