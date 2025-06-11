# CMS 前端项目

这是一个基于 Next.js 构建的 CMS 前端展示网站，用于渲染和展示 CMS 后台管理的内容。

## 🚀 功能特性

- **动态页面渲染** - 根据 CMS 后台创建的页面动态生成前端页面
- **多语言支持** - 支持中英文切换
- **组件化渲染** - 支持文本、卡片、网格、Hero 等多种组件类型
- **响应式设计** - 完美适配桌面端和移动端
- **SEO 优化** - 自动生成页面标题、描述和关键词
- **动态导航** - 根据后台菜单自动生成网站导航

## 📦 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env.local` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=cms_user
DB_PASSWORD=cms_password_123
DB_NAME=cms_db

# API 配置
NEXT_PUBLIC_API_URL=http://localhost:3001
CMS_API_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 查看网站

### 4. 构建生产版本

```bash
npm run build
npm run start
```

## 🏗️ 项目结构

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   │   ├── pages/      # 页面数据 API
│   │   │   └── menus/      # 菜单数据 API
│   │   ├── [...slug]/      # 动态页面路由
│   │   └── page.tsx        # 首页
│   ├── components/         # 组件
│   │   ├── Layout/         # 布局组件
│   │   │   ├── Header.tsx  # 头部导航
│   │   │   ├── Footer.tsx  # 页脚
│   │   │   └── Layout.tsx  # 主布局
│   │   └── PageRenderer.tsx # 页面渲染器
│   ├── lib/               # 工具库
│   │   └── database.ts    # 数据库连接
│   └── types/             # 类型定义
│       └── index.ts
├── public/                # 静态资源
├── .env.local            # 环境变量
├── next.config.ts        # Next.js 配置
└── package.json          # 项目配置
```

## 🎨 页面组件

### 支持的组件类型

1. **文本组件 (text)**
   - 标题和内容文本
   - 自定义字体大小和颜色

2. **卡片组件 (card)**
   - 图片和文字描述
   - 悬停效果

3. **网格组件 (grid)**
   - 2-4 列网格布局
   - 可包含子组件（图片、文本、按钮）

4. **Hero 组件 (hero)**
   - 大屏幕横幅
   - 背景图片支持
   - 行动按钮

### 子组件类型

- **图片 (image)** - 支持尺寸设置和替代文本
- **文本 (text)** - 支持格式化和样式设置
- **按钮 (button)** - 支持多种样式和链接

## 🌐 多语言支持

- 自动检测用户语言偏好
- 页面内容、菜单、SEO 信息均支持多语言
- 语言切换按钮位于页面头部

## 📱 响应式设计

- 移动端优先设计
- 自适应网格布局
- 移动端折叠导航菜单

## 🔧 开发说明

### API 接口

- `GET /api/pages/[slug]` - 获取页面数据
- `GET /api/menus` - 获取菜单数据

### 数据流

1. Next.js 服务端渲染时从数据库获取页面数据
2. 解析页面内容中的 JSON 组件数据
3. 使用 PageRenderer 渲染组件
4. 生成完整的 HTML 页面

### 新增组件

1. 在 `PageRenderer.tsx` 中添加新的组件渲染逻辑
2. 在 CMS 后台的可视化编辑器中添加对应组件
3. 更新类型定义

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 设置环境变量
3. 自动部署

### 传统服务器部署

```bash
npm run build
npm run start
```

## �� 许可证

MIT License
