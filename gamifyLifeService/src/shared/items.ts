import { Item } from "@/type/item.ts";
const items: Item[] = [
  {
    type: "FOOD",
    name: "初级宠物口粮",
    description: "普通的宠物口粮，恢复5点饥饿值，增加10点宠物经验",
    icon_url: "/icons/food/basic_pet_food.png",
    price: 25,
    status: "ON_SHELF",
    effect: { hunger: -5, petExp: 10 },
  },
  {
    type: "FOOD",
    name: "中级宠物口粮",
    description: "优质宠物口粮，恢复10点饥饿值，增加20点宠物经验",
    icon_url: "/icons/food/mid_pet_food.png",
    price: 200,
    status: "ON_SHELF",
    effect: { hunger: -10, petExp: 20 },
  },
  {
    type: "FOOD",
    name: "高级宠物口粮",
    description:
      "珍稀宠物口粮，恢复15点饥饿值，增加30点宠物经验，额外提升5点亲密度",
    icon_url: "/icons/food/high_pet_food.png",
    price: 1000,
    status: "ON_SHELF",
    effect: { hunger: -15, petExp: 30, petIntimacy: 5 },
  },
];
export default items;
