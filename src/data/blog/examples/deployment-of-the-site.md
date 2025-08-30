---
author: Hazuki Keatsu
pubDatetime: 2025-08-29T17:47:57+08:00
title: 本站的部署方法
featured: true
draft: true
tags:
  - deployment
description: 
  介绍了以下本站的部署方法。
---

## 目录

## 服务器的选择

本站使用的是阿里云的 OSS 对象存储来进行静态站点托管。

## 具体步骤

### 1.创建 OSS 存储桶

- 登录阿里云控制台，进入「对象存储 OSS」服务
- 点击「创建 Bucket」：
  - Bucket 名称：自定义（如 `keatsu-top`）
  - 地域：选择离目标用户近的区域
  - 存储类型：标准存储
  - 读写权限：公共读 **（重要，否则无法访问）**
    - *__注意__：这个在创建时无法修改，可以在创建后在「权限管理」 -> 「读写权限」中进行修改*
  - 其他默认，完成创建

### 2.上传博客文件

- 方式 1（手动上传）：
  - 进入 Bucket 的「文件管理」->「文件列表」，点击「上传文件」
  - 再点击「扫描文件」，进入本地 AeroPaper 项目构建后的`dist`目录，保持里面的文件结构，将所有的文件上传至 Bucket 根目录
  - 接着点击「上传文件」
- 方式 2（官方工具，推荐）：
  1. 安装阿里云 OSS 命令行工具`ossutil`（[官方文档](https://help.aliyun.com/zh/oss/developer-reference/ossutil-overview/)）
  2. 配置访问凭证：`ossutil config`，输入 AccessKey ID、Secret、Region 和 Endpoint（使用默认）
     - 先在[RAM 访问控制](https://ram.console.aliyun.com/overview)的「身份管理」->「用户」中创建用户
     - 输入你的「登录名称」和「显示名称」后，勾选使用「永久 AccessKey 访问」，然后点击确定
     - 在接下来的界面，复制 AccessKey ID 和 AccessKey Secret
  3. 给予刚才新建的用户权限：回到「身份管理」->「用户」中，点击「添加权限」，勾选「AliyunOSSFullAccess」
  4. 上传文件：
	```bash
	# 同步本地dist目录到OSS（替换your-bucket-name和region）
	ossutil sync ./dist oss://your-bucket-name -r
	```

### 3.配置静态网站托管
- 进入创建好的 Bucket，点击「数据管理」->「静态页面」
- 点击「设置」：
  - 默认首页：`index.html`
  - 错误页面：`404.html`（Astro 默认生成或自行创建）
  - 其他的选项保持默认
  - 保存配置

### 4.配置域名

> 由于阿里云出了[新的规定](https://help.aliyun.com/zh/oss/static-website-hosting-overview?spm=5176.8466029.0.0.21e81450Cn4xNn)，自 2018 年 8 月 13 日起，我们使用 OSS 默认域名访问中国大陆、中国香港地区 OSS 上的网页类型文件（mimetype 为 text/html，扩展名包括 htm、html、jsp、plg、htx、stm），Response Header 中会自动加上Content-Disposition:'attachment=filename;'。即从浏览器访问网页类型文件时，不会显示文件内容，而是以附件形式进行下载。所以，我们必须绑定我们自己备案的域名，才能够正常访问网页。

- 进入「Bucket 配置」->「域名管理」页面，点击「绑定域名」
- 然后，输入你的域名（阿里云会要求你的域名备案，可在[这里](https://beian.aliyun.com/pcContainer/selfEntity)完成备案）
  - 备案可能会要求你填写你的「网站接入信息」，我填的是我在阿里云名下的一个 ECS 实例，似乎 OSS 没办法直接作为「网站接入信息」