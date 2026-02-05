export const nextLevelExp = (currentLevel: number) => {
  // 计算下一级所需经验值
  return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
};

export const taskExp = (
  taskDifficulty: number,
  userLevel: number,
  finishTime: number,
) => {
  if (![1, 2, 3, 4, 5].includes(taskDifficulty)) {
    throw new Error("任务难度必须是1-5之间的整数");
  }
  const hours = Math.max(1, Math.ceil(Number(finishTime) || 1));

  const nextLevelTotalExp = nextLevelExp(userLevel);
  const baseExp = 0.05 * nextLevelTotalExp;
  const difficultyMultiplier = 1 + (taskDifficulty - 1) * 0.25;
  const levelMultiplier = 1 + userLevel * 0.02;
  const timeMultiplier = 1 + Math.log2(hours) * 0.05;
  const total =
    baseExp * difficultyMultiplier * levelMultiplier * timeMultiplier;
  return Math.max(1, Math.ceil(total));
};

export const saveUserData = (userLevel: number, exp: number) => {
  // 用数学公式简单加密保存在设备中
  uni.setStorageSync("uL", userLevel * 10 + 10);
  uni.setStorageSync("uE", userLevel * 10 + 10);
};

export const getUserData = () => {
  // 用数学公式简单解密从设备中读取
  const userLevel = (uni.getStorageSync("uL") - 10) / 10;
  const exp = (uni.getStorageSync("uE") - 10) / 10;
  return { userLevel, exp };
};
