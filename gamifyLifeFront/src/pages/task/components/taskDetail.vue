<template>
  <view class="task-detail tab-page flex flex-col">
    <view class="task-detail_tabbar w-full flex flex-justify__between">
      <view class="flex" @click="$emit('close')">
        <u-icon name="arrow-left-double"></u-icon>
        <text class="back-text">返回</text>
      </view>
      <view class="task-detail-header">任务详情</view>
      <view class="flex">
        <u-icon
          class="option"
          name="edit-pen"
          @click="taskEditShow = true"
        ></u-icon>
        <u-icon
          class="option cancel"
          name="trash"
          @click="handleDelete"
        ></u-icon>
      </view>
    </view>
    <!-- 任务详情 -->
    <view class="task-detail_card w-full flex flex-col flex-align__stretch">
      <view class="task-title">{{ task.title }} </view>
      <view class="task-desc">{{ task.description }} </view>
      <view class="task-detail-item flex">
        <text>类型：</text>
        <text class="task-detail-item-value flex">{{
          extendedTask.category
        }}</text>
      </view>
      <view class="task-detail-item flex">
        <text>标签：</text>
        <view class="task-detail-item-value flex">
          <view class="task-tag flex flex-justify__center"
            ># {{ extendedTask.tag1 }}</view
          >
          <view
            class="task-tag flex flex-justify__center"
            v-if="extendedTask.tag2"
            ># {{ extendedTask.tag2 }}</view
          >
        </view>
      </view>
      <view class="task-detail-item flex">
        <text>难度：</text>
        <u-rate :count="5" v-model="task.difficulty" disabled></u-rate>
      </view>
      <view class="task-detail-item flex">
        <text>创建时间：</text>
        <text class="task-detail-item-value flex">{{
          dayjs(task.createdAt).format("YYYY-MM-DD HH:mm:00")
        }}</text>
      </view>
      <view class="task-detail-item flex">
        <text>预计完成时间：</text>
        <text class="task-detail-item-value flex">{{
          dayjs(task.due_time).format("YYYY-MM-DD HH:00:00")
        }}</text>
      </view>
    </view>
    <!-- 任务收益 -->
    <view class="task-detail_card w-full flex flex-col flex-align__stretch">
      <view class="reward-count">
        <view class="title">预计可获得收益</view>
        <view class="tip"
          >收益由所选难度、标签、完成时间、用户等级等多方面因素计算所得,请以最后实际结果为准</view
        >
        <view class="flex flex-justify__around">
          <view class="flex">
            <view>$ </view>
            <view class="reward-item-value">{{ task.final_gold }}</view>
          </view>
          <view class="flex">
            <view>exp</view>
            <view class="reward-item-value">{{ task.final_exp }}</view>
          </view>
          <view
            class="flex flex-col"
            v-for="(value, key) in task.estimated_attr_gains"
            :key="key"
          >
            <view class="flex">
              <image :src="`/static/imgs/${key}.png`" class="attr-item-icon" />
            </view>
            <view class="reward-item-value">{{ value }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="task-detail_options flex flex-justify__around w-full">
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
    <confirm-modal
      :text="text"
      v-if="confirmModalShow"
      @close="confirmModalShow = false"
      @confirm="deleteConfirm"
    ></confirm-modal>
  </view>
</template>

<script setup lang="ts">
import TaskEditCmp from "@/pages/task/components/taskCreate.vue";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal.vue";

import {
  InfluenceAttrTextMap,
  type Task,
  type TaskCategory,
  type TaskTag,
} from "@/type/task";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import http from "@/utils/http";

const props = defineProps<{
  task: Task;
  tags: TaskTag[];
  categories: TaskCategory[];
}>();

const extendedTask = computed(() => {
  const task = props.task;
  return {
    ...task,
    category:
      props.categories.find((cate) => cate.id === task.category_id)?.name || "",
    tag1: props.tags.find((tag) => tag.id === task.tag_id_1)?.name || "",
    tag2: task.tag_id_2
      ? props.tags.find((tag) => tag.id === task.tag_id_2)?.name || ""
      : undefined,
  };
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();
const confirmModalShow = ref(false);
const text = ref<string>("");

const handleDelete = () => {
  text.value = `确定要删除任务「${props.task.title}」吗？`;
  confirmModalShow.value = true;
};

const deleteConfirm = async () => {
  try {
    await http.delete(`/task/deleteTask/${props.task.id}`);
    emit("refresh");
    uni.showToast({ title: "删除成功", icon: "success", duration: 2000 });
    emit("close");
  } catch (error) {
    console.log("删除失败", error);
  } finally {
    confirmModalShow.value = false;
  }
};

const taskEditShow = ref(false);
</script>

<style scoped lang="scss">
.task-detail {
  padding: 25rpx;
  overflow: auto;
  position: fixed;
  z-index: 10;

  &_tabbar {
    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }

    .task-detail-header {
      font-size: var(--fontSize-large);
      font-weight: bold;
    }

    .option {
      margin-left: 25rpx;
      font-size: 44rpx;
      padding: 15rpx;
      background-color: var(--bg-color);
      border-radius: 20rpx;
      box-shadow: var(--shadow);
    }
    .cancel {
      color: red;
    }
  }

  &_card {
    background-color: var(--bg-color);
    border-radius: 10rpx;
    padding: 20rpx;
    box-sizing: border-box;
    overflow: auto;
    margin: 20rpx 0;
    .task-title {
      font-size: var(--fontSize-big);
      padding: 10rpx;
    }
    .task-desc {
      text-align: right;
      font-size: var(--fontSize-small);
      color: var(--text-light-color);
      padding: 10rpx;
      border-top: 2rpx solid #ccc;
    }
    .task-detail-item {
      margin: 10rpx;
      font-size: var(--fontSize-small);

      .task-detail-item-value {
        flex-wrap: wrap;
      }

      .task-tag {
        margin-right: 20rpx;
        padding: 5rpx 10rpx;
        border-radius: 10rpx;
        font-size: var(--fontSize-mini);
        background-color: var(--third-color);
        color: #fff;
      }
    }
    .reward-count {
      margin: 10rpx;
      .title {
        font-size: var(--fontSize-normal);
      }
      .tip {
        color: #666;
        font-size: var(--fontSize-mini);
        margin: 10rpx 0;
      }

      .reward-item-value {
        margin-left: 5rpx;
      }

      .attr-item-icon {
        margin-right: 5rpx;
        width: 45rpx;
        height: 45rpx;
      }
    }
  }

  &_options {
    margin: 20rpx;

    .operation-btn {
      border: 0;
      color: #fff;
      background-color: var(--primary-color);
      font-size: var(--fontSize-big);
      width: 40%;
      border-radius: 10rpx;
    }
    .cancel {
      background-color: var(--contrast-color);
    }
  }
}
</style>
