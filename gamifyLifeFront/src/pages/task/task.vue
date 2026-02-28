<template>
  <view class="tab-page flex flex-col">
    <u-top-tips ref="uTipsRef"></u-top-tips>
    <!-- 头部 -->
    <view class="task-banner w-full flex">
      <button size="mini" @click="taskTagMngShow = true">标签管理</button>
      <button size="mini" @click="taskCategoryMngShow = true">分类管理</button>
      <button size="mini" @click="aiListShow = true">AI任务队列</button>
      <u-icon
        class="task-banner_icon"
        name="question-circle-fill"
        @click="taskRuleShow = true"
      ></u-icon>
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
      :userDailyLog="userDailyLog!"
      @refresh="refresh"
      @close="taskDetailShow = false"
      v-if="taskDetailShow"
    />
    <ai-task-gen-cmp
      v-if="aiGenShow"
      :count="userDailyLog?.ai_use_count"
      @close="aiGenShow = false"
      @getAiStatus="getAIStatus"
    ></ai-task-gen-cmp>
    <ai-task-list-cmp
      v-if="aiListShow"
      :categories="taskCategories!"
      :tags="tags!"
      :count="userDailyLog?.ai_use_count!"
      @close="aiListShow = false"
      @refresh="getTaskList"
      ref="aiList"
    ></ai-task-list-cmp>
    <confirm-modal-cmp
      :cancel="false"
      v-if="taskRuleShow"
      @confirm="taskRuleShow = false"
      :width="80"
    >
      <template #default>
        <view class="rule">
          <view class="rule-title">任务系统说明 </view>
          <view>
            <view class="rule-sub-title">一、任务是什么？</view>
            <view class="rule-content">
              <view>
                任务代表你要完成的一件具体事情，每个任务包含：标题、描述、分类、标签、难度、预计完成时间等。
              </view>
              <view>
                系统会根据这些信息和你的当前等级，自动计算「金币」「经验」以及四项属性（心智
                / 体魄 / 社交 / 自律）的预计增益。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title">二、任务状态与时间</view>
            <view class="rule-content">
              <view> 状态分为：进行中、已完成、已逾期、已放弃。 </view>
              <view>
                任务逾期后会标记为“已逾期”，请尽量在截止前完成，以保持良好节奏。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 三、如何获得奖励</view>
            <view class="rule-content">
              <view>
                基础奖励由：任务难度、任务截止时间距离现在的时间、当前用户等级等综合计算得出。
              </view>
              <view>
                「关联标签」决定任务主要提升哪些属性：给任务选的标签，其主属性 /
                副属性会获得对应的属性加成。
              </view>
              <view>
                在【任务详情】中可以看到本任务的「预计可获得收益」，完成时实际奖励会以系统结算为准。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 四、防刷机制 </view>
            <view class="rule-content">
              <view>
                从任务创建到点击完成，实际耗时必须 ≥
                5分钟，否则会视为刷任务，不计入正常完成。
              </view>
              <view>
                请合理安排任务，每天完成的任务越多，后面的任务奖励会逐步递减，建议优先完成重要且难度较高的任务，而不是一次性刷大量小任务。
              </view>
              <view>
                每位用户每日最多只结算 20
                个任务奖励，超过上限的任务完成将不再增加经验、金币和属性成长，但你依然可以用它们帮助自己安排生活。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 五、高价值任务 </view>
            <view class="rule-content">
              <view>
                系统会识别一部分高难度、周期长、实际投入时间足够的任务为“高价值任务”，用来鼓励你做真正重要的事情，这些任务在当天前几次完成时会获得更高奖励。
              </view>
              <view>
                当天完成的高价值任务越多，对后续任务奖励的加成会逐步降低，避免单日刷大量任务。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 六、重复任务 </view>
            <view class="rule-content">
              <view> 支持设置为 每日 / 每周 / 每月 重复任务。 </view>
              <view>
                当你完成一次重复任务后，系统会自动根据重复规则生成下一次任务，方便你养成长期习惯。
              </view>
              <view>
                重复任务会记录「已完成次数」，可以帮助你追踪长期习惯的坚持情况。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 七、AI 任务与草稿 </view>
            <view class="rule-content">
              <view>
                你可以通过 AI 功能输入一个目标，由系统自动拆解为一组任务。
              </view>
              <view>
                AI
                生成的任务与手动创建的任务共用同一套奖励和防刷规则，仅在创建方式上有所不同。
              </view>
              <view>
                AI 生成的任务会先进入 AI
                任务队列，你可以在其中查看、修改、删除，确认后再一键应用为正式任务。
              </view>
            </view>
          </view>
          <view>
            <view class="rule-sub-title"> 八、与角色成长和宠物的关系 </view>
            <view class="rule-content">
              <view>
                每完成一个有效任务，都会为你的角色增加经验、金币和属性成长，推动整体等级提升。
              </view>
              <view>
                同时还会为你的宠物增加一定的 经验和亲密度，让它与你一起成长。
              </view>
            </view>
            <view class="rule-summary">
              总结：认真规划任务、合理设置难度和截止时间、按计划完成，而不是频繁创建和秒完成小任务，可以获得更高、更健康的成长回报。
            </view>
          </view>
        </view>
      </template>
    </confirm-modal-cmp>
  </view>
</template>

<script setup lang="ts">
import TaskCategoryCmp from "@/pages/task/components/taskCategory.vue";
import TaskTagCmp from "@/pages/task/components/taskTag.vue";
import TaskCreateCmp from "@/pages/task/components/taskCreate.vue";
import TaskDetailCmp from "@/pages/task/components/taskDetail.vue";
import AiTaskListCmp from "@/pages/task/components/taskAi.vue";
import ConfirmModalCmp from "@/components/ConfirmModal/ConfirmModal.vue";
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

const taskRuleShow = ref<boolean>(false);

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
const aiList = ref();
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
      aiList.value.getAiTaskListWithDraft();
      refresh();
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
  loadTaskData();
  getUserGrowth();
  getUserDailyLog();
};
const { userDailyLog, getUserDailyLog } = useUser();
onShow(() => {
  refresh();
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

.rule {
  font-size: var(--fontSize-normal);
  font-weight: normal;
  text-align: left;
  .rule-title {
    font-size: var(--fontSize-large);
    font-weight: bold;
    text-align: center;
    padding-bottom: 10rpx;
  }
  .rule-sub-title {
    font-size: var(--fontSize-big);
    font-weight: bold;
  }
  .rule-content {
    text-indent: 1em;
  }

  .rule-summary {
    border-top: 5rpx solid #8c6e5266;
    padding-top: 10rpx;
    margin-top: 10rpx;
  }
}
</style>
