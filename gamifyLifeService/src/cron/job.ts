import chalk from "chalk";
import { syncDatabase } from "../shared/db.js";
import { initializeScheduler } from "../shared/scheduler.js";

async function main() {
  console.log(chalk.blue(`[${new Date()}] 定时任务进程启动`));
  try {
    await syncDatabase();
    await initializeScheduler();
    console.log(chalk.green.bold("定时任务进程初始化完成"));
  } catch (error) {
    console.error(chalk.red("定时任务进程初始化失败:"), error);
    process.exit(1);
  }
}

main();