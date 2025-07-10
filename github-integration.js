// GitHub API 集成模块
class GitHubIntegration {
    constructor() {
        this.token = localStorage.getItem('github_token');
        this.repo = localStorage.getItem('github_repo');
        this.owner = localStorage.getItem('github_owner');
        this.branch = 'main';
    }

    // 设置GitHub配置
    setConfig(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
    }

    // 检查是否已配置
    isConfigured() {
        return this.token && this.repo && this.owner;
    }

    // GitHub API 请求
    async apiRequest(endpoint, options = {}) {
        const url = `https://api.github.com${endpoint}`;
        const headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `GitHub API Error: ${response.status}`);
        }

        return response.json();
    }

    // 获取文件内容
    async getFile(path) {
        try {
            const response = await this.apiRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`);
            return {
                content: atob(response.content),
                sha: response.sha
            };
        } catch (error) {
            if (error.message.includes('404')) {
                return null; // 文件不存在
            }
            throw error;
        }
    }

    // 创建或更新文件
    async createOrUpdateFile(path, content, message, sha = null) {
        const body = {
            message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: this.branch
        };

        if (sha) {
            body.sha = sha;
        }

        return await this.apiRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // 删除文件
    async deleteFile(path, message) {
        const file = await this.getFile(path);
        if (!file) {
            throw new Error('文件不存在');
        }

        return await this.apiRequest(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify({
                message,
                sha: file.sha,
                branch: this.branch
            })
        });
    }

    // 保存博客文章到GitHub
    async savePost(post) {
        const filename = `_posts/${this.formatDate(post.date)}-${post.slug}.md`;
        const frontMatter = this.generateFrontMatter(post);
        const content = `${frontMatter}\n${post.content}`;
        
        const existingFile = await this.getFile(filename);
        const message = existingFile ? 
            `Update post: ${post.title}` : 
            `Add new post: ${post.title}`;

        return await this.createOrUpdateFile(
            filename, 
            content, 
            message, 
            existingFile?.sha
        );
    }

    // 删除博客文章
    async deletePost(post) {
        const filename = `_posts/${this.formatDate(post.date)}-${post.slug}.md`;
        return await this.deleteFile(filename, `Delete post: ${post.title}`);
    }

    // 保存站点配置
    async saveConfig(settings) {
        const configContent = this.generateJekyllConfig(settings);
        const existingFile = await this.getFile('_config.yml');
        
        return await this.createOrUpdateFile(
            '_config.yml',
            configContent,
            'Update site configuration',
            existingFile?.sha
        );
    }

    // 保存关于页面
    async saveAboutPage(content) {
        const aboutContent = `---
layout: page
title: "关于"
permalink: /about/
---

${content}`;
        
        const existingFile = await this.getFile('about.md');
        
        return await this.createOrUpdateFile(
            'about.md',
            aboutContent,
            'Update about page',
            existingFile?.sha
        );
    }

    // 生成Jekyll Front Matter
    generateFrontMatter(post) {
        return `---
layout: post
title: "${post.title}"
date: ${post.date}
categories: [${post.category || ''}]
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
excerpt: "${post.excerpt || ''}"
---`;
    }

    // 生成Jekyll配置文件
    generateJekyllConfig(settings) {
        return `# Site settings
title: "${settings.title}"
description: "${settings.description}"
baseurl: ""
url: "https://${this.owner}.github.io"
author: "${settings.author}"
email: "${settings.email}"
github_username: "${settings.github}"
twitter_username: "${settings.twitter}"

# Build settings
markdown: kramdown
highlighter: rouge
permalink: /:categories/:year/:month/:day/:title/
paginate: 10
paginate_path: "/page:num/"

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-paginate

# Exclude from processing
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/
  - README.md`;
    }

    // 格式化日期为Jekyll文件名格式
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 同步所有文章到GitHub
    async syncAllPosts(posts) {
        const results = [];
        for (const post of posts) {
            try {
                await this.savePost(post);
                results.push({ success: true, post: post.title });
            } catch (error) {
                results.push({ success: false, post: post.title, error: error.message });
            }
        }
        return results;
    }

    // 创建基础的Jekyll文件结构
    async initializeJekyllSite() {
        const files = [
            {
                path: 'Gemfile',
                content: `source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-seo-tag"
gem "jekyll-paginate"`
            },
            {
                path: 'index.html',
                content: `---
layout: default
---

<div class="home">
  <h1 class="page-heading">Posts</h1>
  
  <ul class="post-list">
    {% for post in paginator.posts %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
        <p>{{ post.excerpt }}</p>
      </li>
    {% endfor %}
  </ul>

  {% if paginator.total_pages > 1 %}
    <div class="pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}">&laquo; Prev</a>
      {% endif %}
      
      {% for page in (1..paginator.total_pages) %}
        {% if page == paginator.page %}
          <em>{{ page }}</em>
        {% elsif page == 1 %}
          <a href="{{ '/' | relative_url }}">{{ page }}</a>
        {% else %}
          <a href="{{ site.paginate_path | replace: ':num', page | relative_url }}">{{ page }}</a>
        {% endif %}
      {% endfor %}
      
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}">Next &raquo;</a>
      {% endif %}
    </div>
  {% endif %}
</div>`
            },
            {
                path: '_layouts/default.html',
                content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% if page.title %}{{ page.title }} - {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
    <meta name="description" content="{% if page.excerpt %}{{ page.excerpt | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.description }}{% endif %}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .site-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .site-title {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .site-description {
            color: #666;
        }
        
        .post-list {
            list-style: none;
            padding: 0;
        }
        
        .post-list li {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .post-meta {
            color: #666;
            font-size: 0.9rem;
        }
        
        .post-link {
            color: #333;
            text-decoration: none;
        }
        
        .post-link:hover {
            color: #0066cc;
        }
        
        .pagination {
            text-align: center;
            margin-top: 2rem;
        }
        
        .pagination a, .pagination em {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0 0.25rem;
            text-decoration: none;
            border: 1px solid #ddd;
        }
        
        .pagination em {
            background: #0066cc;
            color: white;
        }
    </style>
</head>
<body>
    <header class="site-header">
        <h1 class="site-title">{{ site.title }}</h1>
        <p class="site-description">{{ site.description }}</p>
    </header>

    <main class="page-content">
        {{ content }}
    </main>

    <footer class="site-footer">
        <p>&copy; {{ 'now' | date: "%Y" }} {{ site.author }}. Powered by Jekyll.</p>
    </footer>
</body>
</html>`
            },
            {
                path: '_layouts/post.html',
                content: `---
layout: default
---

<article class="post">
    <header class="post-header">
        <h1 class="post-title">{{ page.title }}</h1>
        <p class="post-meta">
            <time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: "%B %-d, %Y" }}</time>
            {% if page.categories.size > 0 %}
                • {{ page.categories | join: ', ' }}
            {% endif %}
        </p>
    </header>

    <div class="post-content">
        {{ content }}
    </div>

    {% if page.tags.size > 0 %}
    <div class="post-tags">
        <strong>标签:</strong>
        {% for tag in page.tags %}
            <span class="tag">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}
        {% endfor %}
    </div>
    {% endif %}
</article>`
            }
        ];

        const results = [];
        for (const file of files) {
            try {
                const existingFile = await this.getFile(file.path);
                await this.createOrUpdateFile(
                    file.path,
                    file.content,
                    `Initialize ${file.path}`,
                    existingFile?.sha
                );
                results.push({ success: true, file: file.path });
            } catch (error) {
                results.push({ success: false, file: file.path, error: error.message });
            }
        }
        
        return results;
    }
}

// 导出GitHub集成类
window.GitHubIntegration = GitHubIntegration;