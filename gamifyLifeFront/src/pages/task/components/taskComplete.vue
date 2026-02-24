<template>
  <view class="cover">
    <view class="complete-modal modal">
      <view class="main">任务完成！</view>
      <view class="complete-item" v-if="completeInfo.details?.isHighValue"
        >该任务为高价值任务</view
      >
      <view>恭喜获得奖励：</view>
      <view class="rewards flex flex-justify__between">
        <view>经验：+{{ completeInfo.reward?.experience }}</view>
        <view>金币：+{{ completeInfo.reward?.score }}</view>
      </view>
      <view class="rewards flex flex-justify__between">
        <view
          class="flex flex-col"
          v-for="(value, key) in completeInfo.reward?.attributes"
          :key="key"
        >
          <view>{{ InfluenceAttrTextMap[key as InfluenceAttr] }}</view>
          <view>+{{ value }}</view>
        </view>
      </view>
      <view class="rewards" v-if="petInfo">宠物经验：+10 ，亲密度：+5</view>
      <button class="confirm-button" @click="$emit('confirm')">确定</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePet } from "@/composables/usePet";
import {
  type InfluenceAttr,
  InfluenceAttrTextMap,
  type TaskCompletionResult,
} from "@/type/task";
import { onShow } from "@dcloudio/uni-app";
const { petInfo, getPet } = usePet();
defineProps<{
  completeInfo: TaskCompletionResult;
}>();
onShow(async () => {
  await getPet();
});
</script>

<style lang="scss" scoped>
.complete-modal {
  width: 60vw;
  border-radius: 16rpx;
  padding: 20rpx;
  z-index: 10;
}
.main {
  padding: 10rpx;
  text-align: center;
  font-size: var(--fontSize-large);
  font-weight: bold;
  color: #8c6e52;
}
.confirm-button {
  padding: 0 1.2em;
  margin-top: 20rpx;
  background-color: var(--primary-color);
  color: #fff;
  font-size: var(--fontSize-normal);
  line-height: 2;
}

.complete-item {
  padding: 10rpx 0;
}

.rewards {
  padding: 10rpx;
  border-bottom: 3rpx solid #ddd;
}
</style>
