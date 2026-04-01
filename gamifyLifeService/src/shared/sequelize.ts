import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";

configDotenv();

const isProd = process.env.NODE_ENV === "production";

export default new Sequelize({
  dialect: "mysql",
  host: isProd ? process.env.DB_HOST_PROD : process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  username: isProd ? process.env.DB_USER_PROD : process.env.DB_USER,
  password: isProd ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD,
  logging: (msg) => {
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
