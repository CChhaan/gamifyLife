<template>
  <view class="task-detail-ctn">
    <view class="task-detail-tabbar">
      <view class="back" @click="$emit('close')">
        <u-icon name="arrow-left-double"></u-icon>
        <text class="back-text">返回</text>
      </view>
      <view class="task-detail-header">任务详情</view>
      <view class="tab-option">
        <u-icon
          class="option"
          name="edit-pen"
          @click="taskEditShow = true"
        ></u-icon>
        <u-icon class="option cancel" name="trash"></u-icon>
      </view>
    </view>
    <view class="task-detail">
      <view class="task-title">{{ task.title }} </view>
      <view class="task-desc">{{ task.description }} </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">类型：</text>
        <text class="task-detail-item-value">{{ task.category }}</text>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">标签：</text>
        <view class="task-detail-item-value">
          <view class="task-tag"># {{ task.tag1 }}</view>
          <view class="task-tag" v-if="task.tag2"># {{ task.tag2 }}</view>
        </view>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">难度：</text>
        <u-rate :count="5" v-model="task.difficulty" disabled></u-rate>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">创建时间：</text>
        <text class="task-detail-item-value">{{
          dayjs(task.createdAt).format("YYYY-MM-DD HH:mm:00")
        }}</text>
      </view>
      <view class="task-detail-item">
        <text class="task-detail-item-label">预计完成时间：</text>
        <text class="task-detail-item-value">{{
          dayjs(task.due_time).format("YYYY-MM-DD HH:00:00")
        }}</text>
      </view>
    </view>
    <view class="task-detail">
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
    <view class="options">
      <button class="operation-btn">完成任务</button>
      <button class="operation-btn cancel">放弃任务</button>
    </view>
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
import dayjs from "dayjs";
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

.tab-option {
  display: flex;
  align-items: center;
  .option {
    margin-left: 25rpx;
    font-size: 44rpx;
    padding: 15rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  }
  .cancel {
    color: red;
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
  margin-bottom: 20rpx;
  .task-title {
    font-size: 36rpx;
    margin: 10rpx 10rpx 0;
    padding-bottom: 10rpx;
  }
  .task-desc {
    text-align: right;
    font-size: 28rpx;
    color: #666;
    padding-top: 10rpx;
    border-top: 2rpx solid #ccc;
    margin: 0 10rpx 10rpx;
  }
  .task-detail-item {
    display: flex;
    align-items: center;
    margin: 0 10rpx 10rpx;

    .task-detail-item-value {
      font-size: 28rpx;
      color: #666;
      display: flex;
      flex-wrap: wrap;
      view {
        margin-right: 10rpx;
      }
    }
    .task-tag {
      // margin-left: 20rpx;
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--third-color);
      color: #fff;
    }
  }
}

.reward-count {
  margin: 0 10rpx;
  .title {
    font-size: 32rpx;
  }
  .tip {
    color: #666;
    font-size: 24rpx;
    margin: 10rpx 0;
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

.options {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 20rpx 0;

  .operation-btn {
    border: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: 36rpx;
    width: 40%;
    border-radius: 10rpx;
  }
  .cancel {
    background-color: var(--contrast-color);
  }
}
</style>
