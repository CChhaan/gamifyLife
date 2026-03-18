import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.js";
import type { IRankingDetail } from "@/type/ranking.js";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class RankingDetails extends Model<IRankingDetail, IRankingDetail> {
    static associate(models: typeof db) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      this.belongsTo(models.UserInfo, {
        foreignKey: "user_id", // 重点：用同一个 user_id
        targetKey: "user_id", // UserInfo 里的字段是 user_id
        as: "userInfo",
      });
      this.belongsTo(models.RankingSnapshots, {
        foreignKey: "snapshot_id", // 重点：用同一个 user_id
        targetKey: "id", // UserInfo 里的字段是 user_id
        as: "rankingSnapshot",
      });
    }
  }

  RankingDetails.init(
    {
      // id：详情ID，无符号大整数，非空，主键，自增
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "详情ID",
      },
      // snapshot_id：所属快照ID，外键，非空
      snapshot_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "所属快照ID",
        // 外键约束（可选，数据库层面的约束）
        references: {
          model: "ranking_snapshots", // 关联的表名
          key: "id", // 关联的字段
        },
        onDelete: "CASCADE", // 快照删除时，详情也删除（根据业务调整）
        onUpdate: "CASCADE", // 快照ID更新时，详情同步更新
      },
      // user_id：上榜用户ID，外键，非空
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "上榜用户ID",
        // 若有用户表，可添加外键约束
        references: { model: "user_accounts", key: "id" },
        onDelete: "CASCADE", // 用户删除时，详情也删除（根据业务调整）
        onUpdate: "CASCADE", // 用户ID更新时，详情同步更新
      },
      // rank：排名，无符号小整数，非空
      rank: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        comment: "排名",
      },
      // score：得分，无符号整数，非空
      score: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "得分（属性总值/经验增幅）",
      },
      // metadata：附加信息，JSON 类型，允许 null，默认 null
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        comment: "附加信息",
      },
    },
    {
      sequelize,
      tableName: "ranking_details",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return RankingDetails;
};
