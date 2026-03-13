import { Achievement } from "@/type/achievement.js";

const petLevelAch: Achievement[] = [
  {
    id: 301,
    title: "初露锋芒",
    description: "宠物等级达到 5 级",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_level", count: 10 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
      { type: "pet_level", amount: 5 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 302,
    title: "茁壮成长",
    description: "宠物等级达到 15 级",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_level", count: 20 }],
    rewards: [
      { type: "exp", amount: 20 },
      { type: "coin", amount: 20 },
      { type: "pet_level", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 303,
    title: "亲密伙伴",
    description: "宠物等级达到 30 级",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_level", count: 35 }],
    rewards: [
      { type: "exp", amount: 40 },
      { type: "coin", amount: 40 },
      { type: "pet_level", amount: 15 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 304,
    title: "忠实战友",
    description: "宠物等级达到 50 级",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_level", count: 50 }],
    rewards: [
      { type: "exp", amount: 60 },
      { type: "coin", amount: 60 },
      { type: "pet_level", amount: 25 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const petEvolveAch: Achievement[] = [
  {
    id: 401,
    title: "初次蜕变",
    description: "宠物完成第一次成长阶段晋升",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_evolve", count: 1 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
      { type: "pet_level", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 402,
    title: "形态进化",
    description: "宠物完成第二次成长阶段晋升",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_evolve", count: 2 }],
    rewards: [
      { type: "exp", amount: 20 },
      { type: "coin", amount: 20 },
      { type: "pet_level", amount: 20 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
  {
    id: 403,
    title: "完全体",
    description: "宠物完成第三次成长阶段晋升",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet_evolve", count: 3 }],
    rewards: [
      { type: "exp", amount: 30 },
      { type: "coin", amount: 30 },
      { type: "pet_level", amount: 30 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

const getPetAch: Achievement[] = [
  {
    id: 501,
    title: "第一只伙伴",
    description: "获得你的第一只宠物",
    type: "PET",
    condition_logic: "AND",
    conditions: [{ type: "pet", count: 1 }],
    rewards: [
      { type: "exp", amount: 10 },
      { type: "coin", amount: 10 },
      { type: "pet_level", amount: 10 },
    ],
    is_hidden: 0,
    is_active: 1,
  },
];

export default [...petLevelAch, ...petEvolveAch, ...getPetAch];
