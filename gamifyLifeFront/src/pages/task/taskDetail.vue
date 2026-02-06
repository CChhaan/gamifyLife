<template>
  <view class="task-detail-ctn">
    <view class="task-detail-tabbar">
      <view class="back" @click="$emit('close')">
        <u-icon name="arrow-left-double"></u-icon>
        <text class="back-text">返回</text>
      </view>
      <view class="task-detail-header">任务详情</view>
      <view @click="taskEditShow = true">修改</view>
      <view>删除</view>
    </view>
    <view class="task-detail">
      <view class="task-detail-item">
        <text class="task-detail-item-label">名称：</text>
        <text class="task-detail-item-value">{{ task.title }}</text>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">描述：</text>
        <text class="task-detail-item-value">{{ task.description }}</text>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">类型：</text>
        <text class="task-detail-item-value">{{ task.category }}</text>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">标签：</text>
        <text class="task-detail-item-value"
          >{{ task.tag1 }} {{ task.tag2 }}</text
        >
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">难度：</text>
        <u-rate :count="5" v-model="task.difficulty" disabled></u-rate>
      </view>
      <view class="reward-count">
        <view class="title">预计可获得收益</view>
        <view class="tip"
          >收益由所选难度、标签、完成时间、用户等级等多方面因素计算所得,请以最后实际结果为准</view
        >
        <view class="rewards">
          <view class="reward-item">
            <view class="reward-item-title">$ </view>
            <view class="reward-item-value">{{ task.final_gold }}</view>
          </view>
          <view class="reward-item">
            <view class="reward-item-title">exp</view>
            <view class="reward-item-value">{{ task.final_exp }}</view>
          </view>
          <view
            class="reward-item"
            v-for="(value, key) in task.estimated_attr_gains"
            :key="key"
          >
            <view class="attr-item-name">
              <image :src="`/static/imgs/${key}.png`" class="attr-item-icon" />
            </view>
            <view class="reward-item-value">{{ value }}</view>
          </view>
        </view>
      </view>
    </view>
    <view>完成任务</view>
    <view>放弃任务</view>
    <task-edit-cmp
      type="edit"
      :tags
      :categories
      :task
      @refresh="emit('refresh')"
      @close="taskEditShow = false"
      v-if="taskEditShow"
    />
  </view>
</template>

<script setup lang="ts">
import TaskEditCmp from "@/pages/task/taskCreate.vue";

import {
  InfluenceAttrTextMap,
  type Task,
  type TaskCategory,
  type TaskTag,
} from "@/type/task";
import { ref } from "vue";

const props = defineProps<{
  task: Task & { category?: string; tag1?: string; tag2?: string };
  tags: TaskTag[];
  categories: TaskCategory[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();

const taskEditShow = ref(false);
</script>

<style scoped lang="scss">
.task-detail-ctn {
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color);
  padding: 15rpx;
  padding-bottom: 155rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  position: fixed;
  z-index: 10;
}

.task-detail-tabbar {
  width: 100%;
  padding: 20rpx;
  align-items: center;
  display: flex;
  justify-content: space-between;
  .task-detail-header {
    font-size: 48rpx;
    font-weight: bold;
  }
  .back {
    display: flex;
    align-items: center;
    .back-text {
      margin-left: 10rpx;
      font-size: 32rpx;
    }
  }
}

.task-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  box-sizing: border-box;
  overflow: auto;
}

.reward-count {
  .title {
    font-size: 32rpx;
    margin-top: 10rpx;
  }
  .tip {
    color: #666;
    font-size: 24rpx;
  }
  .rewards {
    display: flex;
    justify-content: space-around;
    margin-top: 10rpx;
  }
  .reward-item {
    display: flex;
    .reward-item-value {
      margin-left: 5rpx;
    }

    .attr-item-name {
      display: flex;
      align-items: center;

      .attr-item-icon {
        margin-right: 5rpx;
        width: 45rpx;
        height: 45rpx;
      }
    }
  }
}
</style>
