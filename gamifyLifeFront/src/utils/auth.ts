// 存储 token
export const setToken = (token: string) => {
  uni.setStorageSync("user_token", token);
};

// 获取 token
export const getToken = () => {
  return uni.getStorageSync("user_token") || null;
};

// 清除 token
export const removeToken = () => {
  uni.removeStorageSync("user_token");
};

// 校验 token 是否有效
export const isTokenValid = () => {
  const token = getToken();
  return !!token;
};

export const whiteList = [
  "/pages/login/login", // 登录页
];
