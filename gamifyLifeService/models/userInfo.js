import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserInfo extends Model {
    // 修正：init 方法不需要接收 sequelize 参数（外层已传入）
    static init() {
      super.init(
        {
          user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            references: {
              model: "user_accounts", // 关联的表名
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "昵称",
          },
          gender: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            comment: "0-未知,1-男,2-女",
          },
          birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
            comment: "生日",
          },
          bio: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: null,
            comment: "个性签名",
          },
          avatar_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue: null,
            comment: "用户上传头像链接",
          },
        },
        {
          sequelize,
          tableName: "user_info",
          charset: "utf8mb4",
          collate: "utf8mb4_general_ci",
        },
      );
    }

    static associate(models) {
      this.belongsTo(models.UserAccount, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }

  UserInfo.init();

  return UserInfo;
};
