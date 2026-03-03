import WebSocket, { WebSocketServer } from "ws";

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
        console.log("websocket连接成功！", req);
        // 监听连接关闭
        ws.on("close", () => {
          console.log("WebSocket closed");
        });

        // 监听错误
        ws.on("error", (error) => {
          console.error(chalk.red("WebSocket error:"), error);
        });
      } catch (error) {
        console.error(chalk.red("WebSocket authentication error:"), error);
      }
    });

    console.log(chalk.blue("WebSocket server initialized"));
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
//   // 向指定用户发送消息
//   sendToUser(userId: number, message: any) {
//     if (this.connections[userId]) {
//       const jsonMessage = JSON.stringify(message);
//       this.connections[userId].forEach((ws) => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(jsonMessage);
//         }
//       });
//     }
//   }

//   // 发送草稿任务通知
//   sendDraftNotification(userId: number, draft: any) {
//     this.sendToUser(userId, {
//       type: "DRAFT_CREATED",
//       data: draft,
//       timestamp: new Date().toISOString(),
//     });
//   }
