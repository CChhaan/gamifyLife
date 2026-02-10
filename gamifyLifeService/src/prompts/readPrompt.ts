import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// 在 ES Module 中手动定义 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function readPrompt(prompt: string) {
  try {
    const currentDir = path.dirname(__filename);
    const filePath = path.join(currentDir, prompt + ".txt");
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  } catch (error) {
    console.log(`读取prompt文件失败：${error}`);
    throw new Error(`读取prompt文件失败：${error}`);
  }
}
