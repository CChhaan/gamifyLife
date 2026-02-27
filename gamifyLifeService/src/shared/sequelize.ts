import { Sequelize } from "sequelize";

const isProd = process.env.NODE_ENV === "production";

export default new Sequelize({
  dialect: "mysql",
  host: isProd ? "127.0.0.1" : "localhost",
  port: 3306,
  database: "gamifylife",
  username: isProd ? "gamifyLife" : "root",
  password: isProd ? "aRReA64547LkZHxM" : "123456",
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
