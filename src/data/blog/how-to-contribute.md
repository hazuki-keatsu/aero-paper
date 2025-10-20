---
author: Hazuki Keatsu
pubDatetime: 2025-10-20T17:15:49+08:00
title: 如何贡献你喜欢的开源项目
featured: true
draft: false
tags:
  - 随笔
description: 主要介绍一下自己向Traintime_PDA贡献代码的心得体会。
---

## 前言

我混迹了Github这么久，也终于是提出了我的第一次Pull Request，下面主要讲讲我自己的一些心得体会和经验，如果讲的不好还请指正。

## 一、沟通很重要

无论你想干什么事，首先你都要学会去和别人沟通。沟通是解决问题的关键，也是合作的基础。在开源项目中，沟通尤为重要，因为项目通常由多个开发者共同维护，每个人都有自己的想法和建议。因此，你需要学会如何与他人交流，如何表达自己的观点，如何听取他人的意见。

你如果发现了Bug或者是想提出一个改进，你可以先去仓库里面的Issue板块，看看有没有人提出了和你一样的建议，即使是已经关闭的Issue也可以去看看。

如果有，你可以留意一下该Issue下面的评论，看看任务有没有被分配，如果已经有人开始相关的工作了，你就不要去和它做一样的工作，避免重复劳动。如果没有，你就可以提出Issue，报告Bug的真实性，提出可能的解决方案（或者是提出你想如何实现你的改进），然后就是和项目的管理人员积极交流。如果大家确认了这个确实是个Bug，你就可以提出修复认领。这样子可以有效避免重复劳动。

## 二、熟悉项目贡献规范

阅读项目根目录的`CONTRIBUTING.md`（或`CONTRIBUTE.md`），了解提交 PR 的要求（如代码风格、测试要求、分支规范等）。

查看项目的`README.md`，了解本地开发环境搭建步骤（依赖安装、编译命令、测试方法等）。

## 三、本地开发

按照`README.md`完成项目环境配置之后，你就可以着手于开发了。

### 1. 创建你的Fork分支

普通开发者通常是没有项目仓库的推送权限的，如果你想使用Github这样的远程代码托管平台，你首先要创建你的Fork分支。然后将你的Fork分支Clone到本地。

### 2. 创建Branch分支

我不建议大家直接在主分支(main)上修改代码，而是应该创建一个新的分支来开发你的功能或修复问题。这样可以保持主分支的稳定性和可追溯性，避免了你在写坏代码之后导致程序无法运行的问题。

> [!NOTE] Branch分支名的命名规则(仅供参考)
> - 命名格式：`feature/feature-name`或`fix/issue-number`
> - 示例：`feature/add-new-feature`或`fix/1234`

### 3. 提交(Commit)你的修改

接下来，你的所有的开发都应该在你刚刚创建的分支(Branch)上进行。

你每次完成一个小的任务，并且经过测试没有问题后，你就可进行一次提交。

**Commit Message的编写规范：**

~~~plaintext
<类型>[可选范围]: <主题行>  # 必填！72字符内
                           # 空行
[正文描述]                 # 说明为什么修改
                           # 空行
[脚注]                     # 破坏性变更/Issue关联
~~~

1. **提交类型（Type）**- 决定提交性质

| 类型 | 描述 |
|---|---|
| feat | 添加新功能 |
| fix | 修补bug |
| docs | 文档更新（README、注释等） |
| style | 代码格式（不影响代码运行的变动） |
| refactor | 重构（即不是新增功能，也不是修改bug的代码变动） |
| test | 增加测试用例 |
| chore | 构建过程或辅助工具的变动 |
| ci | CI/CD相关（.gitignore/workflow） |
| build | 构建系统相关的变更 |

2. **范围（Scope）**- 限定影响模块

在这个地方记录你的修改会影响到的模块。

~~~plaintext
feat(login):
feat(header):
refactor(auth-api):
...
~~~

3. **主题行（Subject）**- 命令式语气黄金法则

**用祈使语气书写**。不要使用过去式，不要使用进行时等。

~~~plaintext
feat(experiment_score): Add experiment score fetch logic
~~~

4. **正文描述（Body）**- 详细描述修改内容

在这个地方详细讲述你是怎么做的，为什么要这样做。

~~~plaintext
feat(experiment_score): Add experiment score fetch logic

- Implement logic to fetch experiment score from API
- Update UI to display experiment score
~~~

5. **脚注（Footer）**- 破坏性变更/Issue关联

这个地方通常用于补充元信息（如关联 Issue、标记重大变更、致谢等），位于消息的最后，与正文通过一个空行分隔。脚注的格式有约定俗成的规范，尤其在遵循 **Conventional Commits**（语义化提交）规范的项目中，脚注的写法更具结构性。

例如：

~~~plaintext
feat(experiment_score): Add experiment score fetch logic

- Implement logic to fetch experiment score from API
- Update UI to display experiment score

BREAKING CHANGE: This change requires a new API endpoint
Closes #1234
~~~

脚注主要有以下几种：

| 标记 | 描述 | 备注 |
| --- | --- | --- |
| BREAKING CHANGE: <description> | 重大变更，需要用户注意 | - |
| Closes: <issue_number> [, <another_issue_number>] | 关联 Issue | 会被Github识别并触发关闭Issue的事件 |
| Related-to: <issue_number> [, <another_issue_number>] | 关联 Issue | 会被Github识别并关联Issue |
| See-also: <issue_number> [, <another_issue_number>] | 另见 Issue | 会被Github识别并关联Issue |
| Thanks: <person_name> | 致谢某人 | - |
| Reviewed-by: <person_name> | 代码审查者 | - |
| Tested-by: <person_name> | 代码测试者 | - |
| Inspired-by: <person_name> | 灵感来源 | - |
| Docs: <message> | 文档更新 | - |
| Performance: <message> | 性能相关 | - |
| Dependencies: <message> | 依赖变更 | - |

**以上的若干个部分只有提交类型和主题行是必要的，但是我还建议你书写其他的部分。**

### 4. 推送(Push)你的修改到Github

当你完成你的所有修改后，你就可以将你的修改推送到Github。

但是这里有一件事很重要，就是确认代码是否有冲突。你可以去你Fork的仓库页面查看你的Fork版本是否落后于主仓库，如果是的话，你需要先将主仓库的最新代码同步到你的Fork分支，然后拉取(Pull)到你的本地分支，解决冲突之后再进行推送。

### 5. 创建Pull Request

当你推送完成之后，你就可以去你的Fork仓库页面，点击“Compare & pull request”按钮，提交你的Pull Request。

在Pull Request的描述中，你可以简要说明你做了哪些修改，为什么要做这些修改，以及这些修改解决了哪些问题。同时，你也可以在Pull Request中@相关的维护者，邀请他们来审查你的代码。如果你的修改涉及到某个Issue，你也可以在描述中提及该Issue的编号，这样该Issue会自动关联到你的Pull Request。确保你的Pull Request符合项目的贡献规范，然后点击“Create pull request”按钮提交。

通常在完成上面这些步骤后，你的Pull Request就会进入审查阶段，项目的维护者会对你的代码进行审查，提出修改建议，或者直接合并你的代码。你原来的Issue也会被自动关闭（如果你在Commit Message或者Pull Request描述中提及了该Issue）。

## 注意事项

- **沟通优先**：若 bug 复杂，可先在 Issue 中与维护者讨论修复思路，达成共识后再动手。
- **最小化修改**：只修复当前 bug，不顺便优化其他无关代码（避免审核复杂度）。
- **尊重项目规范**：严格遵循项目的流程和风格，是开源协作的基础。

## 结语

当你完成上面的步骤后，你就成功地为一个开源项目做出了贡献。无论你的修改是多么微小，它都代表了你对开源社区的支持和参与。

总的来说，贡献开源项目是一个学习和成长的过程。通过参与开源项目，你不仅可以提升自己的编程技能，还可以结识志同道合的开发者，扩展自己的技术视野。希望我的经验对你有所帮助，祝你在开源之路上越走越远！

## 一点图片

以下是SuperBart给我寄的一些礼物：

![SuperBart寄来的QSL卡片和光碟](/blog-assets/superbarts-gift.jpg)

**感谢SuperBart送的特别的礼物！**

---

欢迎大家关注Traintime_PDA项目的GitHub仓库：

::github{repo="BenderBlog/traintime_pda"}