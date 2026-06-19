# 便利店大亨（Convenience Store Tycoon）

一个使用 React + TypeScript + Vite 构建的便利店经营模拟游戏。你将扮演一名便利店店长，通过商品定价、库存管理、员工招聘、营销活动等决策，让你的店铺盈利并发展壮大。

## 游戏玩法

- **目标模式**：在 36 个月内让资金达到 10 万元，或资金耗尽即结束
- **无限模式**：无期限经营，挑战最高资金和最长经营时间
- **天气系统**：高温、下雨、下雪、晴朗等天气会影响不同商品的销量
- **事件系统**：随机事件会给经营带来机遇或挑战
- **经营决策**：调整商品售价与库存、招聘员工、设置促销活动、控制房租水电成本

## 技术栈

- **框架**：React 18 + React Router DOM 7
- **语言**：TypeScript 5.8
- **构建工具**：Vite 6
- **状态管理**：Zustand 5
- **样式**：Tailwind CSS 3 + PostCSS + Autoprefixer
- **图标**：Lucide React
- **代码规范**：ESLint 9 + typescript-eslint

## 项目结构

```
src/
├── components/       # UI 组件（游戏面板、状态条等）
├── pages/            # 页面（首页、游戏页、结果页、排行榜）
├── store/            # Zustand 状态管理
├── data/             # 初始数据（商品、事件、天气等）
├── hooks/            # 自定义 Hooks
├── lib/              # 通用工具函数
├── types/            # TypeScript 类型定义
├── utils/            # 游戏引擎逻辑
└── App.tsx           # 应用入口
```

## 快速开始

### 环境要求

- Node.js >= 20
- npm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run check
```

## 部署

项目已配置 GitHub Actions 工作流（见 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)）。当代码推送到 `main` 分支时，会自动构建并部署到 GitHub Pages。

### 手动触发部署

1. 在 GitHub 仓库中启用 Pages 功能，Source 选择 "GitHub Actions"
2. 将代码推送到 `main` 分支，或在 Actions 页面手动触发工作流
3. 构建完成后即可通过 GitHub Pages 提供的 URL 访问游戏

## License

MIT
