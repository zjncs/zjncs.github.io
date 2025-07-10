# 简单博客系统

一个简单的个人博客系统，用纯前端技术实现，可以直接在浏览器中使用。

## 特点

- 纯前端实现，无需服务器
- 数据存储在浏览器本地
- 支持Markdown编写文章
- 简单的管理后台
- 可以导出数据备份

## 功能

### 基本功能
- 文章的增删改查
- 分类和标签管理
- 文章搜索
- 数据导入导出

### 安全功能
- 登录认证
- 密码加密存储
- 会话管理

### 界面设计
- 简洁、响应式的界面设计
- 深色/浅色主题切换
- 优雅的动画和过渡效果
- 移动端友好的布局

### 📝 内容管理
- Markdown文章支持
- 文章分类和标签系统
- 文章归档功能
- 精选文章展示
- 阅读时间估算

### 🔍 搜索功能
- 实时搜索文章内容
- 搜索结果高亮显示
- 键盘导航支持
- 搜索建议功能

### 💬 互动功能
- Disqus评论系统
- 社交分享按钮
- RSS订阅支持
- 文章导航

### ⚡ 性能优化
- 图片懒加载
- 代码高亮
- 压缩和缓存
- SEO优化

## 快速开始

### 1. 访问博客系统

直接访问 `index.html` 查看博客首页，或访问 `demo.html` 查看功能演示。

### 2. 设置管理员账户

首次访问管理后台时：

1. 点击博客首页的"管理后台"按钮
2. 系统会提示设置管理员用户名和密码
3. 密码要求：至少8位字符，包含字母和数字
4. 设置完成后即可登录管理后台

### 3. 管理博客内容

登录后可以：
- 创建和编辑文章
- 管理分类和标签
- 配置站点设置
- 自定义主题
- 同步到GitHub
- 更改密码和安全设置

### 4. Fork仓库（可选）

如需部署到GitHub Pages，点击右上角的"Fork"按钮，将仓库复制到你的GitHub账户。

## 🔒 安全使用建议

### 密码安全
- 使用强密码（至少8位，包含字母、数字和特殊字符）
- 定期更改密码
- 不要在公共设备上保存登录状态

### 数据备份
- 定期导出博客数据进行备份
- 重要文章建议保存本地副本
- 使用GitHub同步功能自动备份

### 忘记密码处理
1. 访问 `reset-password.html` 页面
2. 选择"清除浏览器数据"或"立即重置"
3. 按照提示操作恢复访问权限

### 2. 修改配置

编辑`_config.yml`文件，更新以下信息：

```yaml
title: "你的博客名称"
description: "你的博客描述"
url: "https://yourusername.github.io"
author: "你的名字"
email: "your.email@example.com"
github_username: "yourusername"
twitter_username: "yourusername"
linkedin_username: "yourusername"
```

### 3. 启用GitHub Pages

1. 进入仓库的Settings页面
2. 滚动到"Pages"部分
3. 在"Source"下选择"Deploy from a branch"
4. 选择"main"分支
5. 点击"Save"

### 4. 自定义内容

- 编辑`about.md`更新个人简介
- 在`_posts`目录下添加你的文章
- 替换`assets/images/`中的图片

## 文章写作

### 创建新文章

在`_posts`目录下创建新的Markdown文件，文件名格式为：`YYYY-MM-DD-title.md`

### 文章头部信息

```yaml
---
layout: post
title: "文章标题"
date: 2024-01-15 10:00:00 +0800
categories: [分类1, 分类2]
tags: [标签1, 标签2, 标签3]
featured: true  # 是否为精选文章
image: /assets/images/posts/image.jpg  # 文章封面图
---
```

### 支持的功能

- **代码高亮**：使用三个反引号包围代码块
- **数学公式**：支持LaTeX语法
- **表格**：Markdown表格语法
- **图片**：支持本地和外部图片
- **目录**：自动生成文章目录

## 自定义配置

### 主题颜色

在`assets/css/main.css`中修改CSS变量：

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --accent-color: #f59e0b;
    /* 更多颜色变量... */
}
```

### 评论系统

1. 注册[Disqus](https://disqus.com/)账户
2. 在`_config.yml`中设置：

```yaml
disqus_shortname: "your-disqus-shortname"
```

### Google Analytics

在`_config.yml`中添加：

```yaml
google_analytics: "UA-XXXXXXXX-X"
```

### 社交链接

在`_config.yml`中更新社交媒体用户名：

```yaml
github_username: "yourusername"
twitter_username: "yourusername"
linkedin_username: "yourusername"
```

## 本地开发

### 安装依赖

```bash
# 安装Ruby和Bundler
gem install bundler

# 安装项目依赖
bundle install
```

### 运行开发服务器

```bash
bundle exec jekyll serve
```

访问 `http://localhost:4000` 查看博客。

### 构建生产版本

```bash
bundle exec jekyll build
```

## 部署

### GitHub Pages（推荐）

1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main）
4. 等待部署完成

### 其他平台

博客也可以部署到：

- Netlify
- Vercel
- GitLab Pages
- 自己的服务器

## 文件结构

```
├── _config.yml          # Jekyll配置文件
├── _layouts/            # 页面布局模板
├── _posts/              # 博客文章
├── _includes/           # 可重用的页面片段
├── assets/              # 静态资源
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript文件
│   └── images/         # 图片文件
├── pages/              # 静态页面
├── index.html          # 首页
├── about.md            # 关于页面
├── categories.html     # 分类页面
├── tags.html           # 标签页面
├── archive.html        # 归档页面
└── search.json         # 搜索数据
```

## 贡献

欢迎提交Issue和Pull Request来改进这个博客模板！

## 许可证

本项目采用MIT许可证。详见[LICENSE](LICENSE)文件。

## 支持

如果你觉得这个博客模板有用，请给个⭐️支持一下！

如果遇到问题，可以：

1. 查看[Issues](https://github.com/yourusername/yourusername.github.io/issues)
2. 提交新的Issue
3. 发邮件联系：your.email@example.com

---

**Happy Blogging! 🎉**