import type { Task } from "@/type/task.ts";
import { DataTypes as SequelizeDataTypes, Sequelize, Model } from "sequelize";
import db from "../shared/db.ts";
import { Inventory, Item } from "@/type/item.ts";

export default (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) => {
  class UserInventories extends Model<Inventory, Inventory> {
    static associate(models: typeof db) {
      this.belongsTo(models.Items, {
        foreignKey: "item_id",
        as: "item",
      });
    }
  }

  UserInventories.init(
    {
      // 库存ID
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      // 所属用户ID（外键关联User表）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "user_accounts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      // 道具ID（外键关联Item表）
      item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      // 道具数量（消耗品，非负）
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "user_inventories",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,
    },
  );

  return UserInventories;
};
