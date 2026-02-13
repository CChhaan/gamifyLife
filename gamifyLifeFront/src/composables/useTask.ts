import { ref } from "vue";
import http from "@/utils/http";
import type { TaskTag, TaskCategory, Task } from "@/type/task";
import { saveUserData } from "@/utils/growthCal";
import dayjs from "dayjs";

export function useTask() {
  // 任务分类
  const taskCategories = ref<TaskCategory[] | null>(null);
  // 任务标签
  const tags = ref<TaskTag[] | null>();

  // 任务列表
  const taskList = ref<Task[] | null>(null);

  const getTaskCategories = async () => {
    taskCategories.value = await http.get<TaskCategory[]>("/taskCategory/");
  };

  const getTags = async () => {
    tags.value = await http.get<TaskTag[] | null>("/taskTag/");
  };

  const getTaskList = async () => {
    taskList.value = await http.get("/task/");
    taskList.value?.forEach((task) => {
      task.due_time = dayjs(task.due_time).format("YYYY-MM-DD HH:mm");
    });
  };

  const loadTaskData = async () => {
    await Promise.all([getTaskCategories(), getTags(), getTaskList()]);
  };

  return {
    taskCategories,
    tags,
    taskList,
    getTaskCategories,
    getTags,
    getTaskList,
    loadTaskData,
  };
}
