import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.ts";
import { Item } from "@/type/item.ts";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class Items extends Model<Item, Item> {
    static associate(models: typeof db) {
      this.hasMany(models.UserInventories, {
        foreignKey: "item_id",
        as: "inventories",
      });
    }
  }

  Items.init(
    {
      // 道具ID
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      // 道具类型
      type: {
        type: DataTypes.ENUM("FOOD", "POTION", "TICKET", "OTHER"),
        allowNull: false,
        defaultValue: "OTHER",
      },
      // 道具名称
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // 道具描述
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null,
      },
      // 图标地址
      icon_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      // 售价（金币）
      price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      // 上架状态
      status: {
        type: DataTypes.ENUM("ON_SHELF", "OFF_SHELF"),
        allowNull: false,
        defaultValue: "ON_SHELF",
      },
      // 使用效果JSON
      effect: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: "items",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
      indexes: [
        {
          name: "items_name_unique", // 固定索引名称
          unique: true,
          fields: ["name"],
        },
      ],
    },
  );

  return Items;
};
