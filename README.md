# 宝藏文档 前端 (My Treasure Doc - Frontend)

[English](#english) | [中文](#chinese)

<a name="chinese"></a>
## 中文说明

### 项目概述

宝藏文档的前端应用，基于 React + TypeScript + Vite 构建的现代化文档管理系统界面。

### 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **UI 组件库**: Ant Design 5
- **路由**: React Router 6
- **HTTP 客户端**: Axios
- **图标**: Ant Design Icons

### 快速开始

#### 环境要求

- Node.js 18+
- npm 或 yarn

#### 安装依赖

```bash
npm install
```

#### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

#### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

#### 预览生产构建

```bash
npm run preview
```

### 项目结构

```
src/
├── components/     # 可复用组件
├── pages/          # 页面组件
├── services/       # API 服务
├── utils/          # 工具函数
├── types/          # TypeScript 类型定义
├── store/          # 状态管理
├── layouts/        # 布局组件
└── assets/         # 静态资源
```

### 配置后端 API

在开发环境中，您需要配置后端 API 地址。默认配置在 `vite.config.ts` 中的代理设置。

后端服务默认运行在 `http://localhost:2021`

### 主要功能

- 📝 文档管理：创建、编辑、删除、查看文档
- 📁 分组管理：文档分类和组织
- 👤 用户认证：登录、注册、权限管理
- 🔍 搜索功能：快速查找文档
- 📱 响应式设计：支持多种设备

### 开发规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 组件采用函数式组件 + Hooks
- 使用 CSS Modules 或 styled-components

### 许可证

MIT License

---

<a name="english"></a>
## English

### Project Overview

Frontend application for Treasure Doc, a modern document management system built with React + TypeScript + Vite.

### Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Ant Design 5
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Icons**: Ant Design Icons

### Quick Start

#### Requirements

- Node.js 18+
- npm or yarn

#### Install Dependencies

```bash
npm install
```

#### Development Mode

```bash
npm run dev
```

The app will start at http://localhost:5173

#### Build for Production

```bash
npm run build
```

Build artifacts will be generated in the `dist` directory

#### Preview Production Build

```bash
npm run preview
```

### Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # API services
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── store/          # State management
├── layouts/        # Layout components
└── assets/         # Static assets
```

### Backend API Configuration

In development mode, you need to configure the backend API address. Default configuration is in the proxy settings in `vite.config.ts`.

Backend service runs on `http://localhost:2021` by default

### Key Features

- 📝 Document Management: Create, edit, delete, view documents
- 📁 Group Management: Document categorization and organization
- 👤 User Authentication: Login, registration, permission management
- 🔍 Search: Quick document search
- 📱 Responsive Design: Multi-device support

### Development Guidelines

- Use ESLint for code linting
- Follow TypeScript strict mode
- Use functional components with Hooks
- Use CSS Modules or styled-components

### License

MIT License
