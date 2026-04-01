# AGENTS.md - GamifyLife 项目开发指南

## 项目概述
GamifyLife 是一个全栈生活游戏化平台，采用前后端分离架构：
- **前端**: uni-app + Vue 3 + TypeScript (多端支持)
- **后端**: Koa.js + TypeScript + Sequelize + MySQL

## 构建和开发命令

### 前端 (gamifyLifeFront)
```bash
# 开发环境启动
cd gamifyLifeFront
npm run dev:h5          # H5端开发
npm run dev:mp-weixin   # 微信小程序开发
npm run dev:custom      # 自定义平台开发

# 构建生产版本
npm run build:h5        # H5端构建
npm run build:mp-weixin # 微信小程序构建

# 类型检查
npm run type-check      # TypeScript类型检查
```

### 后端 (gamifyLifeService)
```bash
# 开发环境
cd gamifyLifeService
npm run dev             # 开发模式 (nodemon + tsx)

# 构建和部署
npm run build           # TypeScript编译 + 路径别名处理
npm run start           # 生产环境启动
```

## 代码风格指南

### TypeScript 配置
- **严格模式**: 启用 `strict` 类型检查
- **目标版本**: ESNext (前端), ESNext (后端)
- **模块系统**: ES Modules (后端使用 nodenext)
- **路径别名**: `@/*` 指向 `src/` 目录

### 导入规范
```typescript
// 标准导入顺序
import { ref, computed } from 'vue'           // Vue 核心功能
import { defineComponent } from '@vue/runtime-core'  // Vue 组件
import { useUser } from '@/composables/useUser'     // 项目组合式API
import { UserService } from '@/services/UserService' // 项目服务
import type { User } from '@/type/user'             // 类型定义
```

### 命名约定
- **文件名**: kebab-case (如 `user-info.ts`, `login-utils.ts`)
- **组件/类**: PascalCase (如 `UserInfo`, `UserService`)
- **函数/变量**: camelCase (如 `getUserInfo`, `userGrowth`)
- **常量/枚举**: PascalCase (如 `API_BASE_URL`, `UserGender`)
- **数据库表**: snake_case (如 `user_accounts`, `user_info`)

### Vue 组件规范
```typescript
// 单文件组件结构
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 组合式API逻辑
import { ref, computed } from 'vue'
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 错误处理模式
```typescript
// 前端错误处理
try {
  const result = await apiCall()
} catch (error) {
  console.error('操作失败:', error)
  showToast('操作失败，请重试')
}

// 后端错误处理
try {
  // 业务逻辑
} catch (error) {
  ctx.status = 500
  ctx.body = {
    success: false,
    message: '服务器内部错误',
    error: error.message
  }
}
```

### API 设计规范
```typescript
// 标准化响应格式
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// 错误响应
{
  success: false,
  message: '用户名已存在',
  code: 400
}
```

### 数据库模型规范
```typescript
// 使用 Sequelize ORM
export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
})
```

## 项目结构

### 前端结构
```
gamifyLifeFront/src/
├── pages/           # 页面组件
├── components/      # 可复用组件
├── composables/     # 组合式API逻辑
├── utils/          # 工具函数
├── type/           # TypeScript类型定义
└── App.vue         # 根组件
```

### 后端结构
```
gamifyLifeService/src/
├── models/         # 数据模型 (Sequelize)
├── routes/         # API路由
├── middlewares/    # 中间件
├── services/       # 业务逻辑服务
├── shared/         # 共享工具和配置
├── type/           # TypeScript类型定义
└── index.ts        # 应用入口
```

## 技术栈详情

### 前端技术栈
- **框架**: uni-app 3.0 (支持H5、小程序、App等多端)
- **UI库**: uView Pro 组件库
- **状态管理**: Vue 3 Composition API
- **构建工具**: Vite
- **开发工具**: TypeScript + Vue TSC

### 后端技术栈
- **框架**: Koa.js 3.x
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT + koa-jwt
- **实时通信**: WebSocket
- **任务调度**: node-schedule
- **AI集成**: OpenAI API

## 开发规范

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式化
- refactor: 代码重构
- test: 测试相关
- chore: 构建或辅助工具变动

### 代码质量检查
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则 (如果有配置)
- 统一的代码格式化 (如果有 Prettier 配置)

### 数据库操作
- 使用 Sequelize ORM 进行数据库操作
- 遵循 RESTful API 设计原则
- 使用事务确保数据一致性
- 实现数据迁移和版本控制

### 安全考虑
- JWT Token 认证和授权
- 输入数据验证和过滤
- SQL 注入防护 (通过 ORM)
- XSS 攻击防护

## 部署说明

### 前端部署
- H5端: 构建后部署到 Web 服务器
- 小程序: 构建后上传到对应平台

### 后端部署
- 使用 `npm run build` 构建生产版本
- 配置环境变量 (.env)
- 使用 PM2 或类似工具管理进程