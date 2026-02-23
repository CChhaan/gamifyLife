import { badRequest } from "./response.ts";

export async function routerFnc(ctx: any, fnc: () => Promise<void>) {
  try {
    await fnc();
  } catch (error: any) {
    // 1. 区分不同错误类型，避免所有错误都返回 400
    const statusCode = error.status || 400;
    const errorMsg = error.message || "服务器处理请求时发生错误";

    // 2. 规范响应格式，记录错误日志
    console.error(`[路由处理异常] path: ${ctx.path}, error:`, error);
    ctx.status = statusCode;
    ctx.body = badRequest(errorMsg);
  }
}
