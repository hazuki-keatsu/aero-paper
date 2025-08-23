# 博客背景图片和布局统一改进

## 改进概述

我们已经成功为博客添加了背景图片效果，并统一了各个页面的布局。以下是主要改进：

## 🎨 背景图片功能

### 视觉效果
- **亮色模式**：使用 `mashiro.webp` 作为背景图片
- **深色模式**：使用 `asuka.webp` 作为背景图片
- **模糊效果**：背景图片添加了适当的模糊和透明度，不会影响内容阅读
- **内容遮罩**：使用半透明遮罩和 backdrop-filter 确保内容清晰可读

### 响应式设计
- **桌面设备**：使用 `background-attachment: fixed` 创建视差效果
- **移动设备**：降低模糊度和透明度，优化性能和视觉效果

## 🎯 布局统一改进

### 新增组件
- **PageContainer**：统一的页面容器组件，提供一致的布局基础
- **content-card** 样式类：为内容区域提供统一的卡片样式

### 页面改进
1. **主页** (`src/pages/index.astro`)
   - Hero 区域使用卡片样式，突出显示
   - 置顶文章和最新文章分别使用独立的卡片容器
   - 改进了间距和视觉层次

2. **文章详情页** (`src/layouts/PostDetails.astro`)
   - 文章内容使用卡片包装
   - 导航按钮添加了悬停效果
   - 改善了标签的展示效果

3. **文章列表页** (`src/pages/posts/[...page].astro`)
   - 每篇文章使用独立的卡片样式
   - 改进了文章间的间距

4. **标签页** (`src/pages/tags/index.astro`)
   - 标签使用卡片样式显示
   - 改进了标签的布局和视觉效果

5. **关于页面** (`src/layouts/AboutLayout.astro`)
   - 内容使用卡片包装
   - 保持了原有的排版效果

6. **搜索页面** (`src/pages/search.astro`)
   - 搜索界面适配了新的背景效果
   - 搜索结果框使用透明背景

### 组件改进
- **Header**：添加了透明背景和模糊效果
- **Footer**：使用卡片样式包装
- **Card**：文章卡片添加了悬停效果和阴影
- **Tag**：标签使用胶囊样式，添加了悬停效果
- **Pagination**：分页组件使用卡片包装

## 🎨 样式特色

### 毛玻璃效果
- 所有内容卡片都使用了毛玻璃效果（backdrop-filter）
- 在保持美观的同时确保内容的可读性

### 悬停交互
- 文章卡片添加了悬停阴影效果
- 标签和按钮添加了悬停颜色变化
- 导航按钮添加了平滑的过渡动画

### 响应式优化
- 移动设备上优化了背景图片的性能
- 调整了模糊度和透明度以适应小屏幕
- 保持了各个设备上的一致体验

## 🚀 使用方法

构建和预览项目：
```bash
pnpm run build
pnpm run preview
```

开发模式（注意：背景图片在开发模式下可能不会显示）：
```bash
pnpm run dev
```

## 📁 文件变更

### 新增文件
- `src/components/PageContainer.astro` - 统一的页面容器组件

### 修改文件
- `src/styles/global.css` - 添加背景图片和卡片样式
- `src/pages/index.astro` - 主页布局改进
- `src/layouts/PostDetails.astro` - 文章详情页改进
- `src/layouts/Main.astro` - 主布局改进
- `src/layouts/AboutLayout.astro` - 关于页面改进
- `src/components/Header.astro` - 头部组件改进
- `src/components/Footer.astro` - 页脚组件改进
- `src/components/Card.astro` - 文章卡片改进
- `src/components/Tag.astro` - 标签组件改进
- `src/components/Pagination.astro` - 分页组件改进
- 各种页面文件（posts, tags, search 等）

## 🎯 注意事项

1. 背景图片位于 `src/assets/images/backgrounds/` 目录
2. 可以通过修改 `global.css` 中的图片路径来更换背景图片
3. 透明度和模糊度可以通过调整 CSS 变量来自定义
4. 所有改进都保持了原有的功能和 SEO 优化
