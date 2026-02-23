export const nextLevelExp = (currentLevel: number) => {
  // 计算下一级所需经验值
  return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
};

// 根据任务难度(1-5)、用户等级、任务完成的时间计算任务可获得经验
export const taskExp = (
  taskDifficulty = 0,
  userLevel: number,
  finishTime: number
) => {
  const hours = Math.max(1, Math.ceil(Number(finishTime) || 1));
  const nextLevelTotalExp = nextLevelExp(userLevel);
  const baseExp = 0.05 * nextLevelTotalExp;
  const difficultyMultiplier = 1 + (taskDifficulty - 1) * 0.2;
  const levelMultiplier = 1 + userLevel * 0.02;
  const timeMultiplier = 1 + Math.log2(hours) * 0.1;
  const total =
    baseExp * difficultyMultiplier * levelMultiplier * timeMultiplier;
  return Math.max(1, Math.ceil(total));
};

// 根据任务难度、用户等级、任务标签计算任务可获得金币
export const taskGold = (taskDifficulty = 0, finishTime: number) => {
  const hours = Math.max(1, Math.ceil(Number(finishTime) || 1));
  const difficultyMultiplier = 1 + (taskDifficulty - 1) * 0.3;
  const timeMultiplier = 1 + hours * 0.05;
  const total = 10 * difficultyMultiplier * timeMultiplier;
  return Math.max(1, Math.ceil(total));
};

// 根据任务难度、用户等级、任务标签计算任务可获得属性点
export const taskAttr = (userLevel: number, taskDifficulty = 0) => {
  const levelMultiplier = 1 + userLevel * 0.02;
  const difficultyMultiplier = 1 + (taskDifficulty - 1) * 0.2;
  const total = 10 * levelMultiplier * difficultyMultiplier;
  return Math.max(1, Math.ceil(total));
};
