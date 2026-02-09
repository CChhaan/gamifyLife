<template>
  <view class="task-page">
    <view class="banner">
      <button size="mini" @click="taskTagMngShow = true">标签管理</button>
      <button size="mini" @click="taskCategoryMngShow = true">分类管理</button>
      <button size="mini">AI任务队列</button>
      <u-icon class="banner-icon" name="question-circle-fill"></u-icon>
    </view>
    <view class="task-category">
      <view
        class="task-category-item"
        :class="selectedCategory == 'all' && 'selected'"
        @click="selectedCategory = 'all'"
        ><text class="task-category-item-text">全部</text></view
      >
      <view
        class="task-category-item"
        :class="selectedCategory == value.id && 'selected'"
        v-for="value in taskCategories"
        :key="value.id"
        @click="selectedCategory = value.id"
      >
        <text class="task-category-item-text">{{ value.name }}</text>
      </view>
    </view>
    <view class="task-list">
      <view class="timeFilter">
        <view
          class="time"
          :class="selectedTime == 'all' && 'selected'"
          @click="selectedTime = 'all'"
          >全部</view
        >
        <view
          class="time"
          :class="selectedTime == 'overdue' && 'selected'"
          @click="selectedTime = 'overdue'"
        >
          已逾期
        </view>
        <view
          class="time"
          :class="selectedTime == 'finished' && 'selected'"
          @click="selectedTime = 'finished'"
          >已结束</view
        >
        <view
          class="time"
          :class="selectedTime == 'today' && 'selected'"
          @click="selectedTime = 'today'"
          >今天</view
        >
        <view
          class="time"
          :class="selectedTime == 'week' && 'selected'"
          @click="selectedTime = 'week'"
          >本周</view
        >
        <view
          class="time"
          :class="selectedTime == 'month' && 'selected'"
          @click="selectedTime = 'month'"
          >本月</view
        >
        <view
          class="time"
          :class="selectedTime == 'year' && 'selected'"
          @click="selectedTime = 'year'"
          >今年</view
        >
      </view>
      <view class="tasks">
        <view
          class="task-item"
          v-for="task in filterTaskList"
          :key="task.id"
          @click="showTaskDetail(task.id!)"
        >
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
          <view class="task-detail">
            <view class="task-info">
              <text class="task-title">{{ task.title }}</text>
              <view class="task-tag"
                >#
                {{ tags?.find((tag) => tag.id == task.tag_id_1)?.name }}</view
              >
              <view class="task-tag" v-if="task.tag_id_2"
                >#
                {{ tags?.find((tag) => tag.id == task.tag_id_2)?.name }}</view
              >
            </view>

            <view class="task-data">
              <view class="task-data-item">
                <view class="task-due-time">{{
                  dayjs(task.due_time).format("YYYY-MM-DD HH:mm")
                }}</view>
                <view class="task-reward">
                  <view class="reward-item">
                    <view class="reward-item-title">exp</view>
                    <view class="reward-item-value">{{ task.final_exp }}</view>
                  </view>
                  <view class="reward-item">
                    <view class="reward-item-title">$ </view>
                    <view class="reward-item-value">{{ task.final_gold }}</view>
                  </view>
                  <view
                    class="reward-item"
                    v-for="(name, key) in task.estimated_attr_gains"
                    :key="key"
                  >
                    <view class="attr-item-name">
                      <image
                        :src="`/static/imgs/${key}.png`"
                        class="attr-item-icon"
                      />
                      <!-- <text>{{ name }}</text> -->
                    </view>
                  </view>
                </view>
              </view>
              <view
                v-if="task.status != 'PENDING'"
                class="task-status"
                :class="taskStatusClass(task.status)"
              >
                {{ TaskStatusTextMap[task.status] }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="add-task" @click="taskCreateShow = true">
      <button>+</button>
    </view>
    <view class="ai-create" @click="aiGenShow = true">
      <button>AI</button>
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
      @refresh="getTaskList"
      @close="taskDetailShow = false"
      v-if="taskDetailShow"
    />
    <ai-task-gen-cmp
      v-if="aiGenShow"
      @close="aiGenShow = false"
    ></ai-task-gen-cmp>
  </view>
</template>

<script setup lang="ts">
import TaskCategoryCmp from "@/pages/task/taskCategory.vue";
import TaskTagCmp from "@/pages/task/taskTag.vue";
import TaskCreateCmp from "@/pages/task/taskCreate.vue";
import TaskDetailCmp from "@/pages/task/taskDetail.vue";
import { TaskStatusTextMap, type Task } from "@/type/task";
import { onHide, onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { useTask } from "@/composables/useTask";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import AiTaskGenCmp from "./components/aiTaskGen.vue";
dayjs.extend(isBetween);

const {
  taskCategories,
  tags,
  taskList,
  getTaskCategories,
  getTags,
  getTaskList,
  loadTaskData,
} = useTask();

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
      list = list.filter(
        (task) =>
          task.due_time &&
          new Date(task.due_time) < new Date() &&
          task.status == "PENDING",
      );
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
  detail.value.category = taskCategories.value!.find(
    (cate) => cate.id == detail.value?.category_id,
  )?.name;
  detail.value.tag1 = tags.value!.find(
    (tag) => tag.id == detail.value?.tag_id_1,
  )?.name;
  detail.value.tag2 = tags.value!.find(
    (tag) => tag.id == detail.value?.tag_id_2,
  )?.name;
};

// AI生成任务
const aiGenShow = ref(false);

onLoad(async () => {
  loadTaskData();
});
onHide(() => {
  taskCreateShow.value = false;
  taskTagMngShow.value = false;
  taskCategoryMngShow.value = false;
  taskDetailShow.value = false;
});
</script>

<style scoped lang="scss">
.task-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 140rpx;
  background-color: var(--background-color);
}

.banner {
  width: 100%;
  height: 100rpx;
  background-color: var(--third-color);
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  button {
    margin: 0 10rpx;
  }

  .banner-icon {
    font-size: 48rpx;
    margin-left: 10rpx;
    color: #fff;
  }
}

.task-category {
  width: calc(100% - 50rpx);
  display: flex;
  align-items: center;
  justify-content: start;
  overflow: auto;
  gap: 15rpx;
  padding: 30rpx 0;

  .task-category-item {
    background-color: #fcfcfc;
    border-radius: 20rpx;
    font-size: 32rpx;
    box-shadow: 0 6rpx 10rpx #ccc;
    padding: 10rpx 30rpx;
  }

  .task-category-item-text {
    white-space: nowrap;
  }

  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }

  .more {
    background-color: #d0d0d0;
  }
}

.task-list {
  width: calc(100% - 50rpx);
  background-color: #fff;
  border-radius: 40rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 20rpx;
  height: calc(100vh - 390rpx);
  overflow: auto;
}

.timeFilter {
  width: 100%;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
  display: flex;
  overflow: auto;
  font-size: 32rpx;
  justify-content: space-between;
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

.tasks {
  height: calc(100% - 85rpx);
  overflow: auto;

  .task-item {
    display: flex;
    align-items: center;
    font-size: 32rpx;
    margin-bottom: 30rpx;
    width: 100%;

    .task-detail {
      flex: 1;
    }
  }

  .reward-item {
    display: flex;
    margin-right: 15rpx;
    border-radius: 10rpx;
    font-size: 32rpx;
    color: var(--third-color);
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

  .task-info,
  .task-reward {
    display: flex;
    align-items: center;
    margin-left: 10rpx;
  }

  .task-tag {
    margin-left: 20rpx;
    padding: 5rpx 10rpx;
    border-radius: 10rpx;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--third-color);
    color: #fff;
  }

  .task-data {
    display: flex;
    justify-content: space-between;

    .task-due-time {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }

    .task-status {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10rpx;
      padding: 5rpx 20rpx;
    }

    .finished {
      color: #03db6c;
      border: 3rpx solid #03db6c;
    }
  }
}

.add-task {
  position: fixed;
  bottom: 200rpx;
  right: 50rpx;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 80rpx;
  }
}

.ai-create {
  position: fixed;
  bottom: 350rpx;
  right: 50rpx;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: var(--contrast-color);
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}
</style>
