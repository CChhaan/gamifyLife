import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
import { Transaction } from "sequelize";
import chalk from "chalk";
import type { Post, PostType, Interaction } from "@/type/post.js";
import websocketService from "../websocket/websocket.js";
export default class PostInteractionService {
  // 点赞
  async likePost(postId: number, userId: number, transaction?: Transaction) {
    try {
      // 如果已经点赞过不加
      const existingInteraction = await db.PostInteractions.findOne({
        where: {
          post_id: postId,
          user_id: userId,
          interaction_type: "LIKE",
          is_active: 1,
        },
        transaction,
      });
      if (existingInteraction) {
        return;
      }
      // 如果没有点赞数据，创建
      // 如果有点赞数据，更新is_active为1
      await db.PostInteractions.create(
        {
          post_id: postId,
          user_id: userId,
          interaction_type: "LIKE",
          is_active: 1,
        },
        { updateOnDuplicate: ["is_active"], transaction },
      );

      // 帖子点赞数加一
      await db.Posts.increment(
        { like_count: 1 },
        { where: { id: postId }, transaction },
      );
      // 取消点踩
      await this.unDislikePost(postId, userId, transaction);
      return { message: "点赞成功" };
    } catch (error) {
      console.error(chalk.red("点赞动态失败："), error);
      throw error;
    }
  }

  // 取消点赞
  async unlikePost(postId: number, userId: number, transaction?: Transaction) {
    try {
      // 如果没有点赞过不减少
      const existingInteraction = await db.PostInteractions.findOne({
        where: {
          post_id: postId,
          user_id: userId,
          interaction_type: "LIKE",
          is_active: 1,
        },
        transaction,
      });
      if (!existingInteraction) {
        return;
      }
      await db.PostInteractions.update(
        { is_active: 0 },
        {
          where: { post_id: postId, user_id: userId, interaction_type: "LIKE" },
          transaction,
        },
      );

      // 帖子点赞数减一
      await db.Posts.decrement(
        { like_count: 1 },
        { where: { id: postId }, transaction },
      );
      return { message: "取消点赞成功" };
    } catch (error) {
      console.error(chalk.red("取消点赞动态失败："), error);
      throw error;
    }
  }

  // 点踩
  async dislikePost(postId: number, userId: number, transaction?: Transaction) {
    try {
      // 如果已经点踩过不加
      const existingInteraction = await db.PostInteractions.findOne({
        where: {
          post_id: postId,
          user_id: userId,
          interaction_type: "DISLIKE",
          is_active: 1,
        },
        transaction,
      });
      if (existingInteraction) {
        return;
      }
      await db.PostInteractions.create(
        {
          post_id: postId,
          user_id: userId,
          interaction_type: "DISLIKE",
          is_active: 1,
        },
        { updateOnDuplicate: ["is_active"], transaction },
      );

      // 帖子点踩数加一
      await db.Posts.increment(
        { dislike_count: 1 },
        { where: { id: postId }, transaction },
      );
      // 取消点赞
      await this.unlikePost(postId, userId, transaction);
      return { message: "点踩成功" };
    } catch (error) {
      console.error(chalk.red("点踩动态失败："), error);
      throw error;
    }
  }

  // 取消点踩
  async unDislikePost(
    postId: number,
    userId: number,
    transaction?: Transaction,
  ) {
    try {
      // 如果没有点踩过不减少
      const existingInteraction = await db.PostInteractions.findOne({
        where: {
          post_id: postId,
          user_id: userId,
          interaction_type: "DISLIKE",
          is_active: 1,
        },
        transaction,
      });
      if (!existingInteraction) {
        return;
      }
      await db.PostInteractions.update(
        { is_active: 0 },
        {
          where: {
            post_id: postId,
            user_id: userId,
            interaction_type: "DISLIKE",
          },
          transaction,
        },
      );

      // 帖子点踩数减一
      await db.Posts.decrement(
        { dislike_count: 1 },
        { where: { id: postId }, transaction },
      );
      return { message: "取消点踩成功" };
    } catch (error) {
      console.error(chalk.red("取消点踩动态失败："), error);
      throw error;
    }
  }

  // 浏览
  async viewPost(postId: number, userId: number, transaction?: Transaction) {
    try {
      // 如果已经浏览过不加
      const existingInteraction = await db.PostInteractions.findOne({
        where: { post_id: postId, user_id: userId, interaction_type: "VIEW" },
        transaction,
      });
      if (existingInteraction) {
        return;
      }

      await db.PostInteractions.create(
        {
          post_id: postId,
          user_id: userId,
          interaction_type: "VIEW",
          is_active: 1,
        },
        { transaction },
      );

      // 帖子浏览数加一
      await db.Posts.update(
        { view_count: sequelize.literal("view_count + 1") },
        { where: { id: postId }, transaction },
      );
      return { message: "浏览成功" };
    } catch (error) {
      console.error(chalk.red("浏览动态失败："), error);
      throw error;
    }
  }

  // 获取用户的帖子点赞数据
  async getUserPostInteractions(userId: number) {
    try {
      const interactions = await db.PostInteractions.findAll({
        where: { user_id: userId },
        include: [
          { model: db.UserInfo, as: "userInfo" },
          {
            model: db.Posts,
            as: "post",
            where: { user_id: userId },
            required: true,
          },
        ],
      });
      return interactions.filter(
        (item) => item.dataValues.interaction_type == "LIKE",
      );
    } catch (error) {
      console.error(chalk.red("获取用户帖子互动数据失败："), error);
      throw error;
    }
  }
}
