<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { initRouterGuard } from "./utils/routerGuard";
import { getToken, isTokenValid, whiteList } from "./utils/auth";

const ws = uni.connectSocket({
  url: `ws://localhost:3000/token=${getToken()}`,
  complete: () => {
    console.log("WebSocket连接");
  },
});

onLaunch((options) => {
  initRouterGuard();
  ws.onOpen(() => {
    console.log("WebSocket连接已打开！");
  });

  ws.onMessage((res) => {
    console.log("收到服务器消息：", res);
    uni.showToast({
      title: res.data,
      icon: "none",
      position: "top",
    });
  });
  // App 启动时校验 token
  const path = options?.path || "";
  const purePath = path.split("?")[0];

  // 白名单页面放行，否则校验 token
  if (!whiteList.includes(purePath) && !isTokenValid()) {
    uni.redirectTo({
      url: "/pages/login/login?redirect=" + encodeURIComponent(path),
    });
    toast.success("操作成功");
  }
});
</script>
<style lang="scss">
@import "uview-pro/index.scss";
@import "@/styles/reset.scss";
@import "@/styles/common.scss";
</style>
