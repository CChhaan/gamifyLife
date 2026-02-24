<template>
  <view class="ai-tasks tab-page">
    <view class="title">AI任务队列</view>
    <view class="back flex" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view class="count">今日已使用AI任务规划次数：{{ count }} / 10</view>

    <u-collapse>
      <u-collapse-item
        v-for="(aiList, index) in aiTaskList"
        :key="aiList.id"
        class="aiList-item"
      >
        <template #title>
          <view class="task-title flex flex-justify__between w-full">
            <view class="ai-task-title">{{ aiList.input_goal }}</view>
            <view>{{ TicketStatus[aiList.status] }}</view>
          </view>
        </template>
        <view>
          <view
            class="task"
            v-for="(task, index) in aiList.AIDraftTasks"
            :key="task.id"
          >
            <view class="task-title">
              <text>{{ task.title }}</text>
            </view>
            <view>
              <text>{{ task.description }}</text>
            </view>
            <view class="options flex flex-justify__end w-full">
              <button
                size="mini"
                @click="createTask(task)"
                class="btn use"
                v-if="task.status == 'UNUSED'"
              >
                单条应用
              </button>
              <button
                size="mini"
                @click="editTask(task)"
                class="btn edit"
                v-if="task.status == 'UNUSED'"
              >
                编辑
              </button>
              <button size="mini" @click="" class="btn delete">删除</button>
            </view>
          </view>
          <view
            class="options flex flex-justify__end w-full"
            v-if="aiList.status == 'SUCCESS'"
          >
            <button size="mini" @click="batchApply(aiList.id!)" class="btn use">
              全部应用
            </button>
          </view>
        </view>
      </u-collapse-item>
    </u-collapse>
    <task-edit-cmp
      type="ai-edit"
      :tags
      :categories
      :task="selectTask"
      @refresh="createFresh"
      @close="taskEditShow = false"
      v-if="taskEditShow"
    />
  </view>
</template>

<script setup lang="ts">
import type { Task, TaskCategory, TaskTag, Ticket } from "@/type/task";
import TaskEditCmp from "@/pages/task/components/taskCreate.vue";
import { TicketStatus } from "@/type/task";
import http from "@/utils/http";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import dayjs from "dayjs";
const props = defineProps<{
  categories: TaskCategory[];
  count: number;
  tags: TaskTag[];
}>();
const emit = defineEmits(["close", "refresh"]);
const aiTaskList = ref<Ticket[] | null>(null);
const selectTask = ref<Task>();
const taskEditShow = ref(false);

const getAiTaskListWithDraft = async () => {
  aiTaskList.value = await http.get<Ticket[]>("aiTask/aiTaskListWithDraft");
};

const editTask = (task: Task) => {
  selectTask.value = task;
  selectTask.value.due_time = dayjs(selectTask.value.due_time).format(
    "YYYY-MM-DD HH:mm",
  );
  taskEditShow.value = true;
};

const createTask = async (task: Task) => {
  await http.post("task/createTask", task);
  uni.showToast({
    title: "应用成功",
  });
  createFresh();
};

const createFresh = () => {
  getAiTaskListWithDraft();
  emit("refresh");
};

const batchApply = async (id: number | string) => {
  try {
    uni.showLoading({
      title: "应用中...",
      mask: true,
    });
    await http.post("aiTask/applyAITask", { id });
    createFresh();
    uni.showToast({
      title: "应用成功",
    });
  } catch (error) {
  } finally {
    uni.hideLoading();
  }
};

onShow(() => {
  getAiTaskListWithDraft();
});

defineExpose({
  getAiTaskListWithDraft,
});
</script>

<style scoped lang="scss">
.ai-tasks {
  padding: 20rpx 20rpx 145rpx;
  overflow: auto;
  position: fixed;
  z-index: 10;

  .title {
    font-size: var(--fontSize-large);
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .back {
    position: absolute;
    top: 25rpx;
    left: 25rpx;
    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }
  }

  .count {
    margin-bottom: 20rpx;
  }

  .aiList-item {
    background-color: var(--bg-color);
    padding: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    box-shadow: var(--shadow);

    .task-title {
      padding-right: 20rpx;

      .ai-task-title {
        width: 70%;
        font-size: var(--fontSize-normal);
      }
    }

    .task {
      padding: 20rpx;
      border-bottom: 2rpx solid #ccc;
      .task-title {
        font-size: var(--fontSize-normal);
        font-weight: bold;
        margin-bottom: 10rpx;
      }
    }
  }
  .options {
    margin-top: 10rpx;
    .btn {
      margin-left: 10rpx;
      margin: 5rpx 10rpx;
      border-radius: 5rpx;
      font-size: var(--fontSize-mini);
      &.use {
        background-color: #4caf50;
        color: #fff;
      }
      &.edit {
        background-color: #2196f3;
        color: #fff;
      }
      &.delete {
        background-color: #f44336;
        color: #fff;
      }
    }
  }
}
</style>
