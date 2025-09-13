---
author: Hazuki Keatsu
pubDatetime: 2025-09-12T12:45:23+08:00
title: 在Astro中自定义Markdown语法
featured: false
draft: false
tags:
  - AeroPaper
  - Unified
  - Remark
  - Rehype
description: 在 Astro 中通过 Unified 生态中的 Remark 插件和 Rehype 插件实现对自定义 Markdown 语法的支持。
---

## 前言

在开发博客主题的时候，我们可能会有在文章中插入自定义组件元素的需求。如果直接在 Markdown 文本中编辑 Html 元素，一方面是不够简洁，另一方面是代码复用率低。所以有没有方法能实现对 Markdown 文件中的特定语法进行替换，然后再进行渲染的方法呢？这就是本文要介绍的 Remark 和 Rehype 插件。

## 一、Remark 和 Rehype 介绍

### 1. Remark 插件

**Remark** 是一个功能强大的 Markdown 处理器，支持插件扩展功能，适用于 Node.js 和浏览器环境。它不仅可以解析 Markdown，还能通过插件对其抽象语法树（AST）进行修改，实现复杂的文本转换任务。

Remark 的核心基于 **插件化** 设计，允许用户通过插件对 Markdown 的 AST（mdast）进行解析、转换和输出。Remark 主要有以下功能：

- **解析 Markdown**：通过 _remark-parse_ 将 Markdown 转换为 mdast。
- **格式化 Markdown**：通过 _remark-stringify_ 将 mdast 转回 Markdown。
- **扩展功能**：支持 150+ 插件，例如 _remark-gfm_（支持 GitHub 风格的 Markdown）、_remark-toc_（生成目录）等。

下面是一个 Remark 插件的使用示例：

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify'; 

const file = await unified()
.use(remarkParse) // Markdown -> mdast
.use(remarkRehype) // mdast -> hast
.use(rehypeStringify) // hast -> HTML
.process('# Hello, World!');

console.log(String(file)); 
// 输出: <h1>Hello, World!</h1>
// 使用 JSX 即可实现把字符串转化为 DOM 的功能
```

> [!NOTE]
> **mdast** 全称为 **M**ark**d**own **A**bstract **S**yntax **T**ree。
> **MDAST** 将 markdown 解析为抽象语法树。*抽象*意味着并非所有信息都存储在此树中，并且一个精确的副本无法再通过这棵树被重新创建。*语法树意味着***语法存在**于树中，因此可以有一个精确的语法文档能被重建。

### 2. Rehype 插件

**rehype** 是一个强大的 HTML 处理工具，专注于通过插件对 HTML 进行解析、操作和生成。它是 **unified** 生态系统的一部分，使用抽象语法树（AST）来处理 HTML 数据。通过 rehype，开发者可以轻松实现 HTML 的优化、转换和动态生成。

rehype 的核心功能是通过插件对 HTML 进行扩展和定制。插件可以检查和修改 HTML 的结构，适用于服务器端、客户端、命令行工具等多种场景。以下是 rehype 的一个简单用法：

```javascript
const unified = require('unified');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');

unified()
	.use(parse) // 解析 HTML
	.use(stringify) // 转换为 HTML
	.process('<h1>Hello, world!</h1>', (err, file) => {
		if (err) throw err;
		console.log(String(file));
	});
```

## 二、自定义 Github Card 语法的实现