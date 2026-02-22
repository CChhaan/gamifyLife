<template>
  <view class="inventory flex flex-col">
    <view class="inventory_tabbar flex flex-justify__around w-full">
      <view
        class="tab flex flex-justify__center h-full flex-1"
        :class="{ selected: selected == 'userItem' }"
        @click="selected = 'userItem'"
        >个人背包</view
      >
      <view
        class="tab flex flex-justify__center h-full flex-1"
        :class="{ selected: selected == 'sysShop' }"
        @click="selected = 'sysShop'"
        >道具商城</view
      >
    </view>
    <sys-shop-cmp v-if="selected == 'sysShop'"></sys-shop-cmp>
    <user-item-cmp v-if="selected == 'userItem'"></user-item-cmp>
    <view class="go-back" @click="goBack">
      <button class="flex flex-justify__center">
        <u-icon name="arrow-leftward"></u-icon>
        <span style="margin-left: 5rpx">返回</span>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import UserItemCmp from "./components/userItems.vue";
import SysShopCmp from "./components/sysShop.vue";
import { ref } from "vue";

const selected = ref("userItem");
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
.inventory {
  height: 100vh;
  overflow: auto;
  background-color: var(--bg-color-page);

  &_tabbar {
    height: 100rpx;
    background-color: var(--bg-second-color);
    border-bottom: 2rpx solid #ddd;
    .tab {
      font-size: var(--fontSize-big);
      font-weight: bold;
    }
    .selected {
      background-color: var(--primary-color);
      color: #fff;
    }
  }
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
