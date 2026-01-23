export const nextLevelExp = (currentLevel) => {
  // 计算下一级所需经验值的示例公式
  return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
};
