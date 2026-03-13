import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import chalk from "chalk";

// 存储用户 WebSocket 连接的映射
interface ConnectionMap {
  [userId: number]: WebSocket[];
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private connections: ConnectionMap = {};

  // 初始化 WebSocket 服务
  initialize(server: any) {
    if (this.wss) {
      console.log(chalk.yellow("WebSocket server already initialized"));
      return;
    }
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket, req: any) => {
      try {
        const token = req.url?.split("token=")[1];
        if (!token) {
          ws.close(401, "Unauthorized: No token provided");
          return;
        }
        // 验证 token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "my_app_secret",
        ) as any;
        const userId = decoded.userId;
        if (!this.connections[userId]) {
          this.connections[userId] = [];
        }
        this.connections[userId].push(ws);
        console.log(`User ${userId} connected via WebSocket`);
        // 监听连接关闭
        ws.on("close", () => {
          this.connections[userId] = this.connections[userId].filter(
            (conn) => conn !== ws,
          );
          if (this.connections[userId].length === 0) {
            delete this.connections[userId];
          }
          console.log(`User ${userId} disconnected from WebSocket`);
        });

        // 监听错误
        ws.on("error", (error) => {
          console.error(chalk.red("WebSocket error:"), error);
        });
        ws.send("something");
      } catch (error) {
        console.error(chalk.red("WebSocket authentication error:"), error);
        ws.close(401, "Unauthorized: Invalid token");
      }
    });

    console.log(chalk.blue("WebSocket server initialized"));
  }

  // 向指定用户发送消息
  async sendToUser(userId: number, message: any) {
    if (this.connections[userId]) {
      for (const ws of this.connections[userId]) {
        if (ws.readyState === WebSocket.OPEN) {
          if (typeof message === "object") {
            message = JSON.stringify(message);
          }
          await ws.send(message);
        }
      }
    }
  }

  // 发送草稿动态通知
  async sendDraftNotification(userId: number, draft: any) {
    // await this.sendToUser(userId, {
    //   type: "DRAFT_POST_CREATED",
    //   data: draft,
    //   timestamp: new Date().toISOString(),
    // });
    await this.sendToUser(userId, "有新的草稿动态被创建！");
  }

  // 完成成就通知
  async sendAchievementNotification(userId: number, achievement: any) {
    await this.sendToUser(userId, `恭喜完成成就：${achievement.title}`);
  }

  // 关闭 WebSocket 服务
  close() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
      this.connections = {};
    }
  }
}

// 导出单例实例
export default new WebSocketService();
