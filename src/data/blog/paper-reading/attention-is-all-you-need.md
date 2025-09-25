---
author: Hazuki Keatsu
tags:
  - 人工智能
  - 论文阅读
title: 《Attention is all you need》论文解读
pubDatetime: 2025-09-22T17:54:29+08:00
featured: false
draft: false
description: 《Attention is all you need》论文解读
---
## 前言

> [!TIP]
> 本文章有一个通俗版本，请看[Transformer 学习笔记](./transformer)

## 一、概述

在 Transformer 框架诞生之前，人们主要通过 CNN 和 RNN(相比于前者，这个被应用得更多一点) 来作为**序列转导模型**来对诸如自然语言等序列化的数据进行序列转导处理。这些当时主流模型具有以下特征：
1. 基于 RNN / CNN
2. 使用编码器-解码器的结构
3. 使用注意力机制增强表现

Transformer 创新点在于它完全摒弃了 RNN / CNN，同时完全基于注意力机制，但是它仍然在使用编码器-解码器的架构。通过以上的这些改进，使 Transformer 模型获得更好的表现的同时，并行计算的优势也极大的加快了模型训练的速度（当然，相比 RNN 推理速度是下降了的）。

> [!NOTE]
> **序列转导模型**指的使处理序列数据的模型。序列数据，即具有顺序关系的数据，每个元素的顺序对于数据的整体含义非常重要。
> 
> 典型的序列转导任务有：文本翻译、文本生成、语音转文字等。

## 二、前备知识

### 1. FNN(Feedforward Neural Network) 前馈神经网络

前馈神经网络由于它的输入层的长度是固定的，虽然可以通过平均或者拼接词嵌入来输入输入层，但是这样会导致序列信息的丧失，因此不太适合用在序列转导任务上。

![FNN 架构图](/blog-assets/FNN.svg)

### 2. RNN(Recurrent Neural Network) 循环神经网络

相比于前面 FNN，它解决了以下问题：

1. 能够建模词序：RNN 是按照时间顺序（token 顺序）逐个输入处理的
2. 能够建模上下文依赖：RNN 是逐个喂入词语的，并且会有“记忆”机制
3. 支持不定长度的输入：不再需要 FNN 那种固定长度的输入格式；

但是，由于循环的不断延长，它会导致以前输入的信息逐渐丢失。同时，RNN 只适合用来处理输入和输出长度一致的序列。

![RNN 架构图](/blog-assets/RNN.svg)

### 3. Encoder-decoder 编码器-解码器结构

让两个 RNN 单独处理输入和输出，输入的部分就是编码器，它会产生一个上下文向量，涵盖了整个输入文本的语义信息。解码器对上下文向量进行解码，将其转化为目标的输出。

![Encoder-decoder 架构图](/blog-assets/Encoder-decoder.svg)

### 4. Attention Mechanism 注意力机制

注意力机制解决的问题：
1. 解决模型处理长序列时的“遗忘”问题：随着序列长度的增长，远距离依赖信息在传递过程中易被稀释，导致模型对长距离依赖关系的建模能力减弱。
2. 解决不同时间步输入对当前时刻输出的“重要性”问题：所有时间步的输入在计算当前时刻输出时被同等对待，忽略了不同时间步对当前时刻输出的重要性可能存在的差异。

![Attention Mechanism](/blog-assets/SelfAttention.svg)

> [!TIP]
> 其实讲到这里，你会发现很多在序列转导任务的问题都已经被解决了。但是还有一个问题始终困扰着人们，那就是**并行化**计算的问题。由于 RNN 下一次生成的结果会依赖于上一次计算的结果，所以导致运算效率较低，因此论文中完全抛弃了 RNN 的架构。


## 三、Transformer 的提出

为了解决并行计算的问题，有科学家提出使用 CNN 来替代 RNN 进行模型转导任务，但是这样做又将之前的 RNN 的记忆力下降的问题重新引回来了。在这种情况下，论文大胆提出 Transformer 架构——完全基于注意力机制。

### 1. 模型架构

<img class="prose" style="width: 50%" src="/blog-assets/ModalNet-21.png">

**架构解读：**

> [!TIP]
> [架构详解图](/blog-assets/TransformerModalStructure.svg)
> 此图片是svg矢量图，直接展示影响网站性能，所以请右键查看高清无损图片。

