import db from "../shared/db.js";
import sequelize from "@/shared/sequelize.js";
import { Transaction } from "sequelize";
import chalk from "chalk";
import type { Post, PostType } from "@/type/post.js";
import websocketService from "../websocket/websocket.js";
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
      // 发送草稿动态通知;
      process.nextTick(async () => {
        try {
          // 调用 WS 发送（修复后返回 boolean，可判断是否发送成功）
          await websocketService.sendDraftNotification(userId, post.toJSON());
          console.log(chalk.gray(`向用户 ${userId} 推送草稿通知成功`));
        } catch (wsError) {
          // 单独捕获 WS 发送错误，不影响主流程
          console.error(
            chalk.red(`向用户 ${userId} 推送草稿通知失败：`),
            wsError,
          );
        }
      });
      console.log(chalk.green("创建系统动态成功："));
      return post;
    } catch (error) {
      console.error(chalk.red("创建系统动态失败："));
      throw error;
    }
  }

  // 获取某个用户的所有动态
  async getUserPosts(userId: any) {
    try {
      const posts = await db.Posts.findAll({
        where: { user_id: userId },
        include: [{ model: db.UserInfo, as: "userInfo" }],
      });
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
  async getAllPublishedPosts(sort: string) {
    try {
      const posts = await db.Posts.findAll({
        where: { status: "PUBLISHED" },
        order: [[sort, "DESC"]],
      });
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
        {
          status: "PUBLISHED",
          published_at: sequelize.literal("CURRENT_TIMESTAMP"),
        },
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
