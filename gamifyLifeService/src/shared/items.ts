import { Item } from "@/type/item.ts";
const items: Item[] = [
  {
    type: "FOOD",
    name: "初级宠物口粮",
    description: "普通的宠物口粮，恢复20点饥饿值，增加50点宠物经验",
    icon_url: "/icons/food/basic_pet_food.png",
    price: 50,
    status: "ON_SHELF",
    effect: {
      hunger: -20,
      petExp: 50,
    },
  },
  {
    type: "FOOD",
    name: "中级宠物口粮",
    description: "优质宠物口粮，恢复50点饥饿值，增加150点宠物经验",
    icon_url: "/icons/food/mid_pet_food.png",
    price: 150,
    status: "ON_SHELF",
    effect: {
      hunger: -50,
      petExp: 150,
    },
  },
  {
    type: "FOOD",
    name: "高级宠物口粮",
    description:
      "珍稀宠物口粮，恢复100点饥饿值，增加300点宠物经验，额外提升5点亲密度",
    icon_url: "/icons/food/high_pet_food.png",
    price: 500,
    status: "ON_SHELF",
    effect: {
      hunger: -100,
      petExp: 300,
      intimacy: 5,
    },
  },
];
export default items;
