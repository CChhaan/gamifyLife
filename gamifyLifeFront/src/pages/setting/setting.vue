<template>
  <view>
    <button @click="logout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { removeToken } from '@/utils/auth';

const logout = () => {
  removeToken()
  uni.reLaunch({
    url: '/pages/login/login'
  });
}
</script>

<style scoped lang="scss"></style>