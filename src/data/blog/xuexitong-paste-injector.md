---
title: 破解网页粘贴限制：超星学习通注入器的实现
author: Hazuki Keatsu
tags:
  - 脚本注入
  - Typescript
  - Tampermonkey
pubDatetime: 2025-10-07T23:23:38+08:00
featured: true
draft: false
description: 通过 Selection API 实现对 UEditor 限制粘贴的破除
---

## 一、背景

在使用超星学习通的时候，发现编辑器禁用了粘贴功能。这种限制通过拦截键盘事件和剪贴板事件实现，但本质上只是前端的把戏。既然是浏览器环境，我们就有办法绕过它。

这个项目的目标很简单：**让粘贴功能恢复正常**。

## 二、技术方案
### 1. 核心思路

超星学习通使用 UEditor 作为富文本编辑器。UEditor 运行在 iframe 中，通过监听键盘和粘贴事件来阻止用户操作。要破解这个限制，需要做三件事：

1. 屏蔽掉页面的警告弹窗
2. 拦截粘贴操作
3. 直接操作 iframe 内的 DOM，把内容插进去

### 2. 代码架构

```plaintext
├─ script
│  └─ build-userjs.js   # 构建脚本
├─ src
│  └─ main.ts           # 源代码
├─ package.json         # 项目信息
└─ tsconfig.json        # ts 配置
```

`main.ts` 是主程序，编写了所有的代码逻辑。`build-userjs.js` 把编译后的 JS 包装成 TamperMonkey 脚本。

## 三、实现细节
### 1. 禁用弹窗 

第一步是干掉那些烦人的警告：

```typescript
function disablePopups() {
    window.alert = function () { };
    window.confirm = function () { return true; };
    window.prompt = function () { return null; };

    ['copy', 'cut', 'selectstart'].forEach(eventType => {
        document.addEventListener(eventType, function (e) {
            e.stopImmediatePropagation();
        }, true);
    });
}
```

直接覆盖 `window.alert` 等函数，让它们失效。同时拦截 `copy` 和 `cut` 事件，但注意保留 `paste` 和 `contextmenu`，因为这些是编辑器正常工作需要的。

这里用了 `stopImmediatePropagation()`，它比 `stopPropagation()` 更彻底，能阻止同一元素上其他监听器的执行。

### 2. 事件监听

关键在于找到 UEditor 的 iframe 并监听它的事件：

```typescript
function setupUEditorListeners() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, index) => {
        try {
            const iframeDoc = iframe.contentDocument;
            if (iframeDoc) {
                iframe.contentWindow?.addEventListener('keydown', function (e) {
                    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                        e.preventDefault();
                        injectContent();
                    }
                }, true);
                iframe.contentWindow?.addEventListener('paste', function (e) {
                    e.preventDefault();
                    // 处理粘贴
                }, true);
            }
        } catch (error) {
            // 跨域iframe会抛异常，忽略即可
        }
    }
}
```

遍历页面上所有 iframe，尝试访问它们的 `contentDocument`。如果能访问，就给它们加上键盘和粘贴事件监听。跨域的 iframe 会抛异常，直接捕获忽略。

监听器设置在第三个参数传入 `true`，表示捕获阶段就执行，这样能抢在编辑器自己的监听器之前拦截事件。

### 3. 内容注入

这是最核心的部分。有三种策略，按优先级降级：

**策略一：Selection API**

现代浏览器提供了 Selection API，可以精确控制光标位置：

```typescript
function simulateTextInput(doc: Document, win: Window, content: string) {
    const selection = win.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();  // 删除选中内容
        const contentFragment = contentToNode(content);
        const contentNodes = Array.from(contentFragment.childNodes);
        contentNodes.forEach(node => {
            range.insertNode(node);
            range.setStartAfter(node);
            range.collapse(true);
        });
    }
}
```

先获取当前选区，删除选中的内容（如果有的话），然后逐个插入新节点。每插入一个节点，就把 range 移到它后面，保证下一个节点插在正确位置。

**策略二：创建选区**

如果没有现成的选区，就在可编辑元素末尾创建一个：

```typescript
const editableElement = doc.querySelector('body.view') ||
    doc.querySelector('[contenteditable="true"]') ||
    doc.body;

if (editableElement) {
    const newRange = doc.createRange();
    newRange.selectNodeContents(editableElement);
    newRange.collapse(false);  // 折叠到末尾
    const newSelection = win.getSelection();
    newSelection?.addRange(newRange);
    // 递归调用，现在有选区了
    simulateTextInput(doc, win, content);
}
```

`collapse(false)` 把选区折叠到末尾，然后递归调用自己，这次就能走策略一的逻辑。

**策略三：直接 DOM 操作**

如果前两种都失败，就回退到最简单的方法：

```typescript
const fallbackElement = doc.querySelector('body.view') || doc.body;
if (fallbackElement) {
    const newElement = contentToNode(content);
    fallbackElement.appendChild(newElement);
}
```

直接把内容追加到编辑器末尾。虽然不能在光标处插入，但至少能用。

### 4. 内容处理

`contentToNode()` 函数负责把纯文本转换成合适的 DOM 结构：

```typescript
function contentToNode(content: string): DocumentFragment {
    const frag = document.createDocumentFragment();
    const normalized = content.replace(/\r\n?/g, '\n');
    // 两个连续换行视为段落分隔
    const paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
    paragraphs.forEach((paragraphText, pIndex) => {
        if (pIndex > 0) {
            frag.appendChild(document.createElement('br'));
            frag.appendChild(document.createElement('br'));
        }
        const lines = paragraphText.split('\n');
        lines.forEach((line, lIndex) => {
            // 处理特殊字符
            const processedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/ /g, '&nbsp;')
                .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&ZeroWidthSpace;');
            if (processedLine !== line) {
                const span = document.createElement('span');
                span.innerHTML = processedLine;
                while (span.firstChild) {
                    frag.appendChild(span.firstChild);
                }
            } else {
                frag.appendChild(document.createTextNode(line));
            }
            if (lIndex < lines.length - 1) {
                frag.appendChild(document.createElement('br'));
            }
        });
    });
    return frag;
}
```

这个函数做了几件事：

1. 统一换行符为 LF
2. 识别段落（两个连续换行）和普通换行
3. 转义 HTML 特殊字符，防止注入攻击
4. 把空格和制表符转成 `&nbsp;`，保留格式
5. 用 `<br>` 表示换行

最后返回 DocumentFragment，它是轻量级的 DOM 容器，可以一次性插入多个节点。

### 5. 事件触发

插入内容后，需要通知编辑器内容已改变：

```typescript
const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: content
});

editableElement.dispatchEvent(inputEvent);
```

手动触发 `input` 事件，让编辑器的状态同步。`bubbles: true` 表示事件会冒泡，这样编辑器在父元素上的监听器也能收到通知。

## 四、构建流程

项目使用 TypeScript 编写，构建分两步：

1. `tsc` 编译 TypeScript
2. `build-userjs.js` 包装成用户脚本

构建脚本很简单：

```javascript
const banner = `// ==UserScript==
// @name         超星学习通粘贴注入器
// @namespace    https://keatsu.top/
// @version      ${packageVersion}
// @match        https://*.chaoxing.com/mooc-ans/*
// @run-at       document-start
// @grant        none
// ==/UserScript==`;

const js = fs.readFileSync(inputPath, 'utf-8');
fs.writeFileSync(outputPath, banner + js);
```

关键是 `@run-at document-start`，让脚本在文档开始加载时就执行，这样能尽早劫持事件。

## 五、兼容性处理 

代码中有多处降级策略：

1. Selection API → 创建选区 → 直接 DOM 操作
2. ClipboardEvent.clipboardData → navigator.clipboard API

这保证了在不同浏览器和不同情况下都能工作。

## 六、总结

这个项目的核心是理解浏览器的事件机制和 DOM 操作。通过在捕获阶段拦截事件、使用 Selection API 精确控制光标、以及合理的降级策略，实现了对网页粘贴限制的突破。

整个实现不到 300 行代码，但包含了不少细节：事件传播、iframe 跨域、Selection API、DOM 操作、事件模拟等。这些技术在其他需要操作页面的场景中同样适用。

代码已开源在 GitHub，欢迎参考和改进：

::github{repo="hazuki-keatsu/xuexitong-paste-injector"}