import { Inventory } from "@/type/item.js";
import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
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
      { hunger: Math.min(100, pet.dataValues.hunger! + Math.abs(satiety)) },
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

  // 减少宠物饱食度
  async decreasePetSatiety(pet: any, satiety: any, t?: Transaction) {
    await pet.update(
      { hunger: Math.max(0, pet.dataValues.hunger! - Math.abs(satiety)) },
      { transaction: t },
    );
  }

  // 减少宠物亲密度
  async decreasePetLove(pet: any, love: any, t?: Transaction) {
    await pet.update(
      { affection: Math.max(0, pet.dataValues.affection! - love) },
      { transaction: t },
    );
  }

  // 定时任务，每30分钟，让宠物饱食度和亲密度下降5点
  async decreasePetStatus() {
    const t = await sequelize.transaction();
    try {
      const pets = await db.Pets.findAll();
      if (pets.length === 0) {
        console.log("没有找到任何宠物，跳过状态更新");
        return;
      }
      // 对每个宠物减少饱食度和亲密度
      for (const pet of pets) {
        // 确保饱食度和亲密度不低于0
        await this.decreasePetSatiety(pet, 5, t);
        await this.decreasePetLove(pet, 5, t);
      }
      console.log(
        chalk.yellow(
          `[${new Date()}] 定时任务执行：所有宠物的饱食度和亲密度已下降5点`,
        ),
      );
      await t.commit();
    } catch (error: any) {
      await t.rollback();
      console.error(chalk.red("定时任务执行失败:", error));
      throw new Error(error.message || "批量更新宠物状态失败");
    }
  }

  async play(user_id: any, count: number) {
    const t = await sequelize.transaction();
    try {
      // 获取宠物信息
      const pet = await db.Pets.findOne({ where: { user_id } });
      if (!pet) {
        return null;
      }
      // 宠物饥饿度减少
      this.decreasePetSatiety(pet, 5, t);
      //count 0-20
      switch (Math.floor(count / 5)) {
        // 小于1的话宠物不满意，亲密度减少
        case 0:
          await pet.decrement({ affection: 5 });
          break;
        // 1-2的话宠物满意，亲密度增加
        case 1:
        case 2:
          await this.addPetLove(user_id, 5, t);
          break;
        // 3到4增加宠物经验和亲密度
        case 3:
        case 4:
          await this.addPetExp(user_id, 10, t);
          await this.addPetLove(user_id, 10, t);
          break;
      }
      await t.commit();
    } catch (error: any) {
      await t.rollback();
      console.error(chalk.red("获得玩耍奖励失败:", error));
      throw new Error(error.message || "获得玩耍奖励失败");
    }
  }
}
