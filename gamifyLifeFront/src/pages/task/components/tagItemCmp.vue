<template>
  <view class="tag-item">
    <view class="tag-name">
      <text class="tag-name-text">{{ item.name }}</text>
    </view>
    <view class="tag-item-attr">
      <u-icon
        :name="`/static/imgs/${item.primary_attr}.png`"
        size="40"
      ></u-icon>
      <text class="attr-name">{{
        InfluenceAttrTextMap[item.primary_attr as InfluenceAttr]
      }}</text>
    </view>
    <view class="tag-item-attr" v-if="item.secondary_attr">
      <u-icon
        :name="`/static/imgs/${item.secondary_attr}.png`"
        size="40"
      ></u-icon>
      <text class="attr-name">{{
        InfluenceAttrTextMap[item.secondary_attr]
      }}</text>
    </view>
    <view class="operation">
      <button
        class="operation-btn"
        @click="$emit('handleDel', item.id, item.name)"
      >
        删除
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  InfluenceAttrTextMap,
  type InfluenceAttr,
  type TaskTag,
} from "@/type/task";

defineProps<{ item: TaskTag }>();
</script>

<style scoped lang="scss">
.tag-item {
  border-radius: 15rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  color: var(--text-color);
  box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7);
  &:nth-child(5n + 1) {
    background-color: #fdf;
    transform: rotate(-6deg);
  }
  &:nth-child(5n + 2) {
    background-color: #dfd;
    transform: rotate(6deg);
  }
  &:nth-child(5n + 3) {
    background-color: #fdd;
    transform: rotate(-3deg);
  }
  &:nth-child(5n + 4) {
    background-color: #ddf;
    transform: rotate(3deg);
  }
  &:nth-child(5n) {
    background-color: #ffd;
    transform: rotate(1deg);
  }
}
.tag-name {
  font-size: 40rpx;

  .tag-name-text {
    margin-right: 10rpx;
  }
}
.tag-item-attr {
  display: flex;
  align-items: center;
  .attr-name {
    margin-left: 10rpx;
  }
}

.operation-btn {
  border: none;
  color: #fff;
  background-color: var(--primary-color);
  font-size: 32rpx;
  line-height: 1.5;
  padding: 0.25em 1em;
  margin-top: 10rpx;
}
</style>
