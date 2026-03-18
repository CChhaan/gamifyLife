import { Achievement } from "@/type/achievement.js";

const goldHaveAch: Achievement[] = [
  {
    id: 601,
    title: "小有积蓄",
    description: "获得1000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "gold", count: 1000 }],
    rewards: [
      { type: "exp", amount: 100 },
      { type: "coin", amount: 100 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 602,
    title: "富甲一方",
    description: "获得5000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "gold", count: 5000 }],
    rewards: [
      { type: "exp", amount: 500 },
      { type: "coin", amount: 500 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 603,
    title: "腰缠万贯",
    description: "获得10000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "gold", count: 10000 }],
    rewards: [
      { type: "exp", amount: 1000 },
      { type: "coin", amount: 1000 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 604,
    title: "财富大亨",
    description: "获得50000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "gold", count: 50000 }],
    rewards: [
      { type: "exp", amount: 5000 },
      { type: "coin", amount: 5000 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const goldConsumeAch: Achievement[] = [
  {
    id: 701,
    title: "初次消费",
    description: "消费50金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "consume", count: -50 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 702,
    title: "慷慨解囊	",
    description: "消费2000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "consume", count: -2000 }],
    rewards: [
      { type: "exp", amount: 20 },
      { type: "coin", amount: 20 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 703,
    title: "挥金如土",
    description: "消费10000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "consume", count: -10000 }],
    rewards: [
      { type: "exp", amount: 30 },
      { type: "coin", amount: 30 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 704,
    title: "消费宗师",
    description: "消费50000金币",
    type: "GOLD",
    condition_logic: "AND",
    conditions: [{ type: "consume", count: -50000 }],
    rewards: [
      { type: "exp", amount: 40 },
      { type: "coin", amount: 40 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

export default [...goldHaveAch, ...goldConsumeAch];
