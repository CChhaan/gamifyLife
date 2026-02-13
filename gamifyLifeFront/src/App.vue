<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { initRouterGuard } from "./utils/routerGuard";
import { isTokenValid, whiteList } from "./utils/auth";

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
