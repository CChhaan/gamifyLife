<template>
  <view class="task-create-ctn">
    <view class="task-create-header">创建任务</view>
    <view class="back" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>

    <view class="add-task-form">
      <u-form
        :model="task"
        ref="taskCreateForm"
        :rules="taskCreateRules"
        label-width="200"
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
          ></u-input>
        </u-form-item>
        <!-- <u-form-item label="父级任务" prop="parent_task_id"></u-form-item> -->
        <u-form-item label="是否重复任务" prop="is_recurring">
          <u-switch v-model="task.is_recurring"></u-switch>
        </u-form-item>
        <u-form-item
          label="重复规则"
          prop="recurring_rule"
          v-show="task.is_recurring"
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
          ></u-input>
        </u-form-item>
      </u-form>
      <view class="add-operation">
        <button class="operation-btn" @click="submitTask">创建</button>
      </view>
    </view>

    <view class="ai-create">
      <button>AI</button>
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
import type { Task, TaskCategory, TaskTag } from "@/type/task";
import http from "@/utils/http";
import dayjs from "dayjs";
import { computed, ref } from "vue";

const taskCreateForm = ref();

const props = defineProps<{
  categories: TaskCategory[];
  tags: TaskTag[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const task = ref<Task>({
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

const submitTask = async () => {
  taskCreateForm.value.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      try {
        await http.post("/api/task/createTask", task.value);
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
        emit("close");
        uni.showToast({ title: "添加成功", icon: "success", duration: 2000 });
      } catch (error) {
        console.log("添加失败", error);
      }
    } else {
      console.log("表单验证失败", errors);
    }
  });
};
</script>

<style scoped lang="scss">
.task-create-ctn {
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

.task-create-header {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
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
.add-task-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #ffffef;
  border-radius: 30rpx;
  padding: 20rpx;
  box-sizing: border-box;
  overflow: auto;

  .form-item {
    // box-shadow: inset 0 0 4rpx 5rpx #f5f5f5;
    // margin-bottom: 40rpx;
    border: 3rpx solid #c6c0b3;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    background-color: #fff;
    font-size: 32rpx;
  }
}

.add-operation {
  width: 100%;
  /* display: flex;
  justify-content: space-between; */
  margin: 20rpx;
}

.operation-btn {
  border: none;
  color: #fff;
  background-color: var(--primary-color);
  font-size: 36rpx;
  width: 80%;
}

.ai-create {
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
    background-color: var(--contrast-color);
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}
</style>
