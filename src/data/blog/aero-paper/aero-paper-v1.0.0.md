---
author: Hazuki Keatsu
title: "Aero Paper v1.0.0 发布：稳定里程碑 & 体验全面提升"
pubDatetime: 2025-10-03T21:00:00+08:00
featured: false
draft: false
tags:
  - AeroPaper
description: "Aero Paper 进入 1.0.0 正式版：新增 Giscus 评论、折叠导航栏、友情链接与时间线页面、全局回顶按钮，适配 Mermaid 暗色模式，并在样式与性能上全面打磨。"
---

## 前言

Aero Paper 迎来了 **1.0.0 正式版本**。这一版本的目标：在不牺牲轻量与可读性的前提下，补齐互动能力、可导航性与结构化展示，并解决前几个迭代暴露的性能与暗色模式适配问题。本文记录主要改动、设计思路与迁移建议。

## 关键更新速览

| 类型 | 更新项 | 摘要 |
| ---- | ------ | ---- |
| 样式 | 细节微调 | 统一行高 / 间距 |
| 互动 | Giscus 评论 | GitHub 驱动的轻量评论 / 讨论区支持 |
| 导航 | 折叠导航栏 | 小屏动画展开 + 桌面“更多”折叠菜单 |
| 页面 | 友情链接页 | 可配置友链卡片 |
| 页面 | 时间线页 | 结构化里程碑 / 事件流展示，支持富文本块 |
| UI | 回到顶部按钮 | 全局浮动控件 + 渐显/渐隐逻辑 |
| 兼容 | Mermaid 暗色模式 | 自动跟随主题切换、避免闪烁 |

## 一、Giscus 评论区支持

### 方案选择
选用 [Giscus](https://giscus.app/)（基于 GitHub Discussions）代替自建后端：
- 无需数据库与鉴权维护。
- 支持 Markdown / Emoji / 反向引用。
- 可按主题自动适配明暗样式。

### 集成要点
```tsx
<script
  src="https://giscus.app/client.js"
  data-repo="<your-user>/<your-repo>"
  data-repo-id="..."
  data-category="Announcements"
  data-category-id="..."
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async
></script>
```
> 主题热切换（暗色 <-> 亮色）在本版本中通过监听自定义主题切换事件并更新 `data-theme` 动态应用。

## 二、可折叠导航栏（含“更多”菜单）

### 需求背景
导航条在功能逐渐增多时出现拥挤与换行问题。移动端需要平滑展开，桌面端需要避免一字排满造成视觉压力。

### 实现亮点
- **移动端**：`max-height + transform + opacity` 顺序动画，避免回流尖峰。
- **桌面端**：将次要项（统计 / 友链 / 时间线等）收纳进“更多”下拉，保持主导航聚焦。
- 单个脚本管理：`openMenu / closeMenu / initMoreMenu` 防止状态错乱。
- ARIA 无障碍：`aria-expanded`、`aria-controls`、`Escape` 关闭支持。

### 迁移提示
如果你自定义菜单项，只需保证新增 `<li>` 放入主层或“更多”列表即可，无需改 JS。

## 三、新增友情链接页面

### 特性
- 数据驱动：集中在 `friends.ts`，支持排序（优先级 + 名称）。
- 卡片动效：进入视口 stagger 动画（透明度 + 上移）。
- 留白策略：在窄屏下每行 1 卡片，≥sm 采用均衡列。

### 示例数据结构
```ts
interface FriendLink {
  name: string;
  url: string;
  avatar?: string;
  desc?: string;
  priority?: number; // 越大越靠前
}
```

## 四、新增时间线页面

### 目标
用于展示个人 / 项目里程碑、研究进展、部署节点等。

### 能力
- 支持富文本（含内嵌 HTML 块）。
- “块”组件允许标题 / 时间 / 内容灵活组合。
- 动画与主题同步，暗色模式下可读性优化。

## 五、全局回到顶部按钮

### 功能点
- 页面滚动超过一个视口高度后淡入。
- 点击平滑滚动（尊重 `prefers-reduced-motion` 降级为瞬移）。
- 提前解绑滚动监听（节能）。

## 六、性能优化

使用透明背景颜色替代实时模糊，用近似的效果降低对设备性能的要求，提升用户体验。

## 七、Mermaid 图表暗色模式支持

### 问题
原生 Mermaid 在主题切换时会出现：
- 主题无法切换

### 方案
- 预载两套主题样式（light / dark）。
- 主题切换时只切换挂载类 / `data-theme`，避免重新计算布局。
- 监听 Astro 页面切换事件 `astro:before-swap / after-swap`，确保过渡中主题不“倒带”。

## 升级 / 迁移指引

| 场景 | 操作 |
| ---- | ---- |
| 之前版本已有自定义导航 | 检查是否与新 "更多" 菜单 class 冲突；保留 `id="menu-items"` 即可 |
| 想关闭评论 | 在配置中禁用 Giscus 注入脚本即可 |
| 想禁用时间线 | `SITE.showTimeline = false`（若使用布尔控制） |
| 想精简动画 | 开启系统“减少动态效果”→ 自动降级某些过渡 |

## 结语
Aero Paper v1.0.0 是“打磨体验”与“补齐结构”的交汇点。如果你在使用中遇到任何问题或有功能建议，欢迎通过 Issue 反馈。也希望这套主题能真正帮助你 **专注表达** 而不是与工具 wrestling。

— 祝写作愉快。
