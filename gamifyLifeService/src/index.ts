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
import errorHandler from "./middlewares/errorHandler.js";
import db, { syncDatabase } from "./shared/db.js";
import tokenAuth from "./middlewares/tokenAuth.js";
import items from "./shared/items.js";
import ws from "koa-websocket";
import {
  initializeScheduler,
  cancelDailyRefreshJob,
} from "./shared/scheduler.js";
import Application from "koa";

const app = new Koa({});
// const server = ws(app);

configDotenv();

app.use(errorHandler);
app.use(tokenAuth);
app.use(staticMiddleware(__dirname + "/public"));
app.use(bodyParser());
// 动态加载 routes 目录下的路由模块
async function loadRoutes() {
  const routesDir = path.join(__dirname, "routes");

  // 1. 读取目录并过滤有效文件：兼容 .ts/.js，排除 index 文件和非路由文件
  const files = fs.readdirSync(routesDir).filter((file) => {
    const ext = path.extname(file);
    // 只处理 .ts/.js 文件，排除 index.ts/index.js 和 .d.ts 类型文件
    return (
      [".ts", ".js"].includes(ext) &&
      !file.startsWith("index.") &&
      !file.includes(".d.")
    );
  });

  // 2. 遍历加载路由
  for (const file of files) {
    try {
      // 修复：使用 URL 构造器拼接路径，兼容跨平台/特殊字符
      const filePath = path.join(routesDir, file);
      const importUrl = new URL(`file://${filePath}`).href;

      // 动态导入路由模块
      const mod = await import(importUrl);
      const router = mod.default;

      // 验证路由有效性（适配 Koa-router 特性）
      if (
        router &&
        typeof router.routes === "function" &&
        typeof router.allowedMethods === "function"
      ) {
        app.use(router.routes()).use(router.allowedMethods());
        console.log(`✅ 成功加载路由: ${file}`);
      } else {
        console.warn(
          `⚠️ 路由文件 ${file} 导出格式错误，未找到合法的 router 实例`,
        );
      }
    } catch (error) {
      console.error(`❌ 加载路由 ${file} 失败:`, (error as Error).message);
      // 出错不中断整体流程，继续加载其他路由
      continue;
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
    await syncDatabase();
    await loadItems();
    // 在应用启动时初始化调度器
    initializeScheduler();

    // 在应用关闭时取消定时任务
    process.on("SIGTERM", () => {
      cancelDailyRefreshJob();
      process.exit(0);
    });

    process.on("SIGINT", () => {
      cancelDailyRefreshJob();
      process.exit(0);
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
      console.log("加载环境变量", process.env.AI_TOKEN);
    });
  } catch (error) {
    console.error("启动失败:", error);
  }
})();
