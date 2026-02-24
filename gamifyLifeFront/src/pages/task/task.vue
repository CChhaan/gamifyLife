<template>
  <view class="tab-page flex flex-col">
    <u-top-tips ref="uTipsRef"></u-top-tips>
    <!-- 头部 -->
    <view class="task-banner w-full flex">
      <button size="mini" @click="taskTagMngShow = true">标签管理</button>
      <button size="mini" @click="taskCategoryMngShow = true">分类管理</button>
      <button size="mini" @click="aiListShow = true">AI任务队列</button>
      <u-icon class="task-banner_icon" name="question-circle-fill"></u-icon>
    </view>
    <!-- 任务分类 -->
    <view class="task-category-list flex">
      <view
        class="task-category flex-shrink-0"
        :class="{ selected: selectedCategory == 'all' }"
        @click="selectedCategory = 'all'"
      >
        <text>全部</text>
      </view>
      <view
        class="task-category flex-shrink-0"
        :class="{ selected: selectedCategory == value.id }"
        v-for="value in taskCategories"
        :key="value.id"
        @click="selectedCategory = value.id"
      >
        <text>{{ value.name }}</text>
      </view>
    </view>
    <!-- 任务列表 -->
    <view class="task-list flex-1">
      <view class="task-list_timeFilter flex flex-justify__between">
        <view
          class="time"
          :class="{ selected: selectedTime == 'all' }"
          @click="selectedTime = 'all'"
          >全部</view
        >
        <view
          class="time"
          :class="{ selected: selectedTime == 'overdue' }"
          @click="selectedTime = 'overdue'"
        >
          已逾期
        </view>
        <view
          class="time"
          :class="{ selected: selectedTime == 'finished' }"
          @click="selectedTime = 'finished'"
          >已结束</view
        >
        <view
          class="time"
          :class="{ selected: selectedTime == 'today' }"
          @click="selectedTime = 'today'"
          >今天</view
        >
        <view
          class="time"
          :class="{ selected: selectedTime == 'week' }"
          @click="selectedTime = 'week'"
          >本周</view
        >
        <view
          class="time"
          :class="{ selected: selectedTime == 'month' }"
          @click="selectedTime = 'month'"
          >本月</view
        >
        <view
          class="time"
          :class="{ selected: selectedTime == 'year' }"
          @click="selectedTime = 'year'"
          >今年</view
        >
      </view>
      <view class="task-list_tasks">
        <view
          class="task-item w-full"
          v-for="task in filterTaskList"
          :key="task.id"
          @click="showTaskDetail(task.id!)"
        >
          <view class="task-info w-full">
            <text class="text-ellipsis w-full">{{ task.title }}</text>
            <!-- <view class="task-tag"
                >#
                {{ tags?.find((tag) => tag.id == task.tag_id_1)?.name }}</view
              >
              <view class="task-tag" v-if="task.tag_id_2"
                >#
                {{ tags?.find((tag) => tag.id == task.tag_id_2)?.name }}</view
              > -->
          </view>

          <view class="task-data flex flex-justify__between">
            <view>
              <view class="task-due-time flex">
                <u-icon name="calendar" class="time-icon"></u-icon>
                <text>
                  {{ dayjs(task.due_time).format("YYYY-MM-DD HH:mm") }}
                </text>
              </view>
              <view class="task-reward flex">
                <view class="reward-item flex">
                  <view class="reward-item-title">exp</view>
                  <view class="reward-item-value">{{ task.final_exp }}</view>
                </view>
                <view class="reward-item flex">
                  <view class="reward-item-title">$ </view>
                  <view class="reward-item-value">{{ task.final_gold }}</view>
                </view>
                <view
                  class="reward-item flex"
                  v-for="(name, key) in task.estimated_attr_gains"
                  :key="key"
                >
                  <image
                    :src="`/static/imgs/icons/${key}.png`"
                    class="attr-item-icon"
                  />
                </view>
              </view>
            </view>
            <view
              v-if="isOverdue(task)"
              class="task-status flex flex-justify__center overdue"
            >
              已逾期
            </view>
            <view
              v-if="task.status != 'PENDING'"
              class="task-status flex flex-justify__center"
              :class="taskStatusClass(task.status)"
            >
              {{ TaskStatusTextMap[task.status] }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 悬浮按钮 -->
    <view
      class="add-task flex flex-justify__center circle"
      @click="taskCreateShow = true"
    >
      <u-icon name="plus"></u-icon>
    </view>
    <view
      class="ai-create flex flex-justify__center circle"
      @click="aiGenShow = true"
    >
      AI
    </view>
    <task-category-cmp
      @close="taskCategoryMngShow = false"
      :taskCategories="taskCategories"
      @refresh="getTaskCategories"
      v-if="taskCategoryMngShow"
    />
    <task-tag-cmp
      @close="taskTagMngShow = false"
      @refresh="getTags"
      :tags="tags!"
      v-if="taskTagMngShow"
    />
    <task-create-cmp
      type="create"
      :categories="taskCategories!"
      :tags="tags!"
      @refresh="getTaskList"
      @close="taskCreateShow = false"
      v-if="taskCreateShow"
    />
    <task-detail-cmp
      :task="taskList!.find((task) => task.id == taskId)!"
      :category="taskList!.find((task) => task.category_id)"
      :categories="taskCategories!"
      :tags="tags!"
      :userGrowth="userGrowth!"
      @refresh="refresh"
      @close="taskDetailShow = false"
      v-if="taskDetailShow"
    />
    <ai-task-gen-cmp
      v-if="aiGenShow"
      @close="aiGenShow = false"
      @getAiStatus="getAIStatus"
    ></ai-task-gen-cmp>
    <ai-task-list-cmp
      v-if="aiListShow"
      :categories="taskCategories!"
      :tags="tags!"
      @close="aiListShow = false"
      @refresh="getTaskList"
    ></ai-task-list-cmp>
  </view>
</template>

<script setup lang="ts">
import TaskCategoryCmp from "@/pages/task/components/taskCategory.vue";
import TaskTagCmp from "@/pages/task/components/taskTag.vue";
import TaskCreateCmp from "@/pages/task/components/taskCreate.vue";
import TaskDetailCmp from "@/pages/task/components/taskDetail.vue";
import AiTaskListCmp from "@/pages/task/components/taskAi.vue";
import { TaskStatusTextMap, type Ticket, type Task } from "@/type/task";
import { onHide, onShow } from "@dcloudio/uni-app";
import { computed, onMounted, ref } from "vue";
import { useTask } from "@/composables/useTask";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import AiTaskGenCmp from "./components/aiTaskGen.vue";
import http from "@/utils/http";
import { isOverdue } from "./taskFn";
import { useUser } from "@/composables/useUser";
dayjs.extend(isBetween);

// 标记应用是否在前台
let isAppForeground = true;

// 监听应用切后台
const appHideHandler = () => {
  isAppForeground = false;
};

// 监听应用切前台
const appShowHandler = () => {
  isAppForeground = true;
};

onMounted(() => {
  // 注册应用前后台监听
  uni.onAppHide(appHideHandler);
  uni.onAppShow(appShowHandler);
});

const uTipsRef = ref();
const {
  taskCategories,
  tags,
  taskList,
  getTaskCategories,
  getTags,
  getTaskList,
  loadTaskData,
} = useTask();

const { userGrowth, getUserGrowth } = useUser();

const filterTaskList = computed(() => {
  if (!taskList.value) return [];
  // 先按照分类筛选
  let list = taskList.value!.filter(
    (task) =>
      selectedCategory.value == "all" ||
      task.category_id == selectedCategory.value,
  );

  // 再按照时间筛选
  switch (selectedTime.value) {
    case "overdue":
      list = list.filter((task) => isOverdue(task));
      break;
    case "finished":
      list = list.filter((task) => task.status !== "PENDING");
      break;
    case "today":
      list = list.filter(
        (task) => task.due_time && new Date(task.due_time) >= new Date(),
      );
      break;
    case "week":
      list = list.filter((task) => {
        if (!task.due_time) return false;
        const taskDate = dayjs(task.due_time);
        const now = dayjs();
        const weekStart = now.startOf("week");
        const weekEnd = now.endOf("week");
        return taskDate.isBetween(weekStart, weekEnd, "day", "[]");
      });
      break;
    case "month":
      list = list.filter((task) => {
        if (!task.due_time) return false;
        const taskDate = dayjs(task.due_time);
        const now = dayjs();
        const monthStart = now.startOf("month");
        const monthEnd = now.endOf("month");
        return taskDate.isBetween(monthStart, monthEnd, "day", "[]");
      });
      break;
    case "year":
      list = list.filter((task) => {
        if (!task.due_time) return false;
        const taskDate = dayjs(task.due_time);
        const now = dayjs();
        const yearStart = now.startOf("year");
        const yearEnd = now.endOf("year");
        return taskDate.isBetween;
      });
      break;
  }

  return list;
});

const taskStatusClass = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "finished";
    case "CANCELED":
      return "canceled";
    case "OVERDUE":
      return "overdue";
    case "ABANDONED":
      return "abandoned";
  }
};

const selectedCategory = ref<number | string>("all");
const selectedTime = ref("today");

const taskCategoryMngShow = ref(false);
const taskTagMngShow = ref(false);
const taskCreateShow = ref(false);

// 任务详情
const taskDetailShow = ref(false);
const taskId = ref(0);
const detail = ref<
  (Task & { category?: string; tag1?: string; tag2?: string }) | null
>(null);

const showTaskDetail = (id: number) => {
  taskId.value = id;
  taskDetailShow.value = true;
  detail.value = taskList.value!.find((task) => task.id == id)!;
};

// AI生成任务
const aiGenShow = ref(false);

// 轮询AI状态
const getAIStatus = (jobId: number | string) => {
  uTipsRef.value?.show({
    title: "AI规划中，完成时会在顶部通知",
    type: "success",
    duration: "2300",
  });
  const timer = setInterval(async () => {
    const aiJob = await http.get<Ticket>(
      "/aiTask/aiTaskStatus?taskId=" + jobId,
    );
    if (aiJob.status == "SUCCESS") {
      clearInterval(timer);
      uTipsRef.value?.show({
        title: "AI规划完成，可在AI任务队列页面查看",
        t0ype: "success",
        duration: "2300",
      });
    } else if (aiJob.status == "FAILED") {
      clearInterval(timer);
      uTipsRef.value?.show({
        title: "AI规划失败",
        type: "error",
        duration: "2300",
      });
    }
  }, 2000);
};

const aiListShow = ref(false);
const refresh = () => {
  getTaskList();
  getUserGrowth();
};
onShow(() => {
  loadTaskData();
  getUserGrowth();
});
onHide(() => {
  if (!isAppForeground) return;
  taskCreateShow.value = false;
  taskTagMngShow.value = false;
  taskCategoryMngShow.value = false;
  taskDetailShow.value = false;
  aiGenShow.value = false;
  aiListShow.value = false;
});
</script>

<style scoped lang="scss">
// 头部
.task-banner {
  height: 100rpx;
  background-color: var(--primary-color);
  padding: 0 20rpx;
  button {
    margin: 0 10rpx;
  }

  &_icon {
    font-size: 48rpx;
    margin-left: 10rpx;
    color: #fff;
  }
}

// 任务分类
.task-category-list {
  width: 90vw;
  overflow-x: auto;
  padding: 25rpx 0;

  .task-category {
    background-color: var(--bg-color);
    border-radius: 20rpx;
    font-size: var(--fontSize-normal);
    box-shadow: var(--shadow);
    padding: 15rpx 30rpx;
    margin-right: 20rpx;
  }

  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }
}

// 任务列表
.task-list {
  width: 93vw;
  background-color: var(--bg-color);
  border-radius: 40rpx;
  box-shadow: var(--shadow);
  padding: 20rpx;
  margin-bottom: 40rpx;
  overflow: auto;

  &_timeFilter {
    width: 100%;
    font-size: var(--fontSize-small);
    color: var(--text-light-color);
    margin-bottom: 25rpx;
    overflow: auto;
    border-bottom: 2rpx solid #eee;
    .time {
      padding: 5rpx 20rpx 10rpx;
      white-space: nowrap;
    }
    .selected {
      color: var(--primary-color);
      border-bottom: 6rpx solid var(--primary-color);
    }
  }

  &_tasks {
    height: calc(100% - 90rpx);
    overflow: auto;
    padding: 0 10rpx;

    .task-item {
      font-size: var(--fontSize-normal);
      margin-bottom: 30rpx;
    }

    .task-info,
    .task-reward {
      margin-left: 10rpx;
    }

    .task-data {
      .task-due-time {
        font-size: var(--fontSize-small);
        color: #999;
        margin-left: 10rpx;
        .time-icon {
          margin-right: 5rpx;
        }
      }

      .reward-item {
        margin-right: 20rpx;
        border-radius: 10rpx;

        .reward-item-title {
          color: var(--third-color);
        }
        .reward-item-value {
          font-size: var(--fontSize-normal);
          color: var(--primary-color);
          margin-left: 5rpx;
        }

        .attr-item-icon {
          width: 45rpx;
          height: 45rpx;
        }
      }

      .task-status {
        border-radius: 10rpx;
        padding: 5rpx 20rpx;
      }

      .finished {
        color: #03db6c;
        border: 3rpx solid #03db6c;
      }

      .abandoned {
        color: #666;
        border: 3rpx solid #ddd;
      }

      .overdue {
        color: #ff6b6b;
        border: 3rpx solid #ff6b6b;
      }
    }
  }
}

// 悬浮按钮
.add-task,
.ai-create {
  position: fixed;
  bottom: 350rpx;
  right: 50rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: var(--contrast-color);
  box-shadow: var(--shadow);
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
}

.add-task {
  bottom: 200rpx;
  background-color: var(--primary-color);
  color: #fff;
}
</style>
