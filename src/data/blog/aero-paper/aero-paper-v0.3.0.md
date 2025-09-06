---
author: Hazuki Keatsu
title: "Aero Paper v0.3.0 特性"
pubDatetime: 2025-09-02T18:39:19+08:00
featured: false
draft: false
tags: 
  - AeroPaper
description: 新的特性加入！
---

## 前言

## 一、特色 Markdown 标签支持

> [!NOTE]
> 这是一个笔记标签，用于提供额外的信息或说明。

> [!TIP]
> 这是一个提示标签，用于分享有用的建议或技巧。

> [!WARNING]
> 这是一个警告标签，用于提醒用户注意潜在的问题。

> [!IMPORTANT]
> 这是一个重要标签，用于强调关键信息。

> [!CAUTION]
> 这是一个小心标签，用于警告可能的危险或风险。

> [!INFO]
> 这是一个信息标签，用于提供一般性的信息。

> [!SUCCESS]
> 这是一个成功标签，用于表示操作成功或正面结果。

> [!DANGER]
> 这是一个危险标签，用于警告严重的风险或错误。

## 二、LaTeX 公式数学支持

### 1. 基本运算

$a + b = c$

$x \times y = z$

$\frac{a}{b} = c$

$a^2 + b^2 = c^2$

$x^n + y^n = z^n$

$\sqrt{x} + \sqrt{y} = \sqrt{z}$

$\sqrt[n]{x} = y$

$\sin^2\theta + \cos^2\theta = 1$

$\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$

$\sin(A+B) = \sin A \cos B + \cos A \sin B$

### 2. 矩阵

$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9 \\
\end{bmatrix}
$

### 3. 积分与极限

$\int_{a}^{b} f(x) \, dx$

$\int f(x) \, dx = F(x) + C$

$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$

### 4. 复杂公式

$
\dfrac{1}{2\pi i} \displaystyle \oint_{\gamma} \dfrac{f(z)}{z - a} dz = 
\begin{cases} 
f(a) & \text{如果 } a \text{ 在 } \gamma \text{ 内部} \\
0 & \text{如果 } a \text{ 在 } \gamma \text{ 外部}
\end{cases}
$

$G_{\mu\nu} + \Lambda g_{\mu\nu} = \dfrac{8\pi G}{c^4} T_{\mu\nu}$

## 三、新增统计页面

在 Header 部分会展示一个 “[统计](/stats)” 的标签，这个页面有你的文章统计等信息。
