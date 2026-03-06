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
      await db.PostInteractions.create(
        {
          post_id: postId,
          user_id: userId,
          interaction_type: "LIKE",
          is_active: 1,
        },
        { transaction },
      );

      // 帖子点赞数加一
      await db.Posts.update(
        { like_count: sequelize.literal("like_count + 1") },
        { where: { id: postId }, transaction },
      );
    } catch (error) {
      console.error(chalk.red("点赞动态失败："), error);
      throw error;
    }
  }

  // 取消点赞
  async unlikePost(postId: number, userId: number, transaction?: Transaction) {
    try {
      await db.PostInteractions.update(
        { is_active: 0 },
        {
          where: { post_id: postId, user_id: userId, interaction_type: "LIKE" },
          transaction,
        },
      );

      // 帖子点赞数减一
      await db.Posts.update(
        { like_count: sequelize.literal("like_count - 1") },
        { where: { id: postId }, transaction },
      );
    } catch (error) {
      console.error(chalk.red("取消点赞动态失败："), error);
      throw error;
    }
  }

  // 点踩
  async dislikePost(postId: number, userId: number, transaction?: Transaction) {
    try {
      await db.PostInteractions.create(
        {
          post_id: postId,
          user_id: userId,
          interaction_type: "DISLIKE",
          is_active: 1,
        },
        { transaction },
      );

      // 帖子点踩数加一
      await db.Posts.update(
        { dislike_count: sequelize.literal("dislike_count + 1") },
        { where: { id: postId }, transaction },
      );
    } catch (error) {
      console.error(chalk.red("点踩动态失败："), error);
      throw error;
    }
  }

  // 取消点踩
  async undislikePost(
    postId: number,
    userId: number,
    transaction?: Transaction,
  ) {
    try {
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
      await db.Posts.update(
        { dislike_count: sequelize.literal("dislike_count - 1") },
        { where: { id: postId }, transaction },
      );
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
    } catch (error) {
      console.error(chalk.red("浏览动态失败："), error);
      throw error;
    }
  }
}
