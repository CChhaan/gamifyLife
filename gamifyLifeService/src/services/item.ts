import { Inventory } from "@/type/item.ts";
import db from "../shared/db.ts";
import sequelize from "@/shared/sequelize.ts";
import PetService from "../services/pet.ts";

import { Sequelize } from "sequelize";
const petService = new PetService();
export default class ItemService {
  // 获取系统所有道具
  async getSysItems() {
    try {
      const items = await db.Items.findAll();
      return items;
    } catch (error: any) {
      console.error("获取系统道具失败", error);
      throw new Error(error.message || "获取系统道具失败");
    }
  }

  // 用户购买系统道具
  async buySysItem(userId: number, items: Inventory[]) {
    const t = await sequelize.transaction();
    try {
      for (const item of items) {
        const existingItem = await db.UserInventories.findOne({
          where: { user_id: userId, item_id: item.id! },
          transaction: t,
        });

        if (existingItem) {
          // 道具已存在，累加数量
          await existingItem.increment(
            { quantity: item.quantity },
            { transaction: t }
          );
        } else {
          // 道具不存在，创建新记录
          await db.UserInventories.create(
            { user_id: userId, item_id: item.id!, quantity: item.quantity },
            { transaction: t }
          );
        }
      }
      await t.commit();
      return [];
    } catch (error: any) {
      await t.rollback();
      console.error("购买系统道具失败", error);
      throw new Error(error.message || "购买系统道具失败");
    }
  }

  // 获取用户道具
  async getUserItems(userId: number) {
    try {
      const items = await db.UserInventories.findAll({
        where: { user_id: userId },
        include: [{ model: db.Items, as: "item" }],
      });
      return items;
    } catch (error: any) {
      console.error("获取用户道具失败", error);
      throw new Error(error.message || "获取用户道具失败");
    }
  }

  // 使用道具 - 喂食
  async useFoodItem(userId: number, itemId: number) {
    const t = await sequelize.transaction();
    try {
      // 先找到用户所拥有的宠物
      const pet = await db.Pets.findOne({ where: { user_id: userId } });
      if (!pet) {
        throw new Error("用户没有宠物");
      }

      // 找到用户所拥有的道具
      const item = await db.UserInventories.findOne({
        where: { user_id: userId, item_id: itemId },
        include: [{ model: db.Items, as: "item" }],
      });

      if (!item) {
        throw new Error("用户没有该道具");
      }

      // 查看道具效果
      const effect = item.dataValues.item?.effect;

      // 如果宠物的饥饿值为100，返回
      if (pet.dataValues.hunger === 100) {
        throw new Error("宠物已经饱腹,无需喂食");
      }

      // 道具数量减一
      await item.decrement({ quantity: 1 }, { transaction: t });

      // 如果道具的作用有hunger属性
      if (effect?.hunger) {
        // 更新宠物的饥饿值
        await petService.addPetSatiety(userId, effect.hunger, t);
      }
      // 如果道具有petExp属性
      if (effect?.petExp) {
        await petService.addPetExp(userId, effect.petExp, t);
      }

      // 如果道具有petIntimacy属性
      if (effect?.petIntimacy) {
        await petService.addPetLove(userId, effect.petIntimacy, t);
      }
      await t.commit();
    } catch (error: any) {
      await t.rollback();
      console.error("使用道具失败", error);
      throw new Error(error.message || "使用道具失败");
    }
  }
}
