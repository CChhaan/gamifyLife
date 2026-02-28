import { RateLimit } from "koa2-ratelimit";

// 配置注册接口的限流
const registerRateLimit = RateLimit.middleware({
  interval: { min: 1 }, // 1分钟
  max: 5, // 最多5次请求
  prefixKey: "register:limit", // 缓存键前缀
  message: "注册请求过于频繁，请稍后再试",
  statusCode: 429, // 429 Too Many Requests
  headers: true, // 启用响应头显示限流信息
});

const loginRateLimit = RateLimit.middleware({
  interval: { min: 1 }, // 1分钟
  max: 10, // 最多10次请求
  prefixKey: "login:limit", // 缓存键前缀
  message: "登录请求过于频繁，请稍后再试",
  statusCode: 429,
  headers: true,
});

const generalRateLimit = RateLimit.middleware({
  interval: { min: 1 }, // 1分钟
  max: 30, // 最多30次请求
  prefixKey: "general:limit", // 缓存键前缀
  message: "操作过于频繁，请稍后再试",
  statusCode: 429,
  headers: true,
});

export { registerRateLimit, loginRateLimit, generalRateLimit };
