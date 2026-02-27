import schedule from "node-schedule";
import UserDailyLogService from "../services/userDailyLog.js";
import PetService from "../services/pet.js";
import chalk from "chalk";
import TaskService from "@/services/task.js";

const userDailyLogService = new UserDailyLogService();
const taskService = new TaskService();
const petService = new PetService();
// 设置每天凌晨2点执行的定时任务
const dailyRefreshJob = schedule.scheduleJob("0 2 * * *", async () => {
  console.log(chalk.blue(`[${new Date()}] 执行每日日志刷新任务`));
  try {
    await userDailyLogService.dailyRefresh();
    await taskService.updateRepeatTask();
  } catch (error) {
    console.error("定时任务执行失败:", error);
  }
});

// 设置每30分钟执行的定时任务，减少宠物饱食度和亲密度
const petStatusDecreaseJob = schedule.scheduleJob("*/30 * * * *", async () => {
  console.log(chalk.blue(`[${new Date()}] 执行宠物状态下降任务`));
  try {
    await petService.decreasePetStatus();
  } catch (error) {
    console.error("宠物状态下降任务执行失败:", error);
  }
});

// 启动时检查并刷新过期日志
export async function initializeScheduler() {
  console.log(chalk.blue(`[${new Date()}] 初始化调度器，检查过期日志`));
  try {
    await userDailyLogService.checkAndRefreshExpiredLogs();
    await taskService.updateRepeatTask();
  } catch (error) {
    console.error("初始化调度器失败:", error);
  }
}

// 导出取消定时任务的函数
export function cancelDailyRefreshJob() {
  if (dailyRefreshJob) {
    dailyRefreshJob.cancel();
    console.log("每日日志刷新定时任务已取消");
  }
  if (petStatusDecreaseJob) {
    petStatusDecreaseJob.cancel();
    console.log("宠物状态下降定时任务已取消");
  }
}
