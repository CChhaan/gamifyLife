<template>
  <view>
    <button @click="logout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { removeToken } from "@/utils/auth";
import http from "@/utils/http";

const logout = async () => {
  try {
    await http.post("/auth/logout");
    removeToken();
    uni.reLaunch({
      url: "/pages/login/login",
    });
  } catch (error) {
    console.error("退出登录失败", error);
  }
};
</script>

<style scoped lang="scss"></style>
