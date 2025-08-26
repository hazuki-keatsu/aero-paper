---
author: Hazuki Keatsu
pubDatetime: 2025-08-25T10:36:00Z
title: Aero Paper 介绍文档
featured: true
draft: false
tags:
  - example
description:
  Aero Paper 介绍文档。
---

## 目录

🌸 基于 [AstroPaper](https://github.com/satnaing/astro-paper) 的自定义博客主题，为 Hazuki Keatsu 的个人博客设计。

![博客预览](https://img.shields.io/badge/Astro-4.0.12-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ 主要特色

### 🎨 视觉增强
- **动态背景图片**：亮色模式和深色模式使用不同的背景图片
- **毛玻璃效果**：现代化的半透明卡片设计，保持内容可读性
- **响应式背景**：桌面端支持视差效果，移动端优化性能
- **统一布局**：所有页面采用一致的卡片式布局设计
- **手写字体**：使用 [Yozai](https://github.com/lxgw/yozai-font) 作为页面的字体

### 📝 内容功能
- **折叠目录**：支持中英文的自动生成目录，可展开/折叠
- **语法高亮**：使用 Shiki 进行代码高亮，支持多种主题
- **搜索功能**：基于 Pagefind 的全文搜索
- **标签系统**：美化的标签设计，支持按标签分类

### 🔧 技术特性
- **SEO 优化**：内置 sitemap、RSS 订阅、Open Graph 支持
- **性能优化**：图片懒加载、代码分割、静态生成
- **无障碍访问**：遵循 WCAG 指南，支持键盘导航
- **国际化**：支持中文本地化

## 🚀 本地调试

### 前置要求
- Node.js 18+ 
- pnpm

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/hazuki-keatsu/aero-paper.git
cd aero-paper

# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm run dev
```

在浏览器中打开 `http://localhost:4321` 查看效果。

### 构建部署

```bash
# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview
```

## 🧞 `pnpm`所有命令

> **_注意_** 对于 `Docker` 命令，必须在你的设备里[安装](https://docs.docker.com/engine/install/)它.

| Command                              | Action                                                                                                                           |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                       | 安安装所有的依赖                                                                                                            |
| `pnpm run dev`                       | 在`localhost:4321`启动本地开发服务器                                                                                       |
| `pnpm run build`                     | 在`./dist/`中构建你的网页                                                                                          |
| `pnpm run preview`                   | 本地预览你的网页                                                                                     |
| `pnpm run format:check`              |使用 Prettier 检查你的代码格式                                                                                                 |
| `pnpm run format`                    | 使用 Prettier 格式化你的代码                                                                                                       |
| `pnpm run sync`                      | 为所有的 Astro Module 产生 TypeScript 类型 [了解更多](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `pnpm run lint`                      | 使用 ESLint 进行静态代码分析                                                                                                                |

## 📁 项目结构

```
├── public/                 # 静态资源
│   ├── favicon.svg        
│   ├── profile_picture.jpg
│   └── assets/            # 图片资源
├── src/
│   ├── assets/            # 项目资源
│   │   ├── fonts/         # 自定义字体 (Yozai)
│   │   ├── icons/         # SVG 图标
│   │   └── images/        # 图片资源
│   │       └── backgrounds/ # 背景图片
│   ├── components/        # 组件
│   │   ├── PageContainer.astro  # 统一页面容器
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── data/blog/         # 博客文章 (Markdown)
│   ├── layouts/           # 页面布局
│   ├── pages/             # 路由页面
│   ├── styles/            # 样式文件
│   │   ├── global.css     # 全局样式 + 背景效果
│   │   └── typography.css # 排版样式
│   └── utils/             # 工具函数
├── astro.config.ts        # Astro 配置
└── src/config.ts          # 站点配置
```

## 📝 写作指南

请参考原项目的 [README文件](./README.raw.md)

## 🔧 主要改进

相较于原版 AstroPaper，本主题包含以下主要改进：

### 视觉增强
- ✅ 动态背景图片系统
- ✅ 毛玻璃效果卡片设计
- ✅ 统一的页面布局
- ✅ 优化的移动端体验
- ✅ 引入中文手写字体 [Yozai](https://github.com/lxgw/yozai-font)

### 功能增强
- ✅ 中文目录支持
- ✅ 折叠目录功能
- ✅ 优化的代码字体显示
- ✅ 改进的标签样式
- ✅ 加入浮动音乐播放器

### 技术优化
- ✅ 响应式背景图片
- ✅ 性能优化的移动端设置
- ✅ 改进的组件对齐
- ✅ 中文本地化支持

## 📄 许可证

本项目基于 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [AstroPaper](https://github.com/satnaing/astro-paper) - 原始主题
- [Astro](https://astro.build/) - 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Shiki](https://shiki.style/) - 语法高亮

## 📞 联系方式

- GitHub：[hazuki-keatsu](https://github.com/hazuki-keatsu)
- Mail: [Outlook](mailto:yeyuefeng699@outlook.com)

---

> 💡 **提示**：如果您喜欢这个主题，请给项目点个 ⭐ Star！
