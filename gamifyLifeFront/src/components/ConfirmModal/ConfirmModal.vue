<template>
  <view class="confirm-ctn">
    <view class="main">
      {{ text }}
    </view>
    <view class="confirm-btn-group">
      <button class="confirm-button" @click="$emit('confirm')">确定</button>
      <button class="confirm-button" @click="$emit('close')">取消</button>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style scoped lang="scss">
.confirm-ctn {
  width: 60vw;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f8f2de;
  border-radius: 16rpx;
  border-top: 6rpx solid #f9f9f0;
  border-bottom: 6rpx solid #eddebb;
  box-shadow: 0 4rpx 16rpx #e4d4b7;
  padding: 20rpx;
  z-index: 10;
}

.main {
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  color: #8c6e52;
  padding: 20rpx 0;
}

.confirm-btn-group {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
}

.confirm-button {
  background-color: #fe7a24;
  color: #fff;
  font-size: 32rpx;
  line-height: 2;
  padding: 0 1em;
  height: auto;
}
</style>
