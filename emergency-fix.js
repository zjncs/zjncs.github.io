// 紧急修复脚本 - 确保博客能正常显示
console.log('🚨 紧急修复脚本启动');

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

// 强制显示内容
async function forceShowContent() {
    await waitForDOM();
    
    console.log('🔧 开始强制显示内容');
    
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('❌ 找不到content元素');
        return;
    }
    
    // 检查是否有blog实例
    if (!window.blog) {
        console.log('⚠️ blog实例不存在，创建简单版本');
        createSimpleBlog();
        return;
    }
    
    // 检查blog数据
    if (!window.blog.blogData || !window.blog.blogData.posts) {
        console.log('⚠️ 博客数据不存在，重新加载');
        window.blog.blogData = window.blog.loadBlogData();
    }
    
    // 强制显示主页
    try {
        console.log('🏠 强制显示主页');
        const homeContent = window.blog.renderHomePage();
        contentDiv.innerHTML = homeContent;
        console.log('✅ 主页显示成功');
    } catch (error) {
        console.error('❌ 显示主页失败:', error);
        showFallbackContent();
    }
}

// 创建简单的博客实例
function createSimpleBlog() {
    console.log('🔨 创建简单博客实例');
    
    const contentDiv = document.getElementById('content');
    
    // 显示基本内容
    contentDiv.innerHTML = `
        <div class="blog-header">
            <div class="blog-header-content">
                <h1>赵嘉宁的技术笔记</h1>
                <p class="blog-description">记录学习过程中的点点滴滴</p>
                <div class="blog-nav">
                    <a href="#" onclick="showHome()" class="nav-link active">
                        <i class="fas fa-home"></i> 首页
                    </a>
                    <a href="#" onclick="showAbout()" class="nav-link">
                        <i class="fas fa-user"></i> 关于
                    </a>
                    <a href="/login.html" class="nav-link admin-link">
                        <i class="fas fa-cog"></i> 管理后台
                    </a>
                </div>
            </div>
        </div>
        
        <div class="posts-container">
            <article class="post-card">
                <div class="post-content-wrapper">
                    <header class="post-header">
                        <h2 class="post-title">
                            <a href="#">欢迎来到我的博客</a>
                        </h2>
                        <div class="post-meta">
                            <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                            <span class="category"><i class="fas fa-folder"></i> 博客</span>
                        </div>
                    </header>
                    
                    <div class="post-excerpt">
                        欢迎来到我的技术博客！这里记录了我的学习心得和技术分享。
                        博客系统正在正常运行，您可以通过管理后台添加更多内容。
                    </div>
                    
                    <div class="post-tags">
                        <span class="tag"># 欢迎</span>
                        <span class="tag"># 博客</span>
                        <span class="tag"># 开始</span>
                    </div>
                    
                    <footer class="post-footer">
                        <a href="#" class="read-more">
                            阅读全文 <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="reading-time">
                            <i class="fas fa-clock"></i> 1 分钟阅读
                        </div>
                    </footer>
                </div>
            </article>
        </div>
    `;
    
    // 添加简单的导航功能
    window.showHome = function() {
        console.log('显示首页');
        // 重新加载页面
        location.reload();
    };
    
    window.showAbout = function() {
        console.log('显示关于页面');
        contentDiv.innerHTML = `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1><i class="fas fa-user"></i> 关于我</h1>
                    <nav class="breadcrumb">
                        <a href="#" onclick="showHome()"><i class="fas fa-home"></i> 首页</a>
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
                        <a href="mailto:zjncs@example.com">
                            <i class="fas fa-envelope"></i> 邮箱联系
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
    };
    
    console.log('✅ 简单博客实例创建完成');
}

// 显示后备内容
function showFallbackContent() {
    console.log('📄 显示后备内容');
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <h1>博客系统</h1>
            <p>系统正在初始化中，请稍候...</p>
            <button onclick="location.reload()" style="
                padding: 0.5rem 1rem;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                margin-top: 1rem;
            ">
                重新加载
            </button>
        </div>
    `;
}

// 监听错误
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript错误:', e.error);
    console.error('文件:', e.filename, '行号:', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Promise错误:', e.reason);
});

// 启动修复
console.log('🚀 启动紧急修复');
forceShowContent();

// 导出到全局
window.forceShowContent = forceShowContent;
window.createSimpleBlog = createSimpleBlog;
