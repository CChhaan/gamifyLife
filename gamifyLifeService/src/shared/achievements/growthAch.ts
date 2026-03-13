import { Achievement } from "@/type/achievement.js";

const levelAch: Achievement[] = [
  {
    id: 801,
    title: "初出茅庐",
    description: "等级达到 10 级",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "level", count: 10 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 802,
    title: "崭露头角",
    description: "等级达到 20 级",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "level", count: 20 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 803,
    title: "渐入佳境",
    description: "等级达到 30 级",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "level", count: 30 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 804,
    title: "独当一面",
    description: "等级达到 50 级",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "level", count: 50 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 805,
    title: "一代宗师",
    description: "等级达到 80 级",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "level", count: 80 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const attrSingleAch: Achievement[] = [
  {
    id: 901,
    title: "属性初成",
    description: "任意一项属性达到 50",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_single", count: 50 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 902,
    title: "专精一域",
    description: "任意一项属性达到 100",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_single", count: 100 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 903,
    title: "登峰造极",
    description: "任意一项属性达到 200",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_single", count: 200 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const attrAllAch: Achievement[] = [
  {
    id: 1001,
    title: "全面发展",
    description: "四维属性均达到 50",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_all", count: 50 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1002,
    title: "全能高手",
    description: "四维属性均达到 100",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_all", count: 100 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 1003,
    title: "完美均衡",
    description: "四维属性均达到 200",
    type: "GROWTH",
    condition_logic: "AND",
    conditions: [{ type: "attr_all", count: 200 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

export default [...levelAch, ...attrSingleAch, ...attrAllAch];
