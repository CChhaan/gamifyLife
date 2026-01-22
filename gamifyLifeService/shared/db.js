import sequelize from "./sequelize.js";
import initUserAccounts from "../models/userAccounts.js";
import initUserInfo from "../models/userInfo.js";
import { DataTypes } from "sequelize";

// 初始化所有模型
const db = {
  sequelize,
  Sequelize: sequelize.constructor,
};

// 注册模型
db.UserAccounts = initUserAccounts(sequelize, DataTypes);
db.UserInfo = initUserInfo(sequelize, DataTypes);

// 同步数据库
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("数据库同步成功");
  } catch (error) {
    console.error("数据库同步失败:", error);
    throw error;
  }
};

export default db;
