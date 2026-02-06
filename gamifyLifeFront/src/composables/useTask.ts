import { ref } from "vue";
import http from "@/utils/http";
import type { TaskTag, TaskCategory, Task } from "@/type/task";
import { saveUserData } from "@/utils/growthCal";

export function useTask() {
  // 任务分类
  const taskCategories = ref<TaskCategory[] | null>(null);
  // 任务标签
  const tags = ref<TaskTag[] | null>();

  const taskList = ref<Task[] | null>(null);

  const getTaskCategories = async () => {
    taskCategories.value = await http.get<TaskCategory[]>("/api/taskCategory/");
  };

  const getTags = async () => {
    tags.value = await http.get<TaskTag[] | null>("/api/taskTag/");
  };

  const getTaskList = async () => {
    taskList.value = await http.get("/api/task/");
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
