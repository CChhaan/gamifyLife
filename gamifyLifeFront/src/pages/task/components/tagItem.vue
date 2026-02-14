<template>
  <view class="tag-item flex flex-justify__between flex-col">
    <view class="tag-name">
      <text class="tag-name-text">{{ item.name }}</text>
    </view>
    <view class="flex">
      <u-icon
        :name="`/static/imgs/${item.primary_attr}.png`"
        size="40"
      ></u-icon>
      <text class="attr-name">{{
        InfluenceAttrTextMap[item.primary_attr as InfluenceAttr]
      }}</text>
    </view>
    <view class="flex" v-if="item.secondary_attr">
      <u-icon
        :name="`/static/imgs/${item.secondary_attr}.png`"
        size="40"
      ></u-icon>
      <text class="attr-name">{{
        InfluenceAttrTextMap[item.secondary_attr]
      }}</text>
    </view>
    <button
      class="operation-btn"
      @click="$emit('handleDel', item.id, item.name)"
    >
      删除
    </button>
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
  font-size: var(--fontSize-normal);
  box-shadow: var(--shadow-modal);
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
  font-size: var(--fontSize-large);

  .tag-name-text {
    margin-right: 10rpx;
  }
}

.attr-name {
  margin-left: 10rpx;
}

.operation-btn {
  border: none;
  color: #fff;
  background-color: var(--primary-color);
  font-size: var(--fontSize-normal);
  line-height: 1.5;
  padding: 0.25em 1em;
  margin-top: 10rpx;
}
</style>
