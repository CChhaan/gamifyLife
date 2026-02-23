<template>
  <view class="task-create tab-page flex flex-col">
    <view class="task-create_header">{{
      type === "create" ? "创建任务" : "编辑任务"
    }}</view>
    <view class="task-create_back flex" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>

    <view class="add-task-form w-full flex flex-col flex-align__stretch">
      <u-form
        :model="task"
        ref="taskCreateForm"
        :rules="taskCreateRules"
        label-width="200"
        label-position="top"
      >
        <u-form-item label="标题" prop="title">
          <u-input
            class="form-item"
            v-model="task.title"
            placeholder="请输入标题"
            border
          />
        </u-form-item>
        <u-form-item label="描述" prop="description">
          <u-input
            class="form-item"
            type="textarea"
            v-model="task.description"
            placeholder="请输入描述"
            border
          />
        </u-form-item>
        <u-form-item label="所属分类" prop="category_id">
          <u-input
            class="form-item"
            v-model="selectedCategoryName"
            type="select"
            @click="categorySelectShow = true"
            border
            placeholder="请选择所属分类"
            :clearable="false"
          ></u-input>
        </u-form-item>
        <!-- <u-form-item label="父级任务" prop="parent_task_id"></u-form-item> -->
        <u-form-item
          v-show="type !== 'edit'"
          label="是否重复任务"
          prop="is_recurring"
        >
          <u-switch v-model="task.is_recurring"></u-switch>
        </u-form-item>
        <u-form-item
          label="重复规则"
          prop="recurring_rule"
          v-show="type == 'edit' && task.is_recurring"
        ></u-form-item>
        <u-form-item label="任务难度" prop="difficulty">
          <u-rate :count="5" v-model="task.difficulty"></u-rate>
        </u-form-item>
        <u-form-item label="关联标签1" prop="tag_id_1">
          <u-input
            class="form-item"
            v-model="selectedTag1Name"
            type="select"
            @click="tag1SelectShow = true"
            border
            placeholder="请选择关联标签1"
            :clearable="false"
          ></u-input>
        </u-form-item>
        <u-form-item label="关联标签2" prop="tag_id_2">
          <u-input
            class="form-item"
            v-model="selectedTag2Name"
            type="select"
            @click="tag2SelectShow = true"
            border
            placeholder="请选择关联标签2"
            :clearable="false"
          ></u-input>
        </u-form-item>
        <u-form-item label="预计完成时间" prop="completed_at">
          <u-input
            class="form-item"
            v-model="task.due_time"
            type="select"
            border
            @click="calendarShow = true"
            placeholder="请选择预计完成时间"
            :clearable="false"
          ></u-input>
        </u-form-item>
      </u-form>
      <view class="reward-count">
        <view class="title">预计可获得收益</view>
        <view class="tip"
          >收益由所选难度、标签、完成时间、当前用户等级等多方面因素计算所得,请以最后实际结果为准</view
        >
        <view class="flex flex-justify__around">
          <view class="flex">
            <view>$ </view>
            <view class="reward-item-value">{{ rewardMoney }}</view>
          </view>
          <view class="flex">
            <view>exp</view>
            <view class="reward-item-value">{{ rewardExp }}</view>
          </view>
          <view
            class="flex flex-col"
            v-for="(name, key) in InfluenceAttrTextMap"
            :key="key"
          >
            <view class="flex">
              <image
                :src="`/static/imgs/icons/${key}.png`"
                class="attr-item-icon"
              />
            </view>
            <view class="reward-item-value">{{ rewardAttrMap[key] }}</view>
          </view>
        </view>
      </view>
      <view class="add-operation w-full">
        <button class="operation-btn" @click="submitTask">
          {{ type == "create" ? "创建" : "保存" }}
        </button>
      </view>
    </view>
    <u-select
      v-model="categorySelectShow"
      mode="single-column"
      :list="categoryList"
      @confirm="task.category_id = $event[0].value"
      confirm-text="确定"
      cancel-text="取消"
    ></u-select>
    <u-select
      v-model="tag1SelectShow"
      mode="single-column"
      :list="tagList"
      @confirm="task.tag_id_1 = $event[0].value"
      confirm-text="确定"
      cancel-text="取消"
    ></u-select>
    <u-select
      v-model="tag2SelectShow"
      mode="single-column"
      :list="tagList"
      @confirm="task.tag_id_2 = $event[0].value"
      confirm-text="确定"
      cancel-text="取消"
    ></u-select>
    <u-picker
      mode="time"
      v-model="calendarShow"
      :params="{
        year: true,
        month: true,
        day: true,
        hour: true,
      }"
      confirm-text="确定"
      cancel-text="取消"
      :default-time="dayjs().format('YYYY-MM-DD HH:mm')"
      :start-year="dayjs().format('YYYY')"
      @confirm="
        task.due_time = `${$event.year}-${$event.month}-${$event.day} ${$event.hour}:00`
      "
    ></u-picker>
  </view>
</template>

<script setup lang="ts">
import {
  InfluenceAttrTextMap,
  type Task,
  type TaskCategory,
  type TaskTag,
} from "@/type/task";
import { getUserData, taskAttr, taskExp, taskGold } from "@/utils/growthCal";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { computed, ref } from "vue";

const taskCreateForm = ref();

const props = defineProps<{
  type: "create" | "edit" | "ai-edit";
  task?: Task;
  categories: TaskCategory[];
  tags: TaskTag[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();

const task = ref<Task>({
  title: "",
  description: "",
  category_id: undefined,
  is_ai_generated: 0,
  is_recurring: 0,
  recurring_rule: undefined,
  status: "PENDING",
  difficulty: 1,
  tag_id_1: undefined,
  tag_id_2: undefined,
  due_time: undefined,
});

const taskCreateRules = {};

const categorySelectShow = ref(false);
const tag1SelectShow = ref(false);
const tag2SelectShow = ref(false);
const calendarShow = ref(false);
const categoryList = computed(() =>
  props.categories.map((item) => ({
    value: item.id,
    label: item.name,
  })),
);
const tagList = computed(() =>
  props.tags.map((item) => ({
    value: item.id,
    label: item.name,
  })),
);

const selectedCategoryName = computed(() => {
  const selectedCategory = props.categories.find(
    (item) => item.id === task.value.category_id,
  );
  return selectedCategory ? selectedCategory.name : "";
});
const selectedTag1Name = computed(() => {
  const selectedTag = props.tags.find(
    (item) => item.id === task.value.tag_id_1,
  );
  return selectedTag ? selectedTag.name : "";
});
const selectedTag2Name = computed(() => {
  const selectedTag = props.tags.find(
    (item) => item.id === task.value.tag_id_2,
  );
  return selectedTag ? selectedTag.name : "";
});

const rewardExp = computed(() => {
  const diff = dayjs().diff(
    dayjs(task.value.due_time, "YYYY-M-D H:mm"),
    "hour",
    true,
  );
  console.log("level", getUserData().userLevel);
  return taskExp(
    task.value.difficulty,
    getUserData().userLevel,
    Math.ceil(-diff),
  );
});

const rewardMoney = computed(() => {
  const diff = dayjs().diff(
    dayjs(task.value.due_time, "YYYY-M-D H:mm"),
    "hour",
    true,
  );
  return taskGold(task.value.difficulty, Math.ceil(-diff));
});
const rewardAttrMap = computed(() => {
  const map: Record<string, number> = {};
  const level = getUserData().userLevel;
  const difficulty = task.value.difficulty;
  const tag1 = props.tags.find((item) => item.id === task.value.tag_id_1);
  const tag2 = props.tags.find((item) => item.id === task.value.tag_id_2);

  Object.keys(InfluenceAttrTextMap).forEach((key) => {
    let reward = 0;
    if (tag1) {
      if (tag1.primary_attr === key) {
        reward += taskAttr(level, difficulty);
      }
      if (tag1.secondary_attr && tag1.secondary_attr === key) {
        reward += taskAttr(level, difficulty);
      }
    }
    if (tag2) {
      if (tag2.primary_attr === key) {
        reward += taskAttr(level, difficulty);
      }
      if (tag2.secondary_attr && tag2.secondary_attr === key) {
        reward += taskAttr(level, difficulty);
      }
    }
    map[key] = reward;
  });

  return map;
});

const submitTask = async () => {
  taskCreateForm.value.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      try {
        if (props.type == "create") {
          await http.post("/task/createTask", task.value);
        } else if (props.type == "edit") {
          await http.put("/task/updateTask", task.value);
        } else {
          await http.put("/aiTask/updateAITask", task.value);
        }
        task.value = {
          title: "",
          description: "",
          category_id: undefined,
          is_ai_generated: 0,
          is_recurring: 0,
          recurring_rule: undefined,
          status: "PENDING",
          difficulty: undefined,
          tag_id_1: undefined,
          tag_id_2: undefined,
          due_time: undefined,
        };
        emit("refresh");
        emit("close");
        uni.showToast({
          title: `${props.type == "create" ? "添加" : "修改"}成功`,
          icon: "success",
          duration: 2000,
        });
      } catch (error) {
        console.log("添加失败", error);
      }
    } else {
      console.log("表单验证失败", errors);
    }
  });
};

onShow(() => {
  if (props.task) {
    task.value = props.task;
  }
});
</script>

<style scoped lang="scss">
.task-create {
  background-color: var(--bg-third-color);
  padding: 20rpx;
  padding-bottom: 155rpx;
  overflow: auto;
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;

  &_header {
    font-size: var(--fontSize-large);
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  &_back {
    position: absolute;
    top: 25rpx;
    left: 25rpx;
    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }
  }
}

.add-task-form {
  background-color: var(--bg-color);
  border-radius: 30rpx;
  padding: 10rpx 30rpx;
  overflow-y: auto;
  box-shadow: var(--shadow);

  .form-item {
    border: 3rpx solid #c6c0b3;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    background-color: var(--bg-color);
    font-size: var(--fontSize-normal);
  }
}

.reward-count {
  .title {
    font-size: var(--fontSize-normal);
    margin-top: 10rpx;
  }
  .tip {
    color: var(--text-light-color);
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

.add-operation {
  margin: 20rpx 0;

  .operation-btn {
    border: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: var(--fontSize-big);
    width: 80%;
  }
}
</style>
