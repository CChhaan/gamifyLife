import { isTokenValid, whiteList } from './auth.js';

// 初始化路由守卫
export const initRouterGuard = () => {
  // 拦截所有页面跳转行为（navigateTo/redirectTo/switchTab/reLaunch/navigateBack）
  uni.addInterceptor('navigateTo', {
    invoke(options) {
      handleRouteInterceptor(options.url);
    },
    fail(err) {
      console.error('跳转失败', err);
    }
  });

  // 拦截 switchTab（小程序/APP 底部 tab 跳转）
  uni.addInterceptor('switchTab', {
    invoke(options) {
      handleRouteInterceptor(options.url);
    }
  });

  // 拦截 redirectTo（重定向）
  uni.addInterceptor('redirectTo', {
    invoke(options) {
      handleRouteInterceptor(options.url);
    }
  });

  // 拦截 reLaunch（重启页面）
  uni.addInterceptor('reLaunch', {
    invoke(options) {
      handleRouteInterceptor(options.url);
    }
  });
};

// 路由拦截核心逻辑
const handleRouteInterceptor = (url: string) => {
  // 1. 提取纯路径（去掉参数，如 /pages/home/home?name=test → /pages/home/home）
  const purePath = url.split('?')[0];
  
  // 2. 白名单页面直接放行
  if (whiteList.includes(purePath)) {
    return;
  }

  // 3. 校验 token，无则跳登录页
  if (!isTokenValid()) {
    // 避免重复跳转登录页（防止死循环）
    if (!purePath.includes('/pages/login/login')) {
      uni.redirectTo({
        url: '/pages/login/login?redirect=' + encodeURIComponent(url) // 携带跳转前的路径，登录后返回
      });
      // 小程序/APP 中 switchTab 不能用 redirectTo，需特殊处理
      uni.$off('switchTab'); // 防止重复监听
      uni.$on('switchTab', () => {
        uni.switchTab({ url: '/pages/login/login' });
      });
    }
  }
};