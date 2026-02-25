import { Inventory } from "@/type/item.ts";
import db from "../shared/db.ts";
import sequelize from "@/shared/sequelize.ts";
import { Transaction } from "sequelize";
import chalk from "chalk";

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
      { transaction: t },
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
      { transaction: t },
    );
  }

  // 增加宠物经验
  async addPetExp(user_id: any, exp: any, t?: Transaction) {
    const pet = await db.Pets.findOne({ where: { user_id } });
    if (!pet) {
      return null;
    }
    // 当前宠物亲密度是否合格：<50
    const isAffectionLow = pet.dataValues.affection! < 50;

    if (isAffectionLow) {
      return null; // 亲密度不足，不增加经验值
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

  // 定时任务，每30分钟，让宠物饱食度和亲密度下降5点
  async decreasePetSatiety() {
    try {
      const pets = await db.Pets.findAll();
      if (pets.length === 0) {
        console.log("没有找到任何宠物，跳过状态更新");
        return;
      }
      // 对每个宠物减少饱食度和亲密度
      for (const pet of pets) {
        // 确保饱食度和亲密度不低于0
        const newHunger = Math.max(0, pet.dataValues.hunger! - 5);
        const newAffection = Math.max(0, pet.dataValues.affection! - 5);

        await pet.update({
          hunger: newHunger,
          affection: newAffection,
        });
        await pet.reload();
      }
      console.log(
        chalk.yellow(
          `[${new Date()}] 定时任务执行：所有宠物的饱食度和亲密度已下降5点`,
        ),
      );
    } catch (error: any) {
      console.error(chalk.red("定时任务执行失败:", error));
      throw new Error(error.message || "批量更新宠物状态失败");
    }
  }

  async play(userId: number) {
    // 增加10点亲密值，减少5点饥饿值
  }
}
