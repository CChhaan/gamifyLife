<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { initRouterGuard } from "./utils/routerGuard";
import { isTokenValid, whiteList } from "./utils/auth";

const ws = uni.connectSocket({
  url: `ws://localhost:3000`,
  complete: () => {
    console.log("WebSocket连接");
  },
});

ws.onOpen(() => {
  console.log("WebSocket连接已打开！");
});

onLaunch((options) => {
  initRouterGuard();

  // App 启动时校验 token
  const path = options?.path || "";
  const purePath = path.split("?")[0];

  // 白名单页面放行，否则校验 token
  if (!whiteList.includes(purePath) && !isTokenValid()) {
    uni.redirectTo({
      url: "/pages/login/login?redirect=" + encodeURIComponent(path),
    });
  }
});
</script>
<style lang="scss">
@import "uview-pro/index.scss";
@import "@/styles/reset.scss";
@import "@/styles/common.scss";
</style>
