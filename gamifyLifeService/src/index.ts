import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import { configDotenv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import staticMiddleware from "koa-static";
import errorHandler from "./middlewares/errorHandler.ts";
import db, { syncDatabase } from "./shared/db.ts";
import tokenAuth from "./middlewares/tokenAuth.ts";
import items from "./shared/items.ts";
import ws from "koa-websocket";

const app = new Koa({});
// const server = ws(app);

configDotenv();

app.use(errorHandler);
app.use(tokenAuth);
app.use(staticMiddleware(__dirname + "/public"));
app.use(bodyParser());
// 动态加载 routes 目录下的路由模块
async function loadRoutes() {
  const dir = path.join(__dirname, "routes");
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue; // 可根据需要排除文件
    const mod = await import(`./routes/${file}`);
    const router = mod.default;
    if (router && router.routes) {
      app.use(router.routes()).use(router.allowedMethods());
      console.log(`Loaded route: ${file}`);
    }
  }
}

// 动态加载系统道具
async function loadItems() {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("items数组为空，跳过加载道具");
    return;
  }

  try {
    await db.Items.bulkCreate(items, {
      // 关键：以name为唯一键，冲突时更新指定字段
      updateOnDuplicate: [
        "type",
        "description",
        "icon_url",
        "price",
        "status",
        "effect",
        "updated_at",
      ],
      // 强制忽略重复键错误（兜底）
      ignoreDuplicates: true,
    });
    console.log("道具数据加载/更新完成");
  } catch (error: any) {
    console.error("加载道具失败:", error);
  }
}

// 异步启动
(async () => {
  try {
    await loadRoutes();
    await loadItems();
    await syncDatabase();

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
      console.log("加载环境变量", process.env.AI_TOKEN);
    });
  } catch (error) {
    console.error("启动失败:", error);
  }
})();
