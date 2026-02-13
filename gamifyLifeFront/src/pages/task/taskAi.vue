<template>
  <view class="ai-tasks">
    <view class="title">AI任务队列</view>
    <view class="back" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <u-collapse>
      <u-collapse-item
        v-for="(aiList, index) in aiTaskList"
        :key="aiList.id"
        class="aiList-item"
      >
        <template #title>
          <view class="title-ctn">
            <view class="aitask-title">{{ aiList.input_goal }}</view>
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
            <view class="task-content">
              <text>{{ task.description }}</text>
            </view>
            <view class="options">
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
          <view class="options" v-if="aiList.status == 'SUCCESS'">
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
import TaskEditCmp from "@/pages/task/taskCreate.vue";
import { TicketStatus } from "@/type/task";
import http from "@/utils/http";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import dayjs from "dayjs";
const props = defineProps<{
  categories: TaskCategory[];
  tags: TaskTag[];
}>();
const emit = defineEmits(["close", "refresh"]);
const aiTaskList = ref<Ticket[] | null>(null);
const selectTask = ref<Task>();
const taskEditShow = ref(false);

const getAiTaskListWithDraft = async () => {
  aiTaskList.value = await http.get<Ticket[]>(
    "/api/aiTask/aiTaskListWithDraft",
  );
};

const editTask = (task: Task) => {
  selectTask.value = task;
  selectTask.value.due_time = dayjs(selectTask.value.due_time).format(
    "YYYY-MM-DD HH:mm",
  );
  taskEditShow.value = true;
};

const createTask = async (task: Task) => {
  await http.post("/api/task/createTask", task);
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
    await http.post("/api/aiTask/applyAITask", { id });
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
</script>

<style scoped lang="scss">
.ai-tasks {
  width: 100%;
  height: 100%;
  background-color: var(--background-second-color);
  padding: 20rpx;
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
  z-index: 10;
  padding-bottom: 145rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.back {
  position: absolute;
  top: 25rpx;
  left: 25rpx;
  display: flex;
  .back-text {
    margin-left: 10rpx;
    font-size: 32rpx;
  }
}
.aiList-item {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
.title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 20rpx;

  .aitask-title {
    width: 70%;
  }
}

.task {
  padding: 20rpx;
  border-bottom: 2rpx solid #ccc;
  .task-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
}
.options {
  display: flex;
  justify-content: flex-end;
  margin-top: 10rpx;
  width: 100%;
  .btn {
    margin-left: 10rpx;
    margin: 5rpx 10rpx;
    border: none;
    border-radius: 5rpx;
    font-size: 24rpx;
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
</style>
