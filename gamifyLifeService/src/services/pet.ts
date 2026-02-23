import { Inventory } from "@/type/item.ts";
import db from "../shared/db.ts";
import sequelize from "@/shared/sequelize.ts";
import { Transaction } from "sequelize";

export default class ItemService {
  // 获取当前宠物信息
  async getPetInfo(user_id: any) {
    const petInfo = await db.Pets.findOne({ where: { user_id } });
    return petInfo;
  }

  // 创建宠物
  async createPet(user_id: any, pet_name: any) {
    const petInfo = await db.Pets.create({ user_id, nickname: pet_name });
    return petInfo;
  }

  // 增加宠物亲密度
  async addPetLove(user_id: any, love: any, t?: Transaction) {
    const pet = await db.Pets.findOne({ where: { user_id } });
    if (!pet) {
      return null;
    }
    // 更新宠物的亲密度
    await pet.update(
      { affection: Math.min(100, pet.dataValues.affection! + love) },
      { transaction: t }
    );
  }

  // 增加宠物饱食度
  async addPetSatiety(user_id: any, satiety: any, t?: Transaction) {
    const pet = await db.Pets.findOne({ where: { user_id } });
    if (!pet) {
      return null;
    }
    await pet.update(
      { hunger: Math.min(100, pet.dataValues.hunger! - satiety) },
      { transaction: t }
    );
  }

  // 增加宠物经验
  async addPetExp(user_id: any, exp: any, t?: Transaction) {
    const pet = await db.Pets.findOne({ where: { user_id } });
    if (!pet) {
      return null;
    }
    // 计算新的经验值
    const newExp = pet.dataValues.exp! + exp;
    // 计算新的等级
    const newLevel = pet.dataValues.level! + Math.floor(newExp / 100);
    // 计算最终的经验值（0-99之间）
    const finalExp = newExp % 100;

    // 更新宠物的经验值和等级
    await pet.update({ exp: finalExp, level: newLevel }, { transaction: t });
  }
}
