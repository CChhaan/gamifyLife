import { Inventory } from "@/type/item.ts";
import db from "../shared/db.ts";
import sequelize from "@/shared/sequelize.ts";

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
          where: {
            user_id: userId,
            item_id: item.id!,
          },
          transaction: t,
        });

        if (existingItem) {
          // 道具已存在，累加数量
          await existingItem.update(
            {
              quantity: existingItem.dataValues.quantity + item.quantity,
            },
            { transaction: t },
          );
        } else {
          // 道具不存在，创建新记录
          await db.UserInventories.create(
            {
              user_id: userId,
              item_id: item.id!,
              quantity: item.quantity,
            },
            { transaction: t },
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
        where: {
          user_id: userId,
        },
        include: [
          {
            model: db.Items,
            as: "item",
          },
        ],
      });
      return items;
    } catch (error: any) {
      console.error("获取用户道具失败", error);
      throw new Error(error.message || "获取用户道具失败");
    }
  }
}
