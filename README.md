# 便利店大亨（Convenience Store Tycoon）

一个基于 React + TypeScript + Vite 构建的便利店经营模拟游戏。玩家担任便利店店长，通过商品定价、库存管理、员工招聘、营销活动与成本控制等决策，从零开始打造盈利的便利店。

## 功能特性

- **两种游戏模式**：目标模式（36 个月内达成 10 万元资金目标）与无限模式（挑战最高资金与经营时长）
- **动态天气系统**：高温、下雨、下雪、晴朗等天气会影响不同品类商品的销量
- **随机事件系统**：各类机遇与挑战事件为经营增加不确定性与策略深度
- **多维度经营面板**：商品、财务、员工、营销、成本、预测六大面板支持精细化管理
- **本地存档**：游戏进度自动保存到浏览器 localStorage，支持随时继续
- **排行榜**：记录历史最佳成绩，激励玩家不断突破
- **响应式 UI**：基于 Tailwind CSS 的现代化界面设计

## 技术栈

### 核心框架

- **React** 18.3 — 用于构建用户界面
- **React Router DOM** 7.3 — 基于 HashRouter 的多页面路由
- **TypeScript** 5.8 — 类型安全的 JavaScript 超集
- **Vite** 6.3 — 极速前端构建工具

### 状态管理与工具库

- **Zustand** 5.0 — 轻量级状态管理（游戏核心状态）
- **clsx** + **tailwind-merge** — 条件式 CSS 类名合并
- **Lucide React** — 图标库

### 样式与构建

- **Tailwind CSS** 3.4 — 原子化 CSS 框架
- **PostCSS** 8.5 + Autoprefixer 10.4
- **vite-tsconfig-paths** — 支持 `@/` 路径别名
- **vite-plugin-trae-solo-badge** — Trae Solo 项目徽章插件
- **babel-plugin-react-dev-locator** — 开发期组件定位工具

### 代码质量

- **ESLint** 9.25 + typescript-eslint 8.30
- **@eslint/js** + eslint-plugin-react-hooks + eslint-plugin-react-refresh

## 项目结构

```
.
├── .github/
│   └── workflows/deploy.yml   # GitHub Pages 自动部署工作流
├── public/                     # 静态资源（favicon 等）
├── src/
│   ├── components/             # UI 组件
│   │   ├── game/               # 游戏面板组件（商品、财务、员工、营销等）
│   │   └── Empty.tsx           # 空状态组件
│   ├── pages/                  # 路由页面
│   │   ├── Home.tsx            # 首页 / 主菜单
│   │   ├── GamePage.tsx        # 游戏主界面
│   │   ├── ResultPage.tsx      # 游戏结算页
│   │   └── LeaderboardPage.tsx # 排行榜
│   ├── store/gameStore.ts      # Zustand 全局游戏状态
│   ├── data/                   # 游戏初始数据（商品、事件、天气）
│   ├── hooks/useTheme.ts       # 主题相关自定义 Hook
│   ├── lib/utils.ts            # 通用工具函数
│   ├── types/index.ts          # 全局 TypeScript 类型
│   ├── utils/gameEngine.ts     # 游戏核心引擎逻辑
│   ├── App.tsx                 # 应用入口与路由配置（HashRouter）
│   └── main.tsx                # React 根挂载点
├── .gitignore                  # Git 忽略规则
├── eslint.config.js            # ESLint 配置
├── tailwind.config.js          # Tailwind 配置
├── postcss.config.js           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置（部署路径：/convenience-store-game/）
└── package.json
```

## 快速开始

### 环境要求

- **Node.js** >= 20
- **npm** （包管理器）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后在浏览器打开终端显示的本地地址即可进入游戏。

### 构建生产版本

```bash
npm run build
```

该命令会先执行 TypeScript 编译检查，然后运行 Vite 打包，产物输出到 `dist/` 目录。

### 本地预览构建产物

```bash
npm run preview
```

在本地预览 `dist/` 目录下构建后的应用。

### 代码检查

```bash
npm run lint
```

使用 ESLint 对整个项目进行代码质量检查。

### 类型检查

```bash
npm run check
```

仅运行 TypeScript 类型检查，不产生编译输出。

## 部署

项目已配置 GitHub Pages 自动部署工作流 [deploy.yml](file:///workspace/.github/workflows/deploy.yml)。

### 部署流程

1. 在 GitHub 仓库的 **Settings → Pages** 中将 Source 设置为 "GitHub Actions"
2. 将代码推送到 `main` 分支，或在 Actions 页面手动触发 `Deploy to GitHub Pages` 工作流
3. 工作流会自动在 `ubuntu-latest` 环境中使用 Node.js 20 安装依赖、构建项目，并将 `dist/` 目录部署到 Pages

**注意**：Vite 配置中的 `base` 路径为 `/convenience-store-game/`，确保与你的 GitHub Pages 部署路径一致。

## 本地存储

- 游戏存档：`convenience-store-save`（保存在 localStorage）
- 排行榜数据：按玩家历史最佳成绩记录

## License

MIT
