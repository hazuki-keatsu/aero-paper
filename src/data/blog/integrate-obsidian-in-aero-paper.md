---
author: Hazuki Keatsu
title: 在 AeroPaper 中使用 Obsidian 进行文章书写
tags:
  - AeroPaper
  - Obsidian
pubDatetime: 2025-09-16T13:09:27+08:00
featured: false
draft: false
description: 使用 Obsidian 作为 AeroPaper 的文章编辑器，包含 Excalidraw 等插件的配置。
---
## 前言

Obsidian 是一个现在十分流行的 Markdown 编辑器。它的核心功能完全免费，只有部分需要服务器开销的功能付费（例如，同步功能），此外它还有一个活跃的开源插件社区，有很多好用的插件。所以，Obsidian 也是本人最推荐的 Markdown 文本编辑器。

## 一、Obsidian 的基本逻辑

Obsidian 并不像很多常见的文本编辑器一样，它没有一个全局的设置选项，这意味着每一个仓库都会有一个独立的设置和插件系统，相关的数据全部存储在`.obsidian`文件夹中。这个设计降低里仓库传输的插件配置成本（毕竟所有的相关文件都在仓库中），同时这个设计也导致了我们需要重复地安装和配置插件。

## 二、插件推荐

这里推荐三个我经常使用的插件：

### 1. Excalidraw

Excalidraw 本身不是 Obsidian 的原生开源插件，它是一个开源前端无限绘图的白板软件。但是由于它优秀的绘图体验和与 Obsidian 的完美集成，所以我还推荐给大家，通过这个插件，您可以很方便地在 Obsidian 中绘制 SVG 矢量图。

Excalidraw 原项目仓库：

::github{repo="excalidraw/excalidraw"}

Obsidian Excalidraw 插件项目仓库：

::github{repo="zsviczian/obsidian-excalidraw-plugin"}

### 2. Paste Image Rename

这个是一个对粘贴图片进行重命名的插件，可以将粘贴的图片自动命名为 `{{fileName}}-{{自增后缀}}` 形式，省去手动命名的烦恼。

将`Always add duplicate number`和`Auto rename`打开即可。

### 3. TinyPNG Image

这个插件是 TinyPNG 的 Obsidian 集成，但是它需要 Tinify 的 API，如果您有相关的 API 的话，这个插件还是很好用的（如果你需要手动压缩你的图片）

## 三、Obsidian 目录配置

### 1. Excalidraw 相关配置

我在`src/data/blog/`目录中创建了`_obsidian`文件夹，在这个文件夹中存储临时的文件（`temp/`）和 Excalidraw 的绘图数据文件（`Excalidraw/`）。（这里的临时文件指的其实是我在 Excalidraw 中插入的图片文件）

因此你需要修改 Excalidraw 配置中的`基本 -> Excalidraw 文件夹`配置为`_obsidian/Excalidraw`

### 2. 修复 Obsidian 图片预览问题

由于，Astro 通常只会读取`src/assets/`和`public/`中的图片资源文件，所以为了保证 Astro 正常构建，我们没办法将图片放在`src/data/blog/`中的任何位置。

为了防止博客中的图片被 Astro 压缩，图片相关的资源文件按应该被放置在`public/`文件夹中。

因此，我通过**软链接**的方式，在`src/data/blog/`中创建了一个文件夹的软链接到`public/`的同名文件夹中。这方式同时解决了 Astro 对图片的压缩问题和 Obsidian 的图片预览问题。

```powershell
# 相关的命令：
# PowerShell
cmd /c mklink /J D:\keatsu-top-blog\src\data\blog\blog-assets D:\keatsu-top-blog\public\blog-assets

# cmd
mklink /J D:\keatsu-top-blog\src\data\blog\blog-assets D:\keatsu-top-blog\public\blog-assets
```

接下来在 Obsidian 中按下图中的配置来设置，就可以实现对图片的预览和粘贴图片自动放入`blog-assets`文件夹中

![](blog-assets/integrate-obsidian-in-aero-paper-1.png)

## 四、Astro 配置

因为您修改了`src/data/blog/`的内容，由于 Excalidraw 的绘图数据文件你不符合现有的 Aero Paper 配置，所以，你需要对 Astro 的配置进行微调。

```typescript del={8} ins={9-12} collapse={1-6, 13-30}
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog"; 

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  loader: glob({
    pattern: ["**/*.md", "!_obsidian/**", "!.obsidian/**", "!blog-assets/**"],
    base: `./${BLOG_PATH}`
  }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

export const collections = { blog };
```

同时，如果你有使用 Git 进行版本管理，我建议你将`src/data/blog/blog-assets`添加进`.gitignore`中，毕竟你也不想自己的文件被存储两遍吧。

> [!NOTE]
> 本篇文章使用 Obsidian 撰写。

