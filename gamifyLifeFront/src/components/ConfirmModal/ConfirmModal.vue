<template>
  <view class="cover"></view>
  <view class="confirm-modal modal">
    <view class="main">
      {{ text }}
    </view>
    <view class="confirm-btn-group flex flex-justify__around">
      <button class="confirm-button" @click="$emit('confirm')">确定</button>
      <button class="confirm-button" @click="$emit('close')" v-if="cancel">
        取消
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  cancel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cancel: true,
});
defineEmits<{
  (e: "confirm"): void;
  (e: "close"): void;
}>();
</script>

<style scoped lang="scss">
.confirm-modal {
  width: 60vw;
  border-radius: 16rpx;
  padding: 20rpx;
  z-index: 10;
}

.main {
  padding: 20rpx;
  text-align: center;
  font-size: var(--fontSize-large);
  font-weight: bold;
  color: #8c6e52;
}

.confirm-btn-group {
  margin-top: 20rpx;
}

.confirm-button {
  padding: 0 1.2em;
  background-color: var(--primary-color);
  color: #fff;
  font-size: var(--fontSize-normal);
  line-height: 2;
}
</style>
