import { Achievement } from "@/type/achievement.js";

const taskDayAch: Achievement[] = [
  {
    id: 1101,
    title: "坚持三天",
    description: "连续 3 天完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_day", count: 3 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1102,
    title: "一周坚守",
    description: "连续 7 天完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_day", count: 7 }],
    rewards: [
      { type: "exp", amount: 20 },
      { type: "coin", amount: 20 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1103,
    title: "半月恒心",
    description: "连续 14 天完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_day", count: 14 }],
    rewards: [
      { type: "exp", amount: 50 },
      { type: "coin", amount: 50 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1104,
    title: "月度达人",
    description: "连续 30 天完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_day", count: 30 }],
    rewards: [
      { type: "exp", amount: 100 },
      { type: "coin", amount: 100 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskDayCompleteAch: Achievement[] = [
  {
    id: 1201,
    title: "高效坚持",
    description: "连续 3 天，每天完成超过 5 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [
      { type: "task_day", count: 3 },
      { type: "task_count", count: 5 },
    ],
    rewards: [
      { type: "exp", amount: 200 },
      { type: "coin", amount: 200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1202,
    title: "每日高产",
    description: "连续 7 天，每天完成超过 10 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [
      { type: "task_day", count: 7 },
      { type: "task_count", count: 10 },
    ],
    rewards: [
      { type: "exp", amount: 200 },
      { type: "coin", amount: 200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskHighLevelAch: Achievement[] = [
  {
    id: 1301,
    title: "挑战新手",
    description: "完成 5 个高难度任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_high_level", count: 5 }],
    rewards: [
      { type: "exp", amount: 200 },
      { type: "coin", amount: 200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1302,
    title: "挑战能手",
    description: "完成 20 个高难度任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_high_level", count: 20 }],
    rewards: [
      { type: "exp", amount: 400 },
      { type: "coin", amount: 400 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1303,
    title: "挑战大师",
    description: "完成 50 个高难度任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_high_level", count: 50 }],
    rewards: [
      { type: "exp", amount: 800 },
      { type: "coin", amount: 800 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskRecurAch: Achievement[] = [
  {
    id: 1401,
    title: "日常熟手",
    description: "完成 10 个每日循环任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_recur", count: 5 }],
    rewards: [
      { type: "exp", amount: 100 },
      { type: "coin", amount: 100 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1402,
    title: "日常专家",
    description: "完成 50 个每日循环任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_recur", count: 50 }],
    rewards: [
      { type: "exp", amount: 200 },
      { type: "coin", amount: 200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1403,
    title: "日常王者",
    description: "完成 100 个每日循环任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_recur", count: 100 }],
    rewards: [
      { type: "exp", amount: 400 },
      { type: "coin", amount: 400 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskCategoryAch: Achievement[] = [
  {
    id: 1501,
    title: "初涉多域",
    description: "在 3 个不同分类下完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_category", count: 3 }],
    rewards: [
      { type: "exp", amount: 100 },
      { type: "coin", amount: 100 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1502,
    title: "多面能手",
    description: "在 5 个不同分类下完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_category", count: 5 }],
    rewards: [
      { type: "exp", amount: 200 },
      { type: "coin", amount: 200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1503,
    title: "全领域者",
    description: "在 10 个不同分类下完成任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_category", count: 10 }],
    rewards: [
      { type: "exp", amount: 400 },
      { type: "coin", amount: 400 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskTotalAch: Achievement[] = [
  {
    id: 1601,
    title: "初次启程",
    description: "首次完成任意任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 1 }],
    rewards: [
      { type: "exp", amount: 800 },
      { type: "coin", amount: 800 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1602,
    title: "任务新人",
    description: "累计完成 10 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 10 }],
    rewards: [
      { type: "exp", amount: 800 },
      { type: "coin", amount: 800 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1603,
    title: "任务熟手",
    description: "累计完成 50 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 50 }],
    rewards: [
      { type: "exp", amount: 1600 },
      { type: "coin", amount: 1600 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1604,
    title: "任务狂人",
    description: "累计完成 200 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 200 }],
    rewards: [
      { type: "exp", amount: 3200 },
      { type: "coin", amount: 3200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1605,
    title: "任务传奇",
    description: "累计完成 500 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 500 }],
    rewards: [
      { type: "exp", amount: 6400 },
      { type: "coin", amount: 6400 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskAiAch: Achievement[] = [
  {
    id: 1701,
    title: "AI 助手初体验",
    description: "使用 AI 生成并完成 5 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_ai_total", count: 5 }],
    rewards: [
      { type: "exp", amount: 12800 },
      { type: "coin", amount: 12800 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1702,
    title: "AI 协作达人",
    description: "使用 AI 生成并完成 20 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_ai_total", count: 20 }],
    rewards: [
      { type: "exp", amount: 25600 },
      { type: "coin", amount: 25600 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1703,
    title: "AI 智能搭档",
    description: "使用 AI 生成并完成 50 个任务",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_ai_total", count: 50 }],
    rewards: [
      { type: "exp", amount: 51200 },
      { type: "coin", amount: 51200 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const taskSingleAch: Achievement[] = [
  {
    id: 1801,
    title: "熟能生巧",
    description: "单个任务完成 10 次",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 10 }],
    rewards: [
      { type: "exp", amount: 800 },
      { type: "coin", amount: 800 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1802,
    title: "百炼成钢",
    description: "单个任务完成 50 次",
    type: "TASK",
    condition_logic: "AND",
    conditions: [{ type: "task_total", count: 50 }],
    rewards: [
      { type: "exp", amount: 1600 },
      { type: "coin", amount: 1600 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

export default [
  // ...taskDayAch,
  // ...taskDayCompleteAch,
  ...taskHighLevelAch,
  // ...taskRecurAch,
  // ...taskCategoryAch,
  ...taskTotalAch,
  ...taskAiAch,
  ...taskSingleAch,
];
