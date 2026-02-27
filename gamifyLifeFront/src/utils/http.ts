import { getToken, removeToken } from "./auth";

interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
const methods = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "head",
  "options",
] as const;
type Method = (typeof methods)[number];
type MethodFn = <T = any>(
  url: string,
  data?: any,
  options?: Omit<UniApp.RequestOptions, "url" | "method" | "data">,
) => Promise<T>;
const isProd = process.env.NODE_ENV === "production";
const http = <T = any>(options: UniApp.RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const requestOptions: UniApp.RequestOptions = {
      ...options,
      //#ifdef H5
      url: (() => {
        // #ifdef H5
        if (isProd) {
          // 生产环境（部署到服务器）：不加 /api（Nginx 已配置反向代理）
          return options.url;
        } else {
          // 开发环境（本地）：加 /api（走Vite代理）
          return "/api" + options.url;
        }
        // #endif
        // #ifndef H5
        // 非H5端（小程序/APP）：直接用原URL
        return options.url;
        // #endif
      })(),
      // #endif
      header: {
        "content-type": "application/json",
        Authorization: "Bearer " + getToken() || "",
        ...options.header,
      },
    };
    // #ifndef H5
    requestOptions.url = options.url;
    // #endif
    uni.request({
      ...requestOptions,
      success(res) {
        const response = res.data as ApiResponse<T>;
        if (response.code == 200) {
          resolve(response.data);
        } else if (response.code == 401) {
          uni.showToast({ icon: "none", title: "登录过期，请重新登录" });
          removeToken();
          uni.navigateTo({
            url: "/pages/login/login",
          });
        } else {
          uni.showToast({ icon: "none", title: response.msg || "请求错误" });
          reject(response);
        }
      },
      fail(err) {
        uni.showToast({ icon: "none", title: "网络错误，换个网络试试" });
        reject(err);
      },
    });
  });
};

// 为每个HTTP方法动态创建对应的请求函数
methods.forEach((m) => {
  (http as any)[m] = <T = any>(
    url: string,
    data?: any,
    options?: UniApp.RequestOptions,
  ) => {
    return http<T>({
      url,
      method: m.toUpperCase() as any,
      data,
      ...options,
    });
  };
});

export default http as typeof http & Record<Method, MethodFn>;
