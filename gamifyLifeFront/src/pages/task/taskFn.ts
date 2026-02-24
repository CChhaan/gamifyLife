import type { Task } from "@/type/task";

// 判断任务是否以逾期
export function isOverdue(task: Task) {
  return (
    task.due_time &&
    new Date(task.due_time) < new Date() &&
    task.status == "PENDING"
  );
}
