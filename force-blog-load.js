// 强制加载博客内容脚本
console.log('🔧 强制博客加载脚本启动');

// 等待DOM加载完成
function waitForDOM() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

// 强制重新初始化博客
async function forceBlogInit() {
    await waitForDOM();
    
    console.log('🚀 强制重新初始化博客');
    
    // 检查是否有blog实例
    if (window.blog && typeof window.blog.init === 'function') {
        console.log('✅ 找到blog实例，重新初始化');
        try {
            await window.blog.init();
            console.log('✅ 博客重新初始化成功');
            return;
        } catch (error) {
            console.error('❌ 博客重新初始化失败:', error);
        }
    }
    
    // 如果没有blog实例，尝试创建
    if (window.SimpleBlog) {
        console.log('🔨 创建新的博客实例');
        try {
            window.blog = new SimpleBlog();
            await window.blog.init();
            console.log('✅ 新博客实例创建成功');
            return;
        } catch (error) {
            console.error('❌ 创建博客实例失败:', error);
        }
    }
    
    // 最后的备用方案：直接显示内容
    console.log('⚠️ 使用备用方案显示内容');
    showFallbackBlog();
}

// 备用博客显示
function showFallbackBlog() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    // 获取博客数据
    let blogData;
    try {
        const savedData = localStorage.getItem('blogData');
        blogData = savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error('解析博客数据失败:', error);
        blogData = null;
    }
    
    // 如果没有数据，使用默认数据
    if (!blogData && window.defaultBlogData) {
        blogData = window.defaultBlogData;
    }
    
    if (!blogData) {
        console.error('❌ 无法获取博客数据');
        return;
    }
    
    // 渲染博客内容
    const posts = blogData.posts || [];
    const settings = blogData.settings || {};
    
    const postsHtml = posts.map(post => `
        <article class="post-card">
            <div class="post-content-wrapper">
                <header class="post-header">
                    <h2 class="post-title">
                        <a href="#" onclick="showPost('${post.id}')">${post.title}</a>
                    </h2>
                    <div class="post-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                        <span class="category"><i class="fas fa-folder"></i> ${post.category}</span>
                        <span class="author"><i class="fas fa-user"></i> ${post.author}</span>
                    </div>
                </header>
                
                <div class="post-excerpt">
                    ${post.excerpt}
                </div>
                
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag"># ${tag}</span>`).join('')}
                </div>
                
                <footer class="post-footer">
                    <a href="#" onclick="showPost('${post.id}')" class="read-more">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="reading-time">
                        <i class="fas fa-clock"></i> ${Math.ceil(post.content.length / 200)} 分钟阅读
                    </div>
                </footer>
            </div>
        </article>
    `).join('');
    
    contentDiv.innerHTML = `
        <div class="blog-header">
            <div class="blog-header-content">
                <h1>${settings.title || '赵嘉宁的技术笔记'}</h1>
                <p class="blog-description">${settings.description || '记录学习过程中的点点滴滴'}</p>
                <div class="blog-nav">
                    <a href="#" onclick="showPage('home')" class="nav-link active">
                        <i class="fas fa-home"></i> 首页
                    </a>
                    <a href="#" onclick="showPage('categories')" class="nav-link">
                        <i class="fas fa-folder"></i> 分类
                    </a>
                    <a href="#" onclick="showPage('tags')" class="nav-link">
                        <i class="fas fa-tags"></i> 标签
                    </a>
                    <a href="#" onclick="showPage('friends')" class="nav-link">
                        <i class="fas fa-link"></i> 友链
                    </a>
                    <a href="#" onclick="showPage('coding')" class="nav-link">
                        <i class="fas fa-code"></i> Coding
                    </a>
                    <a href="#" onclick="showPage('about')" class="nav-link">
                        <i class="fas fa-user"></i> 关于
                    </a>
                    <a href="/login.html" class="nav-link admin-link">
                        <i class="fas fa-cog"></i> 管理后台
                    </a>
                </div>
            </div>
        </div>
        
        <div class="posts-container">
            ${postsHtml}
        </div>
    `;
    
    // 添加导航功能
    window.showPage = function(page) {
        console.log('显示页面:', page);
        if (window.blog && typeof window.blog.showPage === 'function') {
            window.blog.showPage(page);
        } else {
            // 简单的页面切换
            switch(page) {
                case 'home':
                    location.reload();
                    break;
                case 'about':
                    showAboutPage();
                    break;
                case 'friends':
                    showFriendsPage();
                    break;
                default:
                    console.log('页面功能开发中:', page);
            }
        }
    };
    
    window.showPost = function(postId) {
        console.log('显示文章:', postId);
        const post = posts.find(p => p.id === postId);
        if (post) {
            showPostDetail(post);
        }
    };
    
    console.log('✅ 备用博客内容已显示');
}

// 显示文章详情
function showPostDetail(post) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="blog-header">
            <div class="blog-header-content">
                <h1>${post.title}</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="showPage('home')"><i class="fas fa-home"></i> 首页</a>
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
                ${post.content.replace(/\n/g, '<br>').replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')}
            </div>
            
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag"># ${tag}</span>`).join('')}
            </div>
            
            <footer class="post-footer">
                <a href="#" onclick="showPage('home')" class="back-link">
                    <i class="fas fa-arrow-left"></i> 返回首页
                </a>
            </footer>
        </article>
    `;
}

// 显示关于页面
function showAboutPage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="blog-header">
            <div class="blog-header-content">
                <h1><i class="fas fa-user"></i> 关于我</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="showPage('home')"><i class="fas fa-home"></i> 首页</a>
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
}

// 显示友链页面
function showFriendsPage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="blog-header">
            <div class="blog-header-content">
                <h1><i class="fas fa-link"></i> 友情链接</h1>
                <nav class="breadcrumb">
                    <a href="#" onclick="showPage('home')"><i class="fas fa-home"></i> 首页</a>
                    <span class="separator"><i class="fas fa-chevron-right"></i></span>
                    <span class="current">友链</span>
                </nav>
            </div>
        </div>
        
        <div class="friends-content">
            <div class="friends-grid">
                <div class="friend-card">
                    <div class="friend-avatar">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="friend-info">
                        <h3>zjncs GitHub</h3>
                        <p>我的GitHub主页，记录代码历程</p>
                        <a href="https://github.com/zjncs" target="_blank" class="friend-link">
                            访问 <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
                
                <div class="friend-card">
                    <div class="friend-avatar">
                        <i class="ai ai-orcid"></i>
                    </div>
                    <div class="friend-info">
                        <h3>ORCID Profile</h3>
                        <p>学术身份标识，记录学术成果</p>
                        <a href="https://orcid.org/0009-0005-0821-6046" target="_blank" class="friend-link">
                            访问 <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 立即执行
forceBlogInit();

// 导出到全局
window.forceBlogInit = forceBlogInit;

console.log('🔧 强制博客加载脚本已加载');
