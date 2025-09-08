---
title: GitHub Repository Cards Test
pubDatetime: 2025-09-08T22:58:16+08:00
description: 
    Testing GitHub repository cards with new syntax
draft: false
tags:
  - github
  - test
---

# GitHub Repository Cards

This page demonstrates the new GitHub repository card syntax.

## Astro Repository

::github-card{user="withastro" repo="astro"}

## Vue.js Repository  

::github-card{user="vuejs" repo="vue" theme="dark"}

## Tailwind CSS Repository

::github-card{user="tailwindlabs" repo="tailwindcss" theme="auto"}

## Error Case (Non-existent Repository)

::github-card{user="nonexistent" repo="repository"}
