// 简化但功能完整的博客引擎
console.log('🚀 简化博客引擎启动');

class SimpleBlogEngine {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = null;
        this.blogData = this.loadBlogData();
        console.log('📊 博客数据加载完成:', this.blogData);
    }

    // 加载博客数据
    loadBlogData() {
        try {
            const savedData = localStorage.getItem('blogData');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (error) {
            console.error('解析博客数据失败:', error);
        }

        // 使用默认数据
        if (window.defaultBlogData) {
            localStorage.setItem('blogData', JSON.stringify(window.defaultBlogData));
            return window.defaultBlogData;
        }

        // 最基本的默认数据
        const basicData = {
            posts: [
                {
                    id: '1',
                    title: '欢迎来到我的博客',
                    content: '这是我的第一篇博客文章！',
                    excerpt: '欢迎来到我的技术博客！',
                    category: '博客',
                    tags: ['欢迎', '博客'],
                    date: new Date().toISOString(),
                    author: '赵嘉宁'
                }
            ],
            settings: {
                title: '赵嘉宁的技术笔记',
                description: '记录学习过程中的点点滴滴',
                author: '赵嘉宁'
            },
            friendLinks: [
                {
                    id: '1',
                    name: 'zjncs GitHub',
                    url: 'https://github.com/zjncs',
                    description: '我的GitHub主页'
                },
                {
                    id: '2',
                    name: 'ORCID Profile',
                    url: 'https://orcid.org/0009-0005-0821-6046',
                    description: '学术身份标识'
                }
            ]
        };

        localStorage.setItem('blogData', JSON.stringify(basicData));
        return basicData;
    }

    // 渲染博客头部
    renderHeader() {
        const settings = this.blogData.settings || {};
        return `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1>${settings.title || '赵嘉宁的技术笔记'}</h1>
                    <p class="blog-description">${settings.description || '记录学习过程中的点点滴滴'}</p>
                    <div class="blog-nav">
                        <a href="#" onclick="simpleBlog.showPage('home')" class="nav-link active">
                            <i class="fas fa-home"></i> 首页
                        </a>
                        <a href="#" onclick="simpleBlog.showPage('categories')" class="nav-link">
                            <i class="fas fa-folder"></i> 分类
                        </a>
                        <a href="#" onclick="simpleBlog.showPage('tags')" class="nav-link">
                            <i class="fas fa-tags"></i> 标签
                        </a>
                        <a href="#" onclick="simpleBlog.showPage('friends')" class="nav-link">
                            <i class="fas fa-link"></i> 友链
                        </a>
                        <a href="#" onclick="simpleBlog.showPage('coding')" class="nav-link">
                            <i class="fas fa-code"></i> Coding
                        </a>
                        <a href="#" onclick="simpleBlog.showPage('about')" class="nav-link">
                            <i class="fas fa-user"></i> 关于
                        </a>
                        <a href="/login.html" class="nav-link admin-link">
                            <i class="fas fa-cog"></i> 管理后台
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染文章列表
    renderPosts(posts) {
        if (!posts || posts.length === 0) {
            return '<div class="no-posts">暂无文章</div>';
        }

        return posts.map(post => `
            <article class="post-card">
                <div class="post-content-wrapper">
                    <header class="post-header">
                        <h2 class="post-title">
                            <a href="#" onclick="simpleBlog.showPost('${post.id}')">${post.title}</a>
                        </h2>
                        <div class="post-meta">
                            <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                            <span class="category"><i class="fas fa-folder"></i> ${post.category}</span>
                            <span class="author"><i class="fas fa-user"></i> ${post.author}</span>
                        </div>
                    </header>
                    
                    <div class="post-excerpt">
                        ${post.excerpt || post.content.substring(0, 200) + '...'}
                    </div>
                    
                    <div class="post-tags">
                        ${(post.tags || []).map(tag => `<span class="tag"># ${tag}</span>`).join('')}
                    </div>
                    
                    <footer class="post-footer">
                        <a href="#" onclick="simpleBlog.showPost('${post.id}')" class="read-more">
                            阅读全文 <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="reading-time">
                            <i class="fas fa-clock"></i> ${Math.ceil((post.content || '').length / 200)} 分钟阅读
                        </div>
                    </footer>
                </div>
            </article>
        `).join('');
    }

    // 显示主页
    showHomePage() {
        const posts = this.blogData.posts || [];
        const content = `
            ${this.renderHeader()}
            <div class="posts-container">
                ${this.renderPosts(posts)}
            </div>
        `;
        this.updateContent(content);
        this.updateActiveNav('home');
    }

    // 显示文章详情
    showPost(postId) {
        const post = (this.blogData.posts || []).find(p => p.id === postId);
        if (!post) {
            this.showHomePage();
            return;
        }

        const content = `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1>${post.title}</h1>
                    <nav class="breadcrumb">
                        <a href="#" onclick="simpleBlog.showPage('home')"><i class="fas fa-home"></i> 首页</a>
                        <span class="separator"><i class="fas fa-chevron-right"></i></span>
                        <span class="current">${post.title}</span>
                    </nav>
                </div>
            </div>
            
            <article class="post-detail">
                <header class="post-header">
                    <div class="post-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                        <span class="category"><i class="fas fa-folder"></i> ${post.category}</span>
                        <span class="author"><i class="fas fa-user"></i> ${post.author}</span>
                    </div>
                </header>
                
                <div class="post-content">
                    ${this.formatContent(post.content)}
                </div>
                
                <div class="post-tags">
                    ${(post.tags || []).map(tag => `<span class="tag"># ${tag}</span>`).join('')}
                </div>
                
                <footer class="post-footer">
                    <a href="#" onclick="simpleBlog.showPage('home')" class="back-link">
                        <i class="fas fa-arrow-left"></i> 返回首页
                    </a>
                </footer>
            </article>
        `;
        this.updateContent(content);
    }

    // 显示友链页面
    showFriendsPage() {
        const friendLinks = this.blogData.friendLinks || [];
        const content = `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1><i class="fas fa-link"></i> 友情链接</h1>
                    <nav class="breadcrumb">
                        <a href="#" onclick="simpleBlog.showPage('home')"><i class="fas fa-home"></i> 首页</a>
                        <span class="separator"><i class="fas fa-chevron-right"></i></span>
                        <span class="current">友链</span>
                    </nav>
                </div>
            </div>
            
            <div class="friends-content">
                <div class="friends-grid">
                    ${friendLinks.map(link => `
                        <div class="friend-card">
                            <div class="friend-avatar">
                                <i class="fas fa-link"></i>
                            </div>
                            <div class="friend-info">
                                <h3>${link.name}</h3>
                                <p>${link.description}</p>
                                <a href="${link.url}" target="_blank" class="friend-link">
                                    访问 <i class="fas fa-external-link-alt"></i>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        this.updateContent(content);
        this.updateActiveNav('friends');
    }

    // 显示关于页面
    showAboutPage() {
        const content = `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1><i class="fas fa-user"></i> 关于我</h1>
                    <nav class="breadcrumb">
                        <a href="#" onclick="simpleBlog.showPage('home')"><i class="fas fa-home"></i> 首页</a>
                        <span class="separator"><i class="fas fa-chevron-right"></i></span>
                        <span class="current">关于</span>
                    </nav>
                </div>
            </div>
            
            <div class="about-content">
                <div class="author-info">
                    <div class="author-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2>赵嘉宁</h2>
                    <p class="author-email"><i class="fas fa-envelope"></i> zjncs@example.com</p>
                    <div class="social-links">
                        <a href="https://github.com/zjncs" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://orcid.org/0009-0005-0821-6046" target="_blank">
                            <i class="ai ai-orcid"></i> ORCID
                        </a>
                    </div>
                </div>
                
                <div class="about-text">
                    <p>你好！我是赵嘉宁，天津大学信息管理与信息系统专业的学生。</p>
                    <p>我对数据分析、人工智能和后端开发有浓厚的兴趣，喜欢探索新技术并分享学习心得。</p>
                    <p>这个博客是我记录学习过程和技术思考的地方，希望能与大家交流学习。</p>
                </div>
            </div>
        `;
        this.updateContent(content);
        this.updateActiveNav('about');
    }

    // 显示Coding页面
    showCodingPage() {
        const content = `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1><i class="fas fa-code"></i> 编程时间</h1>
                    <nav class="breadcrumb">
                        <a href="#" onclick="simpleBlog.showPage('home')"><i class="fas fa-home"></i> 首页</a>
                        <span class="separator"><i class="fas fa-chevron-right"></i></span>
                        <span class="current">编程时间</span>
                    </nav>
                </div>
            </div>
            
            <div class="coding-content">
                <div class="coding-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fab fa-github"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">25</div>
                            <div class="stat-label">代码仓库</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-star"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">156</div>
                            <div class="stat-label">获得星标</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-code-branch"></i></div>
                        <div class="stat-info">
                            <div class="stat-number">342</div>
                            <div class="stat-label">总提交数</div>
                        </div>
                    </div>
                </div>
                
                <div class="github-profile">
                    <h2><i class="fab fa-github"></i> GitHub 个人资料</h2>
                    <div class="profile-links">
                        <a href="https://github.com/zjncs" target="_blank" class="profile-link">
                            <i class="fab fa-github"></i> 访问GitHub
                        </a>
                        <a href="https://orcid.org/0009-0005-0821-6046" target="_blank" class="profile-link">
                            <i class="ai ai-orcid"></i> ORCID资料
                        </a>
                    </div>
                </div>
            </div>
        `;
        this.updateContent(content);
        this.updateActiveNav('coding');
    }

    // 显示页面
    showPage(page) {
        console.log('显示页面:', page);
        switch(page) {
            case 'home':
                this.showHomePage();
                break;
            case 'friends':
                this.showFriendsPage();
                break;
            case 'about':
                this.showAboutPage();
                break;
            case 'coding':
                this.showCodingPage();
                break;
            default:
                console.log('页面开发中:', page);
                this.showHomePage();
        }
    }

    // 格式化内容
    formatContent(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // 更新内容
    updateContent(content) {
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = content;
        }
    }

    // 更新导航状态
    updateActiveNav(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.onclick && link.onclick.toString().includes(`'${page}'`)) {
                link.classList.add('active');
            }
        });
    }

    // 初始化
    init() {
        console.log('🚀 简化博客引擎初始化');
        this.showHomePage();
        console.log('✅ 简化博客引擎初始化完成');
    }
}

// 创建全局实例
window.SimpleBlogEngine = SimpleBlogEngine;
window.simpleBlog = new SimpleBlogEngine();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleBlog.init();
    });
} else {
    window.simpleBlog.init();
}

console.log('✅ 简化博客引擎已加载');
