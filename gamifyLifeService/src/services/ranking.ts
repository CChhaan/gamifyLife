import { CycleType, RankingType } from "@/type/ranking.js";
import db from "../shared/db.js";

export default class RankingService {
  // 每周定时汇总，生成排行榜
  async genWeeklyRank() {
    try {
      // 获取所有用户的周数据
      const accLogs = await db.UserAccLogs.findAll();
      // 获取所有宠物的周数据
      const pets = await db.Pets.findAll();

      // 金币排行榜
      const goldSnapshot = await db.RankingSnapshots.create({
        ranking_type: "GOLD",
        cycle_type: "WEEKLY",
        snapshot_time: new Date(),
      });

      // 按本周金币排序
      const goldRankings = accLogs
        .filter((log) => log.dataValues.weekly_gold! > 0)
        .sort((a, b) => b.dataValues.weekly_gold! - a.dataValues.weekly_gold!)
        .map((log, index) => ({
          snapshot_id: goldSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.weekly_gold!,
        }));

      await db.RankingDetails.bulkCreate(goldRankings);

      // 宠物经验排行榜
      const petExpSnapshot = await db.RankingSnapshots.create({
        ranking_type: "EXP_PET",
        cycle_type: "WEEKLY",
        snapshot_time: new Date(),
      });

      // 按本周宠物经验排序（假设有 weekly_pet_exp 字段）
      const petExpRankings = pets
        .filter((pet) => pet.dataValues.weekly_exp! > 0)
        .sort((a, b) => b.dataValues.weekly_exp! - a.dataValues.weekly_exp!)
        .map((log, index) => ({
          snapshot_id: petExpSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.weekly_exp!,
        }));

      await db.RankingDetails.bulkCreate(petExpRankings);

      // 经验排行榜
      const expSnapshot = await db.RankingSnapshots.create({
        ranking_type: "EXP",
        cycle_type: "WEEKLY",
        snapshot_time: new Date(),
      });

      // 按本周经验排序
      const expRankings = accLogs
        .filter((log) => log.dataValues.weekly_experience! > 0)
        .sort(
          (a, b) =>
            b.dataValues.weekly_experience! - a.dataValues.weekly_experience!,
        )
        .map((log, index) => ({
          snapshot_id: expSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.weekly_experience!,
        }));

      await db.RankingDetails.bulkCreate(expRankings);
    } catch (error: any) {
      console.error("生成周排行失败", error);
      throw new Error(error.message || "生成周排行失败");
    }
  }

  // 每月定时汇总，生成排行榜
  async genMonthlyRank() {
    try {
      // 获取所有用户的月数据
      const accLogs = await db.UserAccLogs.findAll();
      // 获取所有宠物的月数据
      const pets = await db.Pets.findAll();

      // 金币排行榜
      const goldSnapshot = await db.RankingSnapshots.create({
        ranking_type: "GOLD",
        cycle_type: "MONTHLY",
        snapshot_time: new Date(),
      });

      // 按本月金币排序
      const goldRankings = accLogs
        .filter((log) => log.dataValues.monthly_gold! > 0)
        .sort((a, b) => b.dataValues.monthly_gold! - a.dataValues.monthly_gold!)
        .map((log, index) => ({
          snapshot_id: goldSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.monthly_gold!,
        }));

      await db.RankingDetails.bulkCreate(goldRankings);

      // 宠物经验排行榜
      const petExpSnapshot = await db.RankingSnapshots.create({
        ranking_type: "EXP_PET",
        cycle_type: "MONTHLY",
        snapshot_time: new Date(),
      });

      // 按本月宠物经验排序（假设有 monthly_pet_exp 字段）
      const petExpRankings = pets
        .filter((pet) => pet.dataValues.monthly_exp! > 0)
        .sort((a, b) => b.dataValues.monthly_exp! - a.dataValues.monthly_exp!)
        .map((log, index) => ({
          snapshot_id: petExpSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.monthly_exp!,
        }));

      await db.RankingDetails.bulkCreate(petExpRankings);

      // 经验排行榜
      const expSnapshot = await db.RankingSnapshots.create({
        ranking_type: "EXP",
        cycle_type: "MONTHLY",
        snapshot_time: new Date(),
      });

      // 按本月经验排序
      const expRankings = accLogs
        .filter((log) => log.dataValues.monthly_experience! > 0)
        .sort(
          (a, b) =>
            b.dataValues.monthly_experience! - a.dataValues.monthly_experience!,
        )
        .map((log, index) => ({
          snapshot_id: expSnapshot.dataValues.id!,
          user_id: log.dataValues.user_id,
          rank: index + 1,
          score: log.dataValues.monthly_experience!,
        }));

      await db.RankingDetails.bulkCreate(expRankings);
    } catch (error: any) {
      console.error("生成月排行失败", error);
      throw new Error(error.message || "生成月排行失败");
    }
  }

  // 获取指定类型的排行榜数据
  async getRanking(
    rankingType: RankingType,
    cycleType: CycleType,
    userId?: number,
  ) {
    try {
      const where = userId ? { user_id: userId } : {};
      // 获取最新的排行榜快照
      const snapshots = await db.RankingSnapshots.findAll({
        where: { ...where, ranking_type: rankingType, cycle_type: cycleType },
        order: [["snapshot_time", "DESC"]],
        include: [
          {
            model: db.RankingDetails,
            as: "details",
            include: [{ model: db.UserInfo, as: "userInfo" }],
          },
        ],
      });

      if (!snapshots) {
        throw new Error("未找到排行榜数据");
      }

      return snapshots;
    } catch (error: any) {
      console.error("获取排行榜失败", error);
      throw new Error(error.message || "获取排行榜失败");
    }
  }

  // 获取所有类型的最新排行榜
  async getAllRankings() {
    try {
      const rankings = await Promise.all([
        this.getRanking(RankingType.EXP, CycleType.WEEKLY),
        this.getRanking(RankingType.EXP_PET, CycleType.WEEKLY),
        this.getRanking(RankingType.GOLD, CycleType.WEEKLY),
        this.getRanking(RankingType.EXP, CycleType.MONTHLY),
        this.getRanking(RankingType.EXP_PET, CycleType.MONTHLY),
        this.getRanking(RankingType.GOLD, CycleType.MONTHLY),
      ]);

      return rankings;
    } catch (error: any) {
      console.error("获取所有排行榜失败", error);
      throw new Error(error.message || "获取所有排行榜失败");
    }
  }

  // 获取某个用户的所有排行榜
  async getUserRankings(userId: number) {
    try {
      const rankings = await Promise.all([
        this.getRanking(RankingType.EXP, CycleType.WEEKLY, userId),
        this.getRanking(RankingType.EXP_PET, CycleType.WEEKLY, userId),
        this.getRanking(RankingType.GOLD, CycleType.WEEKLY, userId),
        this.getRanking(RankingType.EXP, CycleType.MONTHLY, userId),
        this.getRanking(RankingType.EXP_PET, CycleType.MONTHLY, userId),
        this.getRanking(RankingType.GOLD, CycleType.MONTHLY, userId),
      ]);

      return rankings;
    } catch (error: any) {
      console.error("获取用户所有排行榜失败", error);
      throw new Error(error.message || "获取用户所有排行榜失败");
    }
  }
}
