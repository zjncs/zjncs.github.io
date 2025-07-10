# Design System Documentation

## 概述

这个设计系统为您的 Jekyll 博客提供了一套完整的、可维护的样式架构。它采用**混合方法**，结合了 CSS 自定义属性（CSS Variables）和 Sass 预处理器的优势：

- **CSS 自定义属性**：用于运行时主题切换和动态样式
- **Sass 变量和函数**：用于编译时优化和向后兼容
- **模块化架构**：便于维护和扩展
- **自动主题切换**：支持系统偏好设置和手动切换

## 文件结构

```
├── _config.yml                 # Jekyll 配置（已添加 Sass 配置）
├── style.scss                  # 主 SCSS 文件（编译入口）
├── index-jekyll.html           # 示例首页（使用新的设计系统）
├── _sass/                      # Sass 源文件目录
│   ├── _tokens.scss            # 设计令牌（CSS 自定义属性 + Sass 变量）
│   ├── _base.scss              # 基础样式（重置、排版、全局样式）
│   ├── _layout.scss            # 布局样式（头部、底部、主要结构）
│   └── components/             # 组件样式目录
│       ├── _post-card.scss     # 文章卡片组件（BEM 命名）
│       ├── _site-header.scss   # 站点头部组件
│       ├── _search.scss        # 搜索组件
│       └── _buttons.scss       # 按钮组件
└── _layouts/
    └── default.html            # 已更新为使用新的 CSS 文件和结构
```

## 设计令牌 (_tokens.scss)

### 混合令牌系统

这个设计系统使用两种类型的令牌：

#### 1. CSS 自定义属性（运行时变量）
用于主题切换和动态样式：

```css
/* 在 CSS 中使用 */
.element {
  color: var(--color-text-base);
  background: var(--color-background-surface);
  padding: var(--space-l);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}
```

#### 2. Sass 变量（编译时变量）
用于响应式断点和复杂计算：

```scss
// 在 Sass 中使用
@media (max-width: breakpoint(md)) {
  .element {
    font-size: var(--font-size-sm);
  }
}
```

### 主要令牌类别

#### 颜色系统
```css
--color-primary: hsl(210, 85%, 55%)
--color-text-base: #1C1E21
--color-text-muted: #606770
--color-background-body: #FFFFFF
--color-background-surface: #F0F2F5
--color-border-default: #CED0D4
```

#### 字体系统
```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...
--font-family-heading: 'Inter', 'Montserrat', sans-serif
--font-size-base: 1rem        /* 16px */
--font-size-lg: 1.125rem      /* 18px */
--font-size-xl: 1.25rem       /* 20px */
```

#### 间距系统（4pt 网格）
```css
--space-xs: 4px
--space-s: 8px
--space-m: 16px
--space-l: 24px
--space-xl: 32px
--space-xxl: 48px
```

## 组件使用指南

### 文章卡片组件

```html
<div class="posts-grid">
  <article class="post-card">
    <div class="post-card-image">
      <img src="image.jpg" alt="文章图片">
      <div class="post-card-overlay"></div>
    </div>
    <div class="post-card-content">
      <div class="post-card-meta">
        <span class="post-card-date">
          <i class="fas fa-calendar"></i>
          2024-01-15
        </span>
        <span class="post-card-reading-time">
          <i class="fas fa-clock"></i>
          5 分钟阅读
        </span>
      </div>
      <h2 class="post-card-title">
        <a href="/post-url">文章标题</a>
      </h2>
      <p class="post-card-excerpt">文章摘要...</p>
      <div class="post-card-tags">
        <a href="/tag/javascript" class="post-tag">JavaScript</a>
        <a href="/tag/react" class="post-tag">React</a>
      </div>
      <div class="post-card-footer">
        <span class="post-card-author">
          <i class="fas fa-user"></i>
          作者名
        </span>
        <a href="/post-url" class="post-card-read-more">
          阅读更多 <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </article>
</div>
```

### 按钮组件

```html
<!-- 基础按钮 -->
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-outline">轮廓按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>

<!-- 不同尺寸 -->
<button class="btn btn-primary btn-sm">小按钮</button>
<button class="btn btn-primary">默认按钮</button>
<button class="btn btn-primary btn-lg">大按钮</button>

<!-- 图标按钮 -->
<button class="btn btn-icon btn-primary">
  <i class="fas fa-heart"></i>
</button>

<!-- 带图标的按钮 -->
<button class="btn btn-primary">
  <i class="fas fa-download"></i>
  下载
</button>
```

### 搜索组件

搜索组件已经集成在布局中，包含：
- 搜索覆盖层
- 搜索输入框
- 搜索结果显示
- 键盘快捷键支持

## 工具类

设计系统提供了丰富的工具类：

### 文本对齐
```html
<div class="text-center">居中文本</div>
<div class="text-left">左对齐文本</div>
<div class="text-right">右对齐文本</div>
```

### 间距工具
```html
<div class="mt-4">上边距</div>
<div class="mb-6">下边距</div>
<div class="p-4">内边距</div>
```

### 显示工具
```html
<div class="d-flex justify-center align-center">
  Flexbox 居中
</div>
```

### 颜色工具
```html
<span class="text-primary">主色文本</span>
<div class="bg-success">成功背景</div>
```

## 主题支持

设计系统完全支持亮色/暗色主题切换：

```html
<!-- 亮色主题（默认） -->
<body>

<!-- 暗色主题 -->
<body data-theme="dark">
```

所有组件都会自动适应当前主题。

## 响应式设计

所有组件都采用移动优先的响应式设计：

```scss
// 移动端优先
.component {
  // 移动端样式
  
  @media (min-width: breakpoint(md)) {
    // 平板端样式
  }
  
  @media (min-width: breakpoint(lg)) {
    // 桌面端样式
  }
}
```

## 自定义和扩展

### 添加新颜色
在 `_tokens.scss` 中添加新的颜色：

```scss
$colors: (
  // 现有颜色...
  custom: (
    500: #your-color,
    600: #your-darker-color,
  )
);
```

### 创建新组件
1. 在 `_sass/components/` 目录下创建新的 `.scss` 文件
2. 在 `style.scss` 中导入新组件：

```scss
@import "components/your-new-component";
```

### 覆盖默认样式
在 `style.scss` 的底部添加自定义样式：

```scss
// 自定义覆盖
.your-custom-styles {
  // 您的样式
}
```

## 性能优化

- CSS 输出被压缩（`style: compressed`）
- 使用 Sass 变量和函数减少重复代码
- 模块化架构便于按需加载
- 支持 CSS 缓存和版本控制

## 浏览器支持

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 支持 CSS Grid 和 Flexbox
- 支持 CSS 自定义属性
- 支持 backdrop-filter（毛玻璃效果）

## 维护指南

1. **颜色修改**：只在 `_tokens.scss` 中修改颜色值
2. **间距调整**：使用 `spacing()` 函数保持一致性
3. **新组件**：遵循现有的命名约定和结构
4. **响应式**：始终采用移动优先的方法
5. **主题**：确保新样式支持暗色主题

## 故障排除

### 样式不生效
1. 检查 Jekyll 是否正确编译 Sass
2. 确认 `_config.yml` 中的 Sass 配置正确
3. 检查浏览器开发者工具中的 CSS 加载情况

### 编译错误
1. 检查 Sass 语法是否正确
2. 确认所有导入的文件存在
3. 检查变量和函数的使用是否正确

这个设计系统为您的博客提供了坚实的样式基础，同时保持了高度的可定制性和可维护性。
