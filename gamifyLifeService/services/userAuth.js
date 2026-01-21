import jwt from "jsonwebtoken";
import db from "../shared/db.js";
import { sha256 } from "../shared/security.js";

export default class UserAuthService {
  // 用户注册方法
  registerUser(account, password, email) {
    return db.UserAccounts.create({
      account,
      password_hash: password,
      email,
    });
  }

  // 用户登录方法
  async loginUser(account, password) {
    const user = await db.UserAccounts.findOne({
      where: {
        account,
        password_hash: sha256(password),
      },
    });

    if (!user) {
      throw new Error("用户名或密码错误");
    } else {
      const token = jwt.sign(
        { userId: user.id, account: user.account },
        process.env.JWT_SECRET || "my_app_secret",
      );
      return token;
    }
  }
}
