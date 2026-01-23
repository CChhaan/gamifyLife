<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { initRouterGuard } from "./utils/routerGuard";
import { isTokenValid, whiteList } from "./utils/auth";
onLaunch((options) => {
  console.log("App Launch");
  initRouterGuard();

  // App 启动时校验 token
  const path = options.path || ""; // 启动时要打开的页面路径
  const purePath = path.split("?")[0];

  // 白名单页面放行，否则校验 token
  if (!whiteList.includes(purePath) && !isTokenValid()) {
    uni.redirectTo({
      url: "/pages/login/login?redirect=" + encodeURIComponent(path),
    });
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-pro/index.scss";

:root {
  --primary-color: #fe7a24; // Primary color
  --secondary-color: #ffb686; // Secondary color
  --third-color: #ff9b5b; // Third color

  --text-color: #333; // Default text color
  --contrast-color: #5789d3; // Secondary text color
  // --background-color: #fff; // Background color
  --background-color: #f8f7e666; // Background color
  --placeholder-color: #aaa; // Placeholder text color
}
</style>
