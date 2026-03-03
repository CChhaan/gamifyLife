import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
import { Transaction } from "sequelize";
import chalk from "chalk";
import type { Post, PostType } from "@/type/post.js";

export default class PostService {
  // 系统生成动态
  async createSystemPost(
    userId: any,
    type: PostType,
    targetId: any,
    title: string,
    t?: Transaction,
  ) {
    try {
      const postAttr: Post = {
        user_id: userId,
        target_id: targetId,
        title: title,
        post_type: type,
      };

      const post = await db.Posts.create(postAttr, { transaction: t });
      return post;
    } catch (error) {
      console.error(chalk.red("创建系统动态失败："), error);
      throw error;
    }
  }

  // 获取某个用户的所有动态
  async getUserPosts(userId: any) {
    try {
      const posts = await db.Posts.findAll({ where: { user_id: userId } });
      return posts;
    } catch (error) {
      console.error(chalk.red("获取用户动态失败："), error);
      throw error;
    }
  }

  // 获取某个用户的所有已发布的动态
  async getUserPublishedPosts(userId: any) {
    try {
      const posts = await db.Posts.findAll({
        where: { user_id: userId, status: "PUBLISHED" },
      });
      return posts;
    } catch (error) {
      console.error(chalk.red("获取用户已发布的动态失败："), error);
      throw error;
    }
  }

  // 获取所有发布状态的动态
  async getAllPublishedPosts() {
    try {
      const posts = await db.Posts.findAll({ where: { status: "PUBLISHED" } });
      return posts;
    } catch (error) {
      console.error(chalk.red("获取所有发布状态的动态失败："), error);
      throw error;
    }
  }

  // 发布动态
  async publishPost(postId: any, userId: any) {
    try {
      await db.Posts.update(
        { status: "PUBLISHED" },
        { where: { id: postId, user_id: userId } },
      );
    } catch (error) {
      console.error(chalk.red("发布动态失败："), error);
      throw error;
    }
  }

  // 将用户某个动态隐藏
  async hideUserPost(postId: any) {
    try {
      await db.Posts.update({ status: "HIDDEN" }, { where: { id: postId } });
    } catch (error) {
      console.error(chalk.red("隐藏用户动态失败："), error);
      throw error;
    }
  }

  // 取消动态隐藏
  async unhideUserPost(postId: any) {
    try {
      await db.Posts.update({ status: "PUBLISHED" }, { where: { id: postId } });
    } catch (error) {
      console.error(chalk.red("取消隐藏用户动态失败："), error);
      throw error;
    }
  }
}
