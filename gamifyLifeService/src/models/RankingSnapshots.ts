import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { IRankingSnapshot } from "@/type/ranking.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class RankingSnapshots extends Model<IRankingSnapshot, IRankingSnapshot> {
    static associate(models: typeof db) {
      this.hasMany(models.RankingDetails, {
        foreignKey: "snapshot_id", // 重点：用同一个 snapshot_id
        sourceKey: "id",
        as: "details",
      });
    }
  }

  RankingSnapshots.init(
    {
      // id：快照ID，无符号整数，非空，主键，自增
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "快照ID",
      },
      // ranking_type：榜单类型，枚举类型，非空
      ranking_type: {
        type: DataTypes.ENUM(
          "EXP",
          "ATTR_SINGLE",
          "ATTR_ALL",
          "EXP_PET",
          "GOLD",
        ),
        allowNull: false,
        comment: "榜单类型",
      },
      // cycle_type：周期类型，枚举类型，非空
      cycle_type: {
        type: DataTypes.ENUM("WEEKLY", "MONTHLY", "YEAR"),
        allowNull: false,
        comment: "周期类型",
      },
      // snapshot_time：快照生成时间，时间戳，非空，默认当前时间
      snapshot_time: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "快照生成时间",
      },
    },
    {
      sequelize,
      tableName: "ranking_snapshots",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return RankingSnapshots;
};
