import { marked } from 'marked';

// 博客引擎 - 负责渲染博客内容
class BlogEngine {
    constructor() {
        this.blogData = this.loadBlogData();
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.storageListenerBound = false;
        this.storageUpdateTimeout = null;
        this.storageHandler = null;
    }

    // 加载博客数据
    loadBlogData() {
        const saved = localStorage.getItem('blogData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error('加载博客数据失败:', error);
            }
        }
        
        // 默认数据
        return {
            posts: [
                {
                    id: '1',
                    title: '欢迎来到我的博客',
                    slug: 'welcome-to-my-blog',
                    content: `# 欢迎来到我的博客

这是我的第一篇博客文章！在这里我会分享技术心得、学习笔记和项目经验。

## 博客功能

- ✅ Markdown 支持
- ✅ 文章分类和标签
- ✅ 响应式设计
- ✅ 实时预览
- ✅ 文件上传
- ✅ 主题自定义

## 开始写作

点击右上角的"管理后台"按钮开始创建你的第一篇文章吧！

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

期待与你分享更多精彩内容！`,
                    excerpt: '欢迎来到我的技术博客！这里将分享编程技巧、项目经验和学习心得。',
                    category: '博客',
                    tags: ['欢迎', '介绍'],
                    date: new Date().toISOString(),
                    updated: new Date().toISOString()
                }
            ],
            settings: {
                title: '我的技术博客',
                description: '专业技术分享与开发经验',
                author: 'Your Name',
                email: 'your.email@example.com',
                github: '',
                twitter: '',
                about: '这里是关于页面的内容...'
            },
            theme: {
                primaryColor: '#3498db',
                accentColor: '#e74c3c',
                fontFamily: 'system',
                customCSS: ''
            }
        };
    }

    // 渲染首页
    renderHomePage() {
        const posts = this.getPaginatedPosts();
        const totalPages = Math.ceil(this.blogData.posts.length / this.postsPerPage);
        
        return `
            <div class="blog-header">
                <h1>${this.blogData.settings.title}</h1>
                <p class="blog-description">${this.blogData.settings.description}</p>
                <div class="blog-nav">
                    <a href="#" onclick="blogEngine.showPage('home')" class="nav-link active">首页</a>
                    <a href="#" onclick="blogEngine.showPage('categories')" class="nav-link">分类</a>
                    <a href="#" onclick="blogEngine.showPage('tags')" class="nav-link">标签</a>
                    <a href="#" onclick="blogEngine.showPage('about')" class="nav-link">关于</a>
                    <a href="/admin.html" class="nav-link admin-link">管理后台</a>
                </div>
            </div>
            
            <div class="posts-container">
                ${posts.map(post => this.renderPostCard(post)).join('')}
            </div>
            
            ${totalPages > 1 ? this.renderPagination(totalPages) : ''}
        `;
    }

    // 渲染文章卡片
    renderPostCard(post) {
        return `
            <article class="post-card">
                <header class="post-header">
                    <h2 class="post-title">
                        <a href="#" onclick="blogEngine.showPost('${post.id}')">${post.title}</a>
                    </h2>
                    <div class="post-meta">
                        <time>${this.formatDate(post.date)}</time>
                        ${post.category ? `<span class="category">${post.category}</span>` : ''}
                        <span class="reading-time">${this.calculateReadingTime(post.content)} 分钟阅读</span>
                    </div>
                </header>
                
                <div class="post-excerpt">
                    ${post.excerpt || this.generateExcerpt(post.content)}
                </div>
                
                ${post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <footer class="post-footer">
                    <a href="#" onclick="blogEngine.showPost('${post.id}')" class="read-more">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </footer>
            </article>
        `;
    }

    // 渲染单篇文章
    renderPost(postId) {
        const post = this.blogData.posts.find(p => p.id === postId);
        if (!post) {
            return '<div class="error">文章不存在</div>';
        }

        return `
            <div class="blog-header">
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <span class="current">${post.title}</span>
                </nav>
            </div>
            
            <article class="post-detail">
                <header class="post-header">
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-meta">
                        <time>${this.formatDate(post.date)}</time>
                        ${post.category ? `<span class="category">${post.category}</span>` : ''}
                        <span class="reading-time">${this.calculateReadingTime(post.content)} 分钟阅读</span>
                    </div>
                    ${post.tags.length > 0 ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </header>
                
                <div class="post-content">
                    ${marked(post.content)}
                </div>
                
                <footer class="post-footer">
                    <div class="post-navigation">
                        ${this.renderPostNavigation(post)}
                    </div>
                    
                    <div class="share-buttons">
                        <h4>分享这篇文章</h4>
                        <button onclick="blogEngine.sharePost('${post.id}', 'twitter')" class="share-btn twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button onclick="blogEngine.sharePost('${post.id}', 'facebook')" class="share-btn facebook">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                        <button onclick="blogEngine.copyPostLink('${post.id}')" class="share-btn copy">
                            <i class="fas fa-link"></i> 复制链接
                        </button>
                    </div>
                </footer>
            </article>
        `;
    }

    // 渲染分类页面
    renderCategoriesPage() {
        const categories = this.getCategories();
        
        return `
            <div class="blog-header">
                <h1>文章分类</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <span class="current">分类</span>
                </nav>
            </div>
            
            <div class="categories-grid">
                ${Object.entries(categories).map(([category, posts]) => `
                    <div class="category-card">
                        <h3 class="category-name">${category}</h3>
                        <p class="category-count">${posts.length} 篇文章</p>
                        <div class="category-posts">
                            ${posts.slice(0, 3).map(post => `
                                <div class="category-post">
                                    <a href="#" onclick="blogEngine.showPost('${post.id}')">${post.title}</a>
                                    <time>${this.formatDate(post.date)}</time>
                                </div>
                            `).join('')}
                            ${posts.length > 3 ? `
                                <div class="category-more">
                                    <a href="#" onclick="blogEngine.showCategory('${category}')">查看全部 ${posts.length} 篇</a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 渲染标签页面
    renderTagsPage() {
        const tags = this.getTags();
        
        return `
            <div class="blog-header">
                <h1>标签云</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <span class="current">标签</span>
                </nav>
            </div>
            
            <div class="tags-cloud">
                ${Object.entries(tags).map(([tag, posts]) => {
                    const size = Math.min(Math.max(posts.length, 1), 5);
                    return `
                        <a href="#" onclick="blogEngine.showTag('${tag}')" 
                           class="tag-item tag-size-${size}" 
                           title="${posts.length} 篇文章">
                            ${tag}
                        </a>
                    `;
                }).join('')}
            </div>
            
            <div class="tags-list">
                ${Object.entries(tags).map(([tag, posts]) => `
                    <div class="tag-section">
                        <h3 class="tag-name">${tag} (${posts.length})</h3>
                        <div class="tag-posts">
                            ${posts.map(post => `
                                <div class="tag-post">
                                    <a href="#" onclick="blogEngine.showPost('${post.id}')">${post.title}</a>
                                    <time>${this.formatDate(post.date)}</time>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 渲染关于页面
    renderAboutPage() {
        return `
            <div class="blog-header">
                <h1>关于</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <span class="current">关于</span>
                </nav>
            </div>
            
            <div class="about-content">
                <div class="author-info">
                    <h2>${this.blogData.settings.author}</h2>
                    <p class="author-email">${this.blogData.settings.email}</p>
                    <div class="social-links">
                        ${this.blogData.settings.github ? `
                            <a href="https://github.com/${this.blogData.settings.github}" target="_blank">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        ` : ''}
                        ${this.blogData.settings.twitter ? `
                            <a href="https://twitter.com/${this.blogData.settings.twitter}" target="_blank">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="about-text">
                    ${marked(this.blogData.settings.about || '这里是关于页面的内容...')}
                </div>
                
                <div class="blog-stats">
                    <div class="stat">
                        <span class="stat-number">${this.blogData.posts.length}</span>
                        <span class="stat-label">篇文章</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${Object.keys(this.getCategories()).length}</span>
                        <span class="stat-label">个分类</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${Object.keys(this.getTags()).length}</span>
                        <span class="stat-label">个标签</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染分页
    renderPagination(totalPages) {
        const pagination = [];
        
        if (this.currentPage > 1) {
            pagination.push(`<a href="#" onclick="blogEngine.goToPage(${this.currentPage - 1})" class="page-btn prev">上一页</a>`);
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                pagination.push(`<span class="page-btn current">${i}</span>`);
            } else {
                pagination.push(`<a href="#" onclick="blogEngine.goToPage(${i})" class="page-btn">${i}</a>`);
            }
        }
        
        if (this.currentPage < totalPages) {
            pagination.push(`<a href="#" onclick="blogEngine.goToPage(${this.currentPage + 1})" class="page-btn next">下一页</a>`);
        }
        
        return `<div class="pagination">${pagination.join('')}</div>`;
    }

    // 渲染文章导航
    renderPostNavigation(currentPost) {
        const currentIndex = this.blogData.posts.findIndex(p => p.id === currentPost.id);
        const prevPost = this.blogData.posts[currentIndex + 1];
        const nextPost = this.blogData.posts[currentIndex - 1];
        
        return `
            <div class="post-nav">
                ${prevPost ? `
                    <div class="post-nav-item prev">
                        <span class="nav-label">上一篇</span>
                        <a href="#" onclick="blogEngine.showPost('${prevPost.id}')">${prevPost.title}</a>
                    </div>
                ` : ''}
                
                ${nextPost ? `
                    <div class="post-nav-item next">
                        <span class="nav-label">下一篇</span>
                        <a href="#" onclick="blogEngine.showPost('${nextPost.id}')">${nextPost.title}</a>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 显示页面
    showPage(page) {
        let content = '';
        
        switch (page) {
            case 'home':
                content = this.renderHomePage();
                break;
            case 'categories':
                content = this.renderCategoriesPage();
                break;
            case 'tags':
                content = this.renderTagsPage();
                break;
            case 'about':
                content = this.renderAboutPage();
                break;
            default:
                content = this.renderHomePage();
        }
        
        document.getElementById('content').innerHTML = content;
        this.updateActiveNav(page);
        this.applyTheme();
        window.scrollTo(0, 0);
    }

    // 显示文章
    showPost(postId) {
        const content = this.renderPost(postId);
        document.getElementById('content').innerHTML = content;
        this.applyTheme();
        window.scrollTo(0, 0);
    }

    // 显示分类文章
    showCategory(category) {
        const posts = this.blogData.posts.filter(p => p.category === category);
        const content = `
            <div class="blog-header">
                <h1>分类: ${category}</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <a href="#" onclick="blogEngine.showPage('categories')">分类</a>
                    <span class="separator">></span>
                    <span class="current">${category}</span>
                </nav>
            </div>
            
            <div class="posts-container">
                ${posts.map(post => this.renderPostCard(post)).join('')}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
        this.applyTheme();
        window.scrollTo(0, 0);
    }

    // 显示标签文章
    showTag(tag) {
        const posts = this.blogData.posts.filter(p => p.tags.includes(tag));
        const content = `
            <div class="blog-header">
                <h1>标签: ${tag}</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="blogEngine.showPage('home')">首页</a>
                    <span class="separator">></span>
                    <a href="#" onclick="blogEngine.showPage('tags')">标签</a>
                    <span class="separator">></span>
                    <span class="current">${tag}</span>
                </nav>
            </div>
            
            <div class="posts-container">
                ${posts.map(post => this.renderPostCard(post)).join('')}
            </div>
        `;
        
        document.getElementById('content').innerHTML = content;
        this.applyTheme();
        window.scrollTo(0, 0);
    }

    // 翻页
    goToPage(page) {
        this.currentPage = page;
        this.showPage('home');
    }

    // 分享文章
    sharePost(postId, platform) {
        const post = this.blogData.posts.find(p => p.id === postId);
        if (!post) return;
        
        const url = window.location.href;
        const text = `${post.title} - ${this.blogData.settings.title}`;
        
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // 复制文章链接
    copyPostLink(postId) {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('链接已复制到剪贴板', 'success');
        });
    }

    // 工具方法
    getPaginatedPosts() {
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        return this.blogData.posts.slice(start, end);
    }

    getCategories() {
        const categories = {};
        this.blogData.posts.forEach(post => {
            if (post.category) {
                if (!categories[post.category]) {
                    categories[post.category] = [];
                }
                categories[post.category].push(post);
            }
        });
        return categories;
    }

    getTags() {
        const tags = {};
        this.blogData.posts.forEach(post => {
            post.tags.forEach(tag => {
                if (!tags[tag]) {
                    tags[tag] = [];
                }
                tags[tag].push(post);
            });
        });
        return tags;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    generateExcerpt(content) {
        const plainText = content.replace(/[#*`]/g, '').substring(0, 200);
        return plainText + (content.length > 200 ? '...' : '');
    }

    updateActiveNav(currentPage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[onclick="blogEngine.showPage('${currentPage}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    applyTheme() {
        const theme = this.blogData.theme;
        if (!theme) return;
        
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        
        // 应用自定义 CSS
        let customStyle = document.getElementById('custom-theme-style');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'custom-theme-style';
            document.head.appendChild(customStyle);
        }
        customStyle.textContent = theme.customCSS;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 初始化
    init() {
        this.showPage('home');

        // 防止重复绑定存储监听器
        if (!this.storageListenerBound) {
            // 监听存储变化，实时更新博客内容
            const storageHandler = (e) => {
                if (e.key === 'blogData' && e.newValue !== e.oldValue) {
                    // 防抖处理，避免频繁更新
                    clearTimeout(this.storageUpdateTimeout);
                    this.storageUpdateTimeout = setTimeout(() => {
                        this.blogData = this.loadBlogData();
                        this.showPage('home');
                    }, 100);
                }
            };

            window.addEventListener('storage', storageHandler);
            this.storageListenerBound = true;
            this.storageHandler = storageHandler;
        }
    }

    // 清理资源
    cleanup() {
        if (this.storageHandler && this.storageListenerBound) {
            window.removeEventListener('storage', this.storageHandler);
            this.storageListenerBound = false;
        }

        if (this.storageUpdateTimeout) {
            clearTimeout(this.storageUpdateTimeout);
            this.storageUpdateTimeout = null;
        }
    }
}

// 导出博客引擎实例
export default BlogEngine;