import { Sequelize } from "sequelize";

export default new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  database: "gamifylife",
  username: "root",
  password: "123456",
  logging: (msg) => {
    // 只记录错误日志，忽略其他日志
    if (
      !msg.includes("ALTER TABLE") &&
      !msg.includes("SELECT") &&
      !msg.includes("SHOW") &&
      !msg.includes("DESCRIBE")
    ) {
      console.error(msg);
    }
  },
});
