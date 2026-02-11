<template>
  <view class="inventory-ctn">
    <view class="tabbar">
      <view
        class="tab"
        :class="{ selected: selected == 'userItem' }"
        @click="selected = 'userItem'"
        >个人背包</view
      >
      <view
        class="tab"
        :class="{ selected: selected == 'sysShop' }"
        @click="selected = 'sysShop'"
        >道具商城</view
      >
    </view>
    <sys-shop-cmp v-if="selected == 'sysShop'"></sys-shop-cmp>
    <user-item-cmp v-if="selected == 'userItem'"></user-item-cmp>
    <view class="go-back" @click="goBack">
      <button>
        <u-icon name="arrow-leftward"></u-icon>
        <span style="margin-left: 5rpx">返回首页</span>
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
  uni.switchTab({ url: "/pages/personal/personal" });
};
</script>

<style scoped lang="scss">
.inventory-ctn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  overflow: auto;
  background-color: var(--background-second-color);
}

.tabbar {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100rpx;
  background-color: var(--background-color);
  border-bottom: 2rpx solid var(--border-color);
  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    font-size: 36rpx;
    font-weight: bold;
    color: var(--text-color);
  }
  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }
}

.go-back {
  position: fixed;
  bottom: 160rpx;
  left: 15rpx;
  z-index: 20;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    border-radius: 20rpx;
    background-color: var(--primary-color);
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}
</style>
