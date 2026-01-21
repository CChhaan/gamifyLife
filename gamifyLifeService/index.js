import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import userAuthRoutes from "./routes/userAuth.js";
import staticMiddleware from "koa-static";
import errorHandler from "./middlewares/errorHanler.js";
import { syncDatabase } from "./shared/db.js";
import tokenAuth from "./middlewares/tokenAuth.js";

const app = new Koa({});

app.use(errorHandler);
app.use(tokenAuth);
app.use(staticMiddleware(__dirname + "/public"));
app.use(bodyParser());
app.use(userAuthRoutes.routes()).use(userAuthRoutes.allowedMethods());

// 异步启动
(async () => {
  try {
    await syncDatabase();
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("启动失败:", error);
  }
})();
