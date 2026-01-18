
// 成功响应
export function success(data = null, msg = "操作成功") {
  return {
    code: 200,
    msg,
    data,
  };
}

// 错误响应
export function error(code = 500, msg = "系统错误", data = null) {
  return {
    code,
    msg,
    data,
  };
}

// 400 请求参数错误
export function badRequest(msg = "请求参数错误") {
  return error(400, msg);
}

// 401 未授权
export function unauthorized(msg = "未授权") {
  return error(401, msg);
}

// 403 禁止访问
export function forbidden(msg = "禁止访问") {
  return error(403, msg);
}

// 404 资源不存在
export function notFound(msg = "资源不存在") {
  return error(404, msg);
}

// 409 资源已存在
export function conflict(msg = "资源已存在") {
  return error(409, msg);
}
