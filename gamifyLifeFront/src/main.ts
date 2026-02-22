import { createSSRApp } from "vue";
import uViewPro from "uview-pro";
import App from "./App.vue";
import VConsole from 'vconsole';

export function createApp() {
  const app = createSSRApp(App);
  app.use(uViewPro, { locale: "zh-CN" });
  return {
    app,
  };
}
