import { Inventory } from "@/type/item.ts";
import db from "../shared/db.ts";
import sequelize from "@/shared/sequelize.ts";

export default class ItemService {
  // 获取当前宠物信息
  async getPetInfo(user_id: any) {
    const petInfo = await db.Pets.findOne({
      where: {
        user_id,
      },
    });
    return petInfo;
  }
}
