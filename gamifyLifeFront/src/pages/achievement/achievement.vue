<template>
  <view class="achievement flex flex-col"> </view>

  <view class="go-back" @click="goBack">
    <button class="flex flex-justify__center">
      <u-icon name="arrow-leftward"></u-icon>
      <span style="margin-left: 5rpx">返回</span>
    </button>
  </view>
</template>

<script setup lang="ts">
// 获取成就类型列表
import http from "@/utils/http";
import type { AchievementType } from "@/type/achievement";
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

const achievementTypeList = ref<AchievementType[] | null>(null);

onShow(() => {});
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    // 如果没有上一页，可以跳转到首页或其他指定页面
    uni.reLaunch({
      url: "/pages/index/index",
    });
  }
};
</script>

<style scoped lang="scss">
.achievement {
  height: 100vh;
  overflow: auto;
  background-color: var(--bg-color-page);
}

.go-back {
  position: fixed;
  bottom: 160rpx;
  left: 15rpx;
  z-index: 20;
  button {
    height: 80rpx;
    border-radius: 20rpx;
    background-color: var(--primary-color);
    box-shadow: var(--shadow);
    color: #fff;
    font-size: var(--fontSize-large);
    font-weight: bold;
  }
}
</style>
