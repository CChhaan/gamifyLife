<template>
  <view class="exp-line w-full">
    <view class="now h-full" :style="{ width: expWidth + '%' }"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  totalExperience: {
    type: Number,
    default: 0,
  },
  nextLevelExp: {
    type: Number,
    default: 0,
  },
});

const expWidth = computed(() =>
  Math.min((props.totalExperience / props.nextLevelExp) * 100, 100),
);
</script>

<style scoped lang="scss">
.exp-line {
  background-color: #e2ecf8;
  height: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 5rpx 2rpx #ccc;

  .now {
    background-color: var(--primary-color);
    border-radius: 10rpx;
  }
}
</style>
