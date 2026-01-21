import { getToken } from "./auth";

interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

const http = <T = any>(options: UniApp.RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const requestOptions: UniApp.RequestOptions = {
      ...options,
      header: {
        "content-type": "application/json",
        Authorization: "Bearer " + getToken() || "",
        ...options.header,
      },
    };

    uni.request({
      ...requestOptions,
      success(res) {
        const response = res.data as ApiResponse<T>;
        if (response.code == 200) {
          resolve(response.data);
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

export default http;
