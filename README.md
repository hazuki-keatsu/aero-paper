# Hazuki Blog Theme

🌸 基于 [AstroPaper](https://github.com/satnaing/astro-paper) 的自定义博客主题，为 Hazuki Keatsu 的个人博客设计。

![博客预览](https://img.shields.io/badge/Astro-5.12.0-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4EA94B?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ 主要特色

### 🎨 视觉增强
- **动态背景图片**：亮色模式使用 Mashiro 背景，深色模式使用 Asuka 背景
- **毛玻璃效果**：现代化的半透明卡片设计，保持内容可读性
- **响应式背景**：桌面端支持视差效果，移动端优化性能
- **统一布局**：所有页面采用一致的卡片式布局设计

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

## 🚀 快速开始

### 前置要求
- Node.js 18+ 
- pnpm

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/hazuki-keatsu/hazuki-blog-theme.git
cd hazuki-blog-theme

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

### 创建新文章

在 `src/data/blog/` 目录下创建新的 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDatetime: 2025-01-23T10:00:00Z
featured: false
draft: false
tags:
  - 标签1
  - 标签2
---

文章内容...

## 目录

这里会自动生成可折叠的目录。

## 章节一

文章内容...
```

### 添加目录

只需在文章中添加 `## 目录` 标题，系统会自动生成可折叠的目录。支持：
- `## Table of contents`
- `## Contents` 
- `## 目录`

### 图片使用

推荐将图片放在 `src/assets/images/` 目录下，Astro 会自动优化图片。

## 🎨 自定义配置

### 站点配置

编辑 `src/config.ts` 文件：

```typescript
export const SITE = {
  website: "https://yoursite.com/",
  author: "Your Name",
  desc: "Your Blog Description", 
  title: "Your Blog Title",
  // ... 其他配置
};
```

### 背景图片

替换 `src/assets/images/backgrounds/` 目录下的图片：
- `mashiro.webp` - 亮色模式背景
- `asuka.webp` - 深色模式背景

### 样式定制

主要样式文件：
- `src/styles/global.css` - 全局样式、背景效果
- `src/styles/typography.css` - 文章排版样式

## 🔧 主要改进

相较于原版 AstroPaper，本主题包含以下主要改进：

### 视觉增强
- ✅ 动态背景图片系统
- ✅ 毛玻璃效果卡片设计
- ✅ 统一的页面布局
- ✅ 优化的移动端体验

### 功能增强
- ✅ 中文目录支持
- ✅ 折叠目录功能
- ✅ 优化的代码字体显示
- ✅ 改进的标签样式

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

- 网站：[keatsu.top](http://keatsu.top/)
- 作者：Hazuki Keatsu
- GitHub：[hazuki-keatsu](https://github.com/hazuki-keatsu)

---

> 💡 **提示**：如果您喜欢这个主题，请给项目点个 ⭐ Star！