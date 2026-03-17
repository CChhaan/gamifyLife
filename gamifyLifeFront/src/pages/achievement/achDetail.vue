<template>
  <view class="cover"></view>
  <view class="ach-detail modal flex flex-col">
    <view class="title item">{{ item.title }}</view>
    <view class="desc item">{{ item.description }}</view>
    <view class="item">可获得奖励：</view>
    <view class="reward w-full">
      <view class="reward-item flex" v-for="reward in item.rewards">
        <view class="name" v-if="reward.type == 'attr'">
          {{ rewardName(reward.attribute_name) }}：
        </view>
        <view class="name" v-else>{{ rewardName(reward.type) }}：</view>
        <view class="count">{{ reward.amount }}</view>
      </view>
    </view>
    <view
      class="confirm-btn flex flex-justify__center w-full"
      @click="$emit('close')"
      >确定</view
    >
  </view>
</template>

<script setup lang="ts">
import type { Achievement } from "@/type/achievement";

defineProps<{
  item: Achievement;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const rewardName = (key: string) => {
  switch (key) {
    case "exp":
      return "经验值";
    case "coin":
      return "金币";
    case "pet_level":
      return "宠物经验值";
    case "social":
      return "社交";
    case "mind":
      return "心智";
    case "body":
      return "体魄";
    case "discipline":
      return "自律";
    default:
      return "";
  }
};
</script>

<style scoped lang="scss">
.ach-detail {
  width: 50vw;
  padding: 20rpx 30rpx;
  border-radius: 10rpx;
  z-index: 10;
  align-items: start;

  .title {
    font-size: var(--fontSize-big);
    font-weight: bold;
  }

  .confirm-btn {
    color: #fff;
    background-color: var(--primary-color);
    font-size: var(--fontSize-big);
    margin-top: 20rpx;
    padding: 10rpx 0;
    border-radius: 10rpx;
  }

  .item {
    margin-bottom: 10rpx;
  }

  .reward-item {
    margin-left: 20rpx;
  }
}
</style>
