# 我的技术博客

基于 Hexo + Shoka 主题的个人技术博客，专注于前端工程和性能优化。

## 🚀 特性

### 📊 性能优化
- **图片优化**: 懒加载 + WebP 格式支持
- **资源压缩**: HTML/CSS/JS 自动压缩优化
- **缓存策略**: Service Worker 智能缓存
- **性能监控**: Core Web Vitals 实时跟踪

### ♿ 可访问性
- **语义化 HTML**: 改善屏幕阅读器支持
- **键盘导航**: 完整的键盘访问支持
- **对比度优化**: WCAG 标准色彩对比度
- **焦点管理**: 清晰的焦点指示器

### 🎨 现代化设计
- **响应式布局**: 移动优先的设计理念
- **暗色模式**: 支持系统主题偏好
- **现代 CSS**: CSS Grid + Flexbox 布局
- **微交互**: 流畅的动画和过渡效果

### 📱 PWA 功能
- **离线支持**: 完整的离线浏览体验
- **缓存策略**: 智能的资源缓存管理
- **网络状态**: 实时网络连接提示
- **后台同步**: 自动更新缓存内容

## 🛠️ 技术栈

- **静态站点生成器**: [Hexo](https://hexo.io/)
- **主题**: [Shoka](https://github.com/amehime/hexo-theme-shoka)
- **部署**: GitHub Pages + GitHub Actions
- **性能优化**: Service Worker + 资源压缩
- **监控**: Core Web Vitals + Lighthouse CI

## 📦 本地开发

### 环境要求
- Node.js 16+
- Git

### 安装依赖
```bash
npm install
```

### 本地预览
```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate

# 启动本地服务器
hexo server
```

访问 http://localhost:4000 查看效果

### 新建文章
```bash
hexo new "文章标题"
```

## 🚀 部署

### 自动部署 (推荐)
本项目配置了 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建
3. 部署到 `gh-pages` 分支
4. GitHub Pages 自动发布

### 手动部署
```bash
# 生成并部署
hexo clean && hexo deploy
```

## 📁 项目结构

```
├── .github/workflows/    # GitHub Actions 配置
├── scripts/              # Hexo 脚本和插件
├── source/               # 源文件
│   ├── _data/           # 自定义数据文件
│   ├── _posts/          # 文章文件
│   ├── about/           # 关于页面
│   ├── friends/         # 友链页面
│   └── js/              # 自定义 JavaScript
├── themes/shoka/         # Shoka 主题文件
├── _config.yml          # Hexo 配置文件
└── package.json         # 项目依赖
```

## 🎯 性能指标

通过 Lighthouse 测试的性能指标：

- **Performance**: 95+ 分
- **Accessibility**: 100 分
- **Best Practices**: 100 分
- **SEO**: 100 分

### Core Web Vitals
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔧 自定义配置

### 主题配置
主题配置文件位于 `themes/shoka/_config.yml`

### 自定义样式
- `source/_data/colors.styl` - 颜色配置
- `source/_data/custom.styl` - 自定义样式

### 性能监控
开发环境下会显示性能监控面板，包含：
- Core Web Vitals 实时数据
- 资源加载性能分析
- 性能优化建议

## 📝 写作指南

### Front Matter 配置
```yaml
---
title: 文章标题
date: 2024-01-01 12:00:00
categories:
  - [分类名称]
tags:
  - 标签1
  - 标签2
math: true          # 启用数学公式
mermaid: true       # 启用流程图
quiz: true          # 启用练习题
cover: /images/cover.jpg  # 封面图片
---
```

### 特殊功能
- **数学公式**: 使用 KaTeX 渲染
- **流程图**: 支持 Mermaid 图表
- **代码高亮**: 支持行号和高亮
- **友链展示**: 使用 links 标签
- **练习题**: 支持选择题和填空题

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [博客地址](https://zjncs.github.io)
- [Hexo 官网](https://hexo.io/)
- [Shoka 主题](https://github.com/amehime/hexo-theme-shoka)
- [GitHub 仓库](https://github.com/zjncs/zjncs.github.io)

---

⭐ 如果这个项目对你有帮助，请给个 Star！
