import { Model } from "sequelize";
import { sha256 } from "../shared/security.js";

export default (sequelize, DataTypes) => {
  class UserAccounts extends Model {
    static init() {
      super.init(
        {
          // 1. id：用户唯一ID（自增、无符号、主键）
          id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: "用户唯一ID",
          },
          // 2. account：登录用户名（唯一、非空、长度10）
          account: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: {
              name: "user_accounts_unique_account",
              msg: "登录用户名已存在",
            },
            comment: "登录用户名",
          },
          // 3. password_hash：加密后的密码（非空、长度255）
          password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "加密后的密码",
          },
          // 4. email：绑定邮箱（唯一、非空、长度100）
          email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
              name: "user_accounts_unique_email",
              msg: "绑定邮箱已存在",
            },
            comment: "绑定邮箱",
            validate: {
              isEmail: {
                msg: "邮箱格式不正确",
              },
            },
          },
          // 5. role：权限角色（枚举、非空、默认USER）
          role: {
            type: DataTypes.ENUM("USER", "ADMIN"),
            allowNull: false,
            defaultValue: "USER",
            comment: "权限角色",
          },
          // 6. status：账户状态（枚举、非空、默认ACTIVE）
          status: {
            type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "DELETED"),
            allowNull: false,
            defaultValue: "ACTIVE",
            comment: "账户状态",
          },
          // 7. last_login_at：最后登录时间（时间戳、可空、默认NULL）
          last_login_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            comment: "最后登录时间",
          },
        },
        {
          // 模型全局配置（关键！）
          sequelize,
          tableName: "user_accounts",
          indexes: [
            {
              name: "user_accounts_unique_account",
              unique: true,
              fields: ["account"],
            },
            {
              name: "user_accounts_unique_email",
              unique: true,
              fields: ["email"],
            },
          ],
          charset: "utf8mb4",
          collate: "utf8mb4_0900_ai_ci",
        },
      );
    }
  }
  UserAccounts.init();
  UserAccounts.beforeSave((user) => {
    if (user.changed("password_hash") && user.password_hash.length > 0) {
      user.password_hash = sha256(user.password_hash);
    }
  });
  return UserAccounts;
};
