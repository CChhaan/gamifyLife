import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class TaskTags extends Model {
    static associate(models) {
      this.belongsTo(models.UserAccounts, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  TaskTags.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "标签ID",
      },

      // 2. 所属用户ID（外键、无符号整数）
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        comment: "所属用户ID",
        references: {
          model: "user_accounts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // 3. 标签名称（用户内唯一）
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "标签名称（用户内唯一）",
      },

      // 4. 主影响属性（枚举类型，固定可选值）
      primary_attr: {
        type: DataTypes.ENUM("mind", "body", "social", "discipline"),
        allowNull: false,
        comment:
          "主影响属性（mind:心智/body:身体/social:社交/discipline:自律）",
      },

      // 5. 副影响属性（可选枚举，默认NULL）
      secondary_attr: {
        type: DataTypes.ENUM("mind", "body", "social", "discipline"),
        allowNull: true,
        defaultValue: null,
        comment: "副影响属性（可选，值同主影响属性）",
      },
    },
    {
      sequelize,
      tableName: "task_tags",
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      paranoid: true,

      indexes: [
        {
          unique: true,
          fields: ["user_id", "name"],
          name: "idx_user_tag_name_unique",
        },
      ],
    },
  );

  return TaskTags;
};
