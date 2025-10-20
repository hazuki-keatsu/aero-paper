---
author: Hazuki Keatsu
title: "用 remark + rehype 打造自定义 Markdown 语法扩展"
pubDatetime: 2025-10-08T17:18:19+08:00
featured: false
draft: false
description: 介绍如何在 Astro 博客里用 remark 与 rehype 定制指令语法，落地 Github 仓库卡片(::github) 与时间轴块(::time-block) 两个扩展，从语法设计、解析到组件渲染的完整过程。
tags:
  - Unified
  - AeroPaper
---

## 前言

写博客时经常碰到两个痛点：

1. 引用 GitHub 仓库：手写链接 + 描述枯燥，还得自己更新 Star/Fork 数。
2. 做时间轴：Markdown 原生命令式写法不直观，HTML 难维护同时代码复用率低。

于是 Aero Paper 就实现了两个 Github 扩展语法：

- `::github{repo="owner/repo"}` —— 自动拉取 GitHub API，生成卡片。
- `::time-block{time="..." title="..." detail="..." image="..." hideTime=true}` —— 渲染一个时间线节点。

它们的核心是 **remark (处理 Markdown 语法层)** + **rehype (处理 HTML/AST 渲染层)** 的配合，再加上一点自定义 AST 转换和组件映射。

下面按“语法 → 解析 → 组件 → 注册 → 使用 → 细节” 这条线梳理实现。

## 目标与设计原则

- 写法短：不引入多余括号/前缀。
- 纯 Markdown 文件即可调用，不侵入构建流程。
- 失败时“静默”降级，不炸页面（返回隐藏节点）。
- 方便继续扩展新指令（共用同一转换插件）。

## 技术路线概览

Markdown 解析链大致分三段：

1. remark 阶段（mdast）：`remark-directive` 识别 `::name{attr=...}` 语法，产出 *directive* 节点。
2. 自定义插件把 *directive* 节点转成普通 mdast 节点并附加 `data.hName / data.hProperties`。
3. rehype 阶段（hast）：`rehype-components` 根据标签名（如 `github`、`time-block`）调用对应组件函数生成最终 DOM 结构。

对应到项目里的文件：

- 解析插件：`remark-directive-rehype.ts`
- GitHub 卡片组件：`rehype-component-github-card.ts`
- 时间轴组件：`rehype-component-timeline-block.ts`
- 注册位置：`astro.config.ts`

## 第一步：启用 remark 指令语法

安装（项目里已装）：

```bash
pnpm add remark-directive rehype-components hastscript unist-util-visit
```

在 `astro.config.ts`：

```ts
import remarkDirective from 'remark-directive';
import { parseDirectiveNode } from './src/utils/rehype-component/remark-directive-rehype';

markdown: {
  remarkPlugins: [
    remarkDirective,
    [parseDirectiveNode, {}],
  ],
  rehypePlugins: [
    [rehypeComponents, { components: { github: GithubCardComponent, 'time-block': TimelineBlockComponent } }]
  ],
}
```

## 第二步：把指令节点转成可被 rehype 识别的标签

核心逻辑（节选）：

```ts
visit(tree, (node: any) => {
  if (node.type === 'containerDirective' || node.type === 'leafDirective' || node.type === 'textDirective') {
    const data = node.data || (node.data = {});
    node.attributes = node.attributes || {};

    if (node.name === 'time-block') {
      const { time, title, detail, image, imageAlt, hideTime } = node.attributes;
      const props: Record<string, string> = { time: time||'', title: title||'', detail: detail||'', image: image||'', imageAlt: imageAlt||'' };
      if (typeof hideTime !== 'undefined') props.hideTime = String(hideTime);
      const hast = h('time-block', props) as any;
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
    } else {
      const hast = h(node.name, node.attributes) as any;
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
    }
  }
});
```

要点：

- 利用 `data.hName / data.hProperties` 让后续 rehype 把它当成普通标签。
- “特例优先”——`time-block` 有专门处理，其它按默认走。
- 可在这里做语法校验（未做太多限制，保持灵活）。

## 第三步：组件层（rehype-components）

### 1. GitHub 仓库卡片

```ts
export function GithubCardComponent(props, children) {
  if (Array.isArray(children) && children.length) return h('div', { class: 'hidden' }, 'Invalid directive');
  if (!props.repo || !props.repo.includes('/')) return h('div', { class: 'hidden' }, 'Invalid repo');
  // 生成占位 DOM + 脚本 (fetch GitHub API 后填充)
  return h(`a#${cardUuid}-card`, { class: 'card-github fetch-waiting', href: `https://github.com/${repo}`, target: '_blank', repo }, [ ... ]);
}
```

特点：

- 先渲染框架，再用延迟脚本填充数据（避免阻塞）。
- 使用 `Intl.NumberFormat` 做 Star/Fork 数缩写。
- 利用随机短 ID 解决多个卡片的 DOM 定位问题，碰撞不敏感。
- 出错时加 `fetch-error` 类，方便样式降级。

### 2. 时间轴块

```ts
export function TimelineBlockComponent(props, children) {
  // time 解析为本地化日期/时间；hideTime=true 则只显示日期
  // detail 优先 children，其次 detail 字符串，可识别内嵌 HTML
  return h('div', { class: 'timeline-block' }, [...])
}
```

细节：

- `hideTime` 兼容多种真值：`true/1/yes/on`。
- 支持嵌入图片（封面）+ 自由富文本描述。
- 若作者希望写更复杂内容，直接用容器指令：

  ```markdown
  :::time-block{time="2025-09-16T17:42:17+08:00" title="公安备案通过"}
  这里可以写 **Markdown**，也可以继续引用其它指令。
  :::
  ```

  （当前实现里主要用叶指令风格 `::time-block{...}`，容器模式也可拓展。）

## 第四步：在 Markdown 中使用

最简单：

```markdown
::github{repo="hazuki-keatsu/aero-paper"}

::time-block{time="2025-09-16T17:42:17+08:00" title="公安备案通过" detail="本小破站公安备案通过..." image="/blog-assets/website-filing-approval-1.png" imageAlt="备案截图"}
```

时间轴页面就是一组连续的 `::time-block{...}`。

## 第五步：错误与降级策略

| 场景 | 行为 |
|------|------|
| repo 不合法 | 渲染一个 `hidden` 的 div，避免破坏排版 |
| GitHub API 失败 | 加 `fetch-error` 类，可在 CSS 给灰色占位 |
| time 解析失败 | 原样显示传入字符串 |
| hideTime 未传 | 默认显示日期+时间 |

这种策略让“写错了”不会直接炸渲染，也方便后续埋点统计。

## 第六步：性能与缓存

- GitHub API：浏览器端 `fetch`，利用 GitHub 自身 CDN + `cache: 'force-cache'`；多次访问基本命中。
- 卡片脚本 defer，不阻塞主文档解析。
- astro 侧无需 SSR 获取仓库信息，避免构建时打 API。

## 第七步：可拓展套路

再加一个新指令的步骤：

1. 设计语法：`::xxx{...}`。
2. 在 `parseDirectiveNode` 里判断 `node.name === 'xxx'`，补齐属性。
3. 写 `rehype-component-xxx.ts` 返回 hast 结构。
4. 在 `astro.config.ts` 的 `rehypeComponents` 里注册。

## 为什么不直接写 HTML

- Markdown 指令让文章主体更“内容导向”，不被结构性噪音打断。
- 语义更清晰，可做后续静态分析（统计引用仓库、生成时间轴数据等）。
- 统一风格：改卡片样式只动组件文件。

## 总结

通过 **remark 指令语法 + 自定义指令到 hast 转换 + rehype 组件映射**，可以在不修改 Markdown 书写习惯的前提下，给博客注入结构化、可维护、可继续扩展的“语法小组件”。

当前两个例子已经覆盖了：

- 外部数据注入（GitHub API）
- 结构化时间线展示（时间解析 + 富文本）

如果你也在折腾自己的博客，不妨试试这套方式。
