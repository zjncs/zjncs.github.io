---
layout: post
title: "CSS Grid 布局完全指南"
date: 2024-01-30 11:20:00 +0800
categories: [前端开发]
tags: [CSS, Grid, 布局, 响应式设计]
---

CSS Grid是现代Web布局的强大工具，它提供了二维布局系统，让复杂的页面布局变得简单直观。本文将全面介绍Grid布局的使用方法和实践技巧。

## Grid布局基础概念

### 网格容器和网格项

```css
/* 网格容器 */
.grid-container {
    display: grid;
    /* 或者 display: inline-grid; */
}

/* 网格项 */
.grid-item {
    /* 网格容器的直接子元素自动成为网格项 */
}
```

### 基本术语

- **网格容器（Grid Container）**：设置了`display: grid`的元素
- **网格项（Grid Item）**：网格容器的直接子元素
- **网格线（Grid Line）**：构成网格结构的分界线
- **网格轨道（Grid Track）**：两条相邻网格线之间的空间
- **网格单元（Grid Cell）**：四条网格线围成的区域
- **网格区域（Grid Area）**：由任意数量网格单元组成的矩形区域

## 定义网格结构

### 显式网格

```css
.grid-container {
    display: grid;
    
    /* 定义列 */
    grid-template-columns: 200px 1fr 100px;
    /* 等价于 */
    grid-template-columns: 200px auto 100px;
    
    /* 定义行 */
    grid-template-rows: 100px 200px;
    
    /* 网格间距 */
    gap: 20px; /* 行列间距都是20px */
    /* 或者分别设置 */
    row-gap: 20px;
    column-gap: 10px;
}
```

### 使用repeat()函数

```css
.grid-container {
    /* 重复模式 */
    grid-template-columns: repeat(3, 1fr);
    /* 等价于 */
    grid-template-columns: 1fr 1fr 1fr;
    
    /* 混合使用 */
    grid-template-columns: 200px repeat(2, 1fr) 100px;
    
    /* 自动填充 */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

### fr单位和minmax()

```css
.grid-container {
    /* fr单位：剩余空间的分数 */
    grid-template-columns: 1fr 2fr 1fr; /* 1:2:1的比例 */
    
    /* minmax()：最小值和最大值 */
    grid-template-columns: minmax(200px, 1fr) 2fr minmax(100px, 300px);
    
    /* 结合使用 */
    grid-template-columns: 200px minmax(0, 1fr) 100px;
}
```

## 网格项定位

### 基于线的定位

```css
.grid-item {
    /* 指定起始和结束线 */
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    
    /* 简写形式 */
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    
    /* 跨越指定数量的轨道 */
    grid-column: 1 / span 2;
    grid-row: 1 / span 1;
    
    /* 更简洁的写法 */
    grid-area: 1 / 1 / 2 / 3; /* row-start / column-start / row-end / column-end */
}
```

### 命名网格线

```css
.grid-container {
    grid-template-columns: 
        [sidebar-start] 200px 
        [sidebar-end main-start] 1fr 
        [main-end];
    grid-template-rows: 
        [header-start] 100px 
        [header-end content-start] 1fr 
        [content-end footer-start] 50px 
        [footer-end];
}

.header {
    grid-column: sidebar-start / main-end;
    grid-row: header-start / header-end;
}

.sidebar {
    grid-column: sidebar-start / sidebar-end;
    grid-row: content-start / content-end;
}

.main {
    grid-column: main-start / main-end;
    grid-row: content-start / content-end;
}
```

## 网格区域

### 使用grid-template-areas

```css
.grid-container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 100px 1fr 50px;
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    gap: 20px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### 响应式网格区域

```css
.grid-container {
    display: grid;
    gap: 20px;
    
    /* 移动端布局 */
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "sidebar"
        "aside"
        "footer";
}

@media (min-width: 768px) {
    .grid-container {
        /* 平板布局 */
        grid-template-columns: 200px 1fr;
        grid-template-areas:
            "header header"
            "sidebar main"
            "aside main"
            "footer footer";
    }
}

@media (min-width: 1024px) {
    .grid-container {
        /* 桌面布局 */
        grid-template-columns: 200px 1fr 200px;
        grid-template-areas:
            "header header header"
            "sidebar main aside"
            "footer footer footer";
    }
}
```

## 对齐和分布

### 容器级别的对齐

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 200px);
    grid-template-rows: repeat(2, 100px);
    
    /* 整个网格在容器中的对齐 */
    justify-content: center; /* start | end | center | stretch | space-around | space-between | space-evenly */
    align-content: center;   /* start | end | center | stretch | space-around | space-between | space-evenly */
    
    /* 简写 */
    place-content: center center;
    
    /* 网格项在其单元格中的对齐 */
    justify-items: center; /* start | end | center | stretch */
    align-items: center;   /* start | end | center | stretch */
    
    /* 简写 */
    place-items: center center;
}
```

### 项目级别的对齐

```css
.grid-item {
    /* 单个网格项的对齐 */
    justify-self: center; /* start | end | center | stretch */
    align-self: center;   /* start | end | center | stretch */
    
    /* 简写 */
    place-self: center center;
}
```

## 实际应用示例

### 1. 响应式卡片布局

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}
```

```html
<div class="card-grid">
    <div class="card">卡片 1</div>
    <div class="card">卡片 2</div>
    <div class="card">卡片 3</div>
    <div class="card">卡片 4</div>
</div>
```

### 2. 复杂的页面布局

```css
.page-layout {
    display: grid;
    min-height: 100vh;
    grid-template-columns: 250px 1fr;
    grid-template-rows: 60px 1fr 40px;
    grid-template-areas:
        "sidebar header"
        "sidebar main"
        "sidebar footer";
}

.header {
    grid-area: header;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #dee2e6;
}

.sidebar {
    grid-area: sidebar;
    background: #343a40;
    color: white;
    padding: 20px;
}

.main {
    grid-area: main;
    padding: 20px;
    overflow-y: auto;
}

.footer {
    grid-area: footer;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #dee2e6;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .page-layout {
        grid-template-columns: 1fr;
        grid-template-rows: 60px auto 1fr 40px;
        grid-template-areas:
            "header"
            "sidebar"
            "main"
            "footer";
    }
    
    .sidebar {
        max-height: 200px;
        overflow-y: auto;
    }
}
```

### 3. 图片画廊

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: 200px;
    gap: 10px;
    padding: 20px;
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

/* 特殊尺寸的项目 */
.gallery-item.large {
    grid-column: span 2;
    grid-row: span 2;
}

.gallery-item.wide {
    grid-column: span 2;
}

.gallery-item.tall {
    grid-row: span 2;
}
```

### 4. 表单布局

```css
.form-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* 不同宽度的表单项 */
.full-width { grid-column: 1 / -1; }
.half-width { grid-column: span 6; }
.third-width { grid-column: span 4; }
.quarter-width { grid-column: span 3; }

/* 响应式调整 */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .half-width,
    .third-width,
    .quarter-width {
        grid-column: 1 / -1;
    }
}
```

## Grid vs Flexbox

### 何时使用Grid

- 二维布局（行和列）
- 复杂的页面布局
- 需要精确控制项目位置
- 响应式网格系统

### 何时使用Flexbox

- 一维布局（行或列）
- 组件内部布局
- 内容驱动的布局
- 简单的对齐需求

### 结合使用

```css
.page-layout {
    display: grid;
    grid-template-areas:
        "header"
        "main"
        "footer";
}

.header {
    grid-area: header;
    display: flex; /* 在Grid项内使用Flexbox */
    justify-content: space-between;
    align-items: center;
}

.nav-menu {
    display: flex;
    gap: 20px;
}
```

## 浏览器支持和兼容性

### 现代浏览器支持

CSS Grid在现代浏览器中有很好的支持：

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

### 渐进增强

```css
.grid-container {
    /* 回退方案 */
    display: flex;
    flex-wrap: wrap;
}

.grid-item {
    flex: 1 1 300px;
    margin: 10px;
}

/* 支持Grid的浏览器 */
@supports (display: grid) {
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .grid-item {
        margin: 0;
    }
}
```

## 调试Grid布局

### 浏览器开发者工具

1. **Firefox Grid Inspector**：最强大的Grid调试工具
2. **Chrome DevTools**：显示网格线和区域
3. **Safari Web Inspector**：基本的Grid可视化

### CSS调试技巧

```css
.grid-container {
    /* 显示网格线（仅用于调试） */
    background-image: 
        linear-gradient(rgba(255, 0, 0, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 0, 0, 0.3) 1px, transparent 1px);
    background-size: 20px 20px;
}

.grid-item {
    /* 显示边界（仅用于调试） */
    border: 1px solid rgba(0, 0, 255, 0.3);
    background: rgba(0, 0, 255, 0.1);
}
```

## 总结

CSS Grid是现代Web布局的强大工具，它提供了：

1. **灵活的网格系统**：支持复杂的二维布局
2. **直观的语法**：通过网格区域和命名线简化布局
3. **响应式设计**：轻松创建适应不同屏幕的布局
4. **精确控制**：准确定位和调整网格项
5. **与Flexbox互补**：两者结合使用效果更佳

掌握Grid布局将大大提升你的CSS布局能力，让复杂的页面设计变得简单高效。

你在项目中是如何使用Grid布局的？遇到过什么有趣的应用场景？欢迎分享你的经验！