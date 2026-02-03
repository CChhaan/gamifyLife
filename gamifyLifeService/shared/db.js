import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const db = {
  sequelize,
  Sequelize: sequelize.constructor,
};

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.join(__dirname, "../models");

// 读取models目录下的所有文件
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js"));

// 动态导入并注册模型
for (const file of modelFiles) {
  const modelName = path.basename(file, ".js");
  const capitalizedModelName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  // 动态导入模型初始化函数
  const modelPath = path.join(modelsDir, file);
  const importUrl = `file://${modelPath}`;
  const initModel = (await import(importUrl)).default;

  // 注册模型
  db[capitalizedModelName] = initModel(sequelize, DataTypes);
}

Object.values(db).forEach((model) => {
  if (model && typeof model.associate === "function") {
    model.associate(db);
  }
});

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
