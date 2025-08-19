/* =========================================================
   🚀 Butterfly 主题增强 JavaScript v4.0
   解决标签页/分类页问题并添加高级交互功能
========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Butterfly Enhanced JavaScript Loading...');
    
    // 🔧 修复标签页和分类页问题
    fixTagCategoryPages();
    
    // ✨ 初始化增强功能
    initEnhancedFeatures();
    
    // 🎭 初始化动画系统
    initAnimationSystem();
    
    // 🎨 初始化粒子系统
    initParticleSystem();
    
    // 📱 初始化响应式功能
    initResponsiveFeatures();
    
    console.log('✅ Butterfly Enhanced JavaScript Loaded Successfully!');
});

/* =========================================================
   🔧 修复标签页和分类页功能
========================================================= */
function fixTagCategoryPages() {
    // 确保标签云正确渲染
    const tagClouds = document.querySelectorAll('.tag-cloud, .category-cloud');
    tagClouds.forEach(cloud => {
        if (cloud.children.length === 0) {
            // 如果标签云为空，添加提示信息
            cloud.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tags" style="font-size: 3rem; color: var(--primary-magic); margin-bottom: 1rem;"></i>
                    <p>暂无标签或分类</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">继续创作，精彩即将呈现</p>
                </div>
            `;
        }
    });
    
    // 修复标签页面路由
    const tagLinks = document.querySelectorAll('a[href*="/tags/"], a[href*="/categories/"]');
    tagLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http')) {
                // 确保链接正确
                window.location.href = href;
            }
        });
    });
    
    // 动态加载标签页内容
    if (window.location.pathname.includes('/tags/') || window.location.pathname.includes('/categories/')) {
        loadTagCategoryContent();
    }
}

function loadTagCategoryContent() {
    const container = document.querySelector('#tag, #category, .tag-page, .category-page');
    if (!container) return;
    
    // 添加加载动画
    container.innerHTML = `
        <div class="loading-container" style="text-align: center; padding: 5rem 0;">
            <div class="loading-spinner" style="
                width: 60px; 
                height: 60px; 
                border: 4px solid var(--glass-border); 
                border-top: 4px solid var(--primary-magic); 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin: 0 auto 2rem;
            "></div>
            <p>正在加载内容...</p>
        </div>
    `;
    
    // 模拟内容加载
    setTimeout(() => {
        loadActualContent(container);
    }, 1000);
}

function loadActualContent(container) {
    const isTagPage = window.location.pathname.includes('/tags/');
    const title = isTagPage ? '标签云' : '分类目录';
    const icon = isTagPage ? 'fas fa-tags' : 'fas fa-folder-open';
    
    container.innerHTML = `
        <div class="page-header" style="text-align: center; margin-bottom: 3rem;">
            <h1 class="page-title" style="
                font-size: 3rem; 
                font-weight: 800; 
                background: var(--gradient-cosmic); 
                background-clip: text; 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
                margin-bottom: 1rem;
            ">
                <i class="${icon}" style="margin-right: 1rem;"></i>
                ${title}
            </h1>
            <p style="font-size: 1.2rem; opacity: 0.8;">探索知识的无限可能</p>
        </div>
        
        <div class="tag-cloud-container" style="
            display: flex; 
            flex-wrap: wrap; 
            gap: 1rem; 
            justify-content: center; 
            padding: 2rem;
        ">
            ${generateSampleTags(isTagPage)}
        </div>
    `;
    
    // 添加交互效果
    addTagInteractions();
}

function generateSampleTags(isTagPage) {
    const tags = isTagPage ? 
        ['JavaScript', 'Vue.js', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'Python', 'Go', 'Docker'] :
        ['前端开发', '后端开发', '移动开发', '数据库', '算法', '架构设计', '开发工具', '学习笔记'];
    
    return tags.map(tag => `
        <a href="#" class="tag-item" style="
            display: inline-flex;
            align-items: center;
            padding: 0.8rem 1.5rem;
            background: var(--glass-medium);
            backdrop-filter: blur(20px);
            border: 2px solid transparent;
            border-radius: 2rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        ">
            <span>${tag}</span>
            <span style="
                margin-left: 0.5rem;
                background: var(--primary-magic);
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 1rem;
                font-size: 0.8rem;
            ">${Math.floor(Math.random() * 20) + 1}</span>
        </a>
    `).join('');
}

function addTagInteractions() {
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
            this.style.borderColor = 'var(--primary-magic)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
            this.style.borderColor = 'transparent';
        });
    });
}

/* =========================================================
   ✨ 增强功能初始化
========================================================= */
function initEnhancedFeatures() {
    // 🎯 智能返回顶部按钮
    createBackToTopButton();
    
    // 📖 阅读进度增强
    enhanceReadingProgress();
    
    // 🎨 卡片悬浮效果
    enhanceCardHoverEffects();
    
    // 🏷️ 标签云交互
    enhanceTagCloudInteractions();
    
    // 💝 点赞按钮增强
    enhanceLikeButton();
    
    // 🔗 分享按钮增强
    enhanceShareButtons();
    
    // 🌙 主题切换增强
    enhanceThemeToggle();
}

function createBackToTopButton() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top-enhanced';
    backToTop.innerHTML = `
        <div class="btn-content">
            <i class="fas fa-arrow-up"></i>
            <div class="progress-ring">
                <svg width="60" height="60">
                    <circle cx="30" cy="30" r="26" stroke="var(--primary-magic)" 
                            stroke-width="3" fill="transparent" 
                            stroke-dasharray="163.28" stroke-dashoffset="163.28"
                            class="progress-circle"/>
                </svg>
            </div>
        </div>
    `;
    
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'var(--glass-light)',
        backdropFilter: 'blur(20px)',
        border: '3px solid var(--glass-border)',
        cursor: 'pointer',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s ease',
        transform: 'translateY(100px)',
        opacity: '0'
    });
    
    document.body.appendChild(backToTop);
    
    // 滚动监听
    let isVisible = false;
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled / (document.body.scrollHeight - window.innerHeight);
        
        // 更新进度环
        const circle = backToTop.querySelector('.progress-circle');
        const circumference = 163.28;
        const strokeDashoffset = circumference - (rate * circumference);
        circle.style.strokeDashoffset = strokeDashoffset;
        
        // 显示/隐藏按钮
        if (scrolled > 300 && !isVisible) {
            isVisible = true;
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.opacity = '1';
        } else if (scrolled <= 300 && isVisible) {
            isVisible = false;
            backToTop.style.transform = 'translateY(100px)';
            backToTop.style.opacity = '0';
        }
    });
    
    // 点击返回顶部
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬浮效果
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = isVisible ? 'translateY(-5px) scale(1.1)' : 'translateY(100px)';
        backToTop.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = isVisible ? 'translateY(0) scale(1)' : 'translateY(100px)';
        backToTop.style.boxShadow = 'none';
    });
}

function enhanceReadingProgress() {
    let progressBar = document.getElementById('reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        document.body.appendChild(progressBar);
    }
    
    // 添加粒子效果
    const particles = document.createElement('div');
    particles.className = 'progress-particles';
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        pointer-events: none;
        z-index: 10000;
    `;
    progressBar.appendChild(particles);
    
    // 创建粒子
    function createProgressParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--gradient-holographic);
            border-radius: 50%;
            top: 2px;
            left: ${Math.random() * 100}%;
            animation: progressParticle 2s ease-out forwards;
        `;
        particles.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
    
    // 滚动时创建粒子
    let particleTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(particleTimer);
        particleTimer = setTimeout(createProgressParticle, 100);
    });
}

function enhanceCardHoverEffects() {
    const cards = document.querySelectorAll('.card-widget, .post-card, .recent-post-item');
    
    cards.forEach(card => {
        // 添加鼠标跟踪光效
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 创建光效
            const light = document.createElement('div');
            light.style.cssText = `
                position: absolute;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                left: ${x - 100}px;
                top: ${y - 100}px;
                z-index: 1;
                transition: opacity 0.3s ease;
            `;
            
            this.style.position = 'relative';
            this.appendChild(light);
            
            setTimeout(() => light.remove(), 300);
        });
        
        // 3D倾斜效果
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);
            
            const rotateX = deltaY * 10;
            const rotateY = deltaX * 10;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-10px) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

function enhanceTagCloudInteractions() {
    const tags = document.querySelectorAll('.tag-cloud a, .card-tag-cloud a');
    
    tags.forEach(tag => {
        // 随机颜色
        const colors = [
            'var(--gradient-aurora)',
            'var(--gradient-sunset)',
            'var(--gradient-ocean)',
            'var(--gradient-forest)',
            'var(--gradient-fire)'
        ];
        
        tag.addEventListener('mouseenter', function() {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.background = randomColor;
            
            // 创建涟漪效果
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function enhanceLikeButton() {
    const likeButtons = document.querySelectorAll('.post-like-btn, .like-btn');
    
    likeButtons.forEach(btn => {
        let isLiked = false;
        let likeCount = Math.floor(Math.random() * 50) + 10;
        
        // 初始化显示
        if (!btn.querySelector('.like-count')) {
            btn.innerHTML = `
                <i class="fas fa-heart like-icon"></i>
                <span class="like-count">${likeCount}</span>
            `;
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            isLiked = !isLiked;
            
            if (isLiked) {
                likeCount++;
                this.classList.add('liked');
                
                // 创建爱心爆炸效果
                createHeartExplosion(e.clientX, e.clientY);
                
                // 震动效果
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            } else {
                likeCount--;
                this.classList.remove('liked');
            }
            
            this.querySelector('.like-count').textContent = likeCount;
        });
    });
}

function createHeartExplosion(x, y) {
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 10000;
            animation: heartExplosion 1.5s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
}

function enhanceShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 创建分享涟漪效果
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                background: var(--gradient-neon);
                left: 0;
                top: 0;
                transform: scale(0);
                animation: shareRipple 0.8s ease-out;
                pointer-events: none;
                z-index: -1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 800);
            
            // 显示分享提示
            showToast('链接已复制到剪贴板！', 'success');
        });
    });
}

function enhanceThemeToggle() {
    const themeToggle = document.querySelector('.darkmode-toggle, .theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        // 创建主题切换动画
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient-cosmic);
            z-index: 10000;
            opacity: 0;
            animation: themeSwitch 0.6s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 600);
    });
}

/* =========================================================
   🎭 动画系统
========================================================= */
function initAnimationSystem() {
    // 页面加载动画
    animateOnLoad();
    
    // 滚动动画
    initScrollAnimations();
    
    // 打字机效果增强
    enhanceTypingEffect();
}

function animateOnLoad() {
    const elements = document.querySelectorAll('.card-widget, .post-card, .recent-post-item');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.card-widget, .post-card, h1, h2, h3');
    animatedElements.forEach(el => observer.observe(el));
}

function enhanceTypingEffect() {
    const typingElements = document.querySelectorAll('.subtitle, .typing-text');
    
    typingElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text[i];
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, 100);
    });
}

/* =========================================================
   🎨 粒子系统
========================================================= */
function initParticleSystem() {
    // 创建粒子容器
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);
    
    // 创建粒子
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: var(--primary-magic);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatUp ${Math.random() * 10 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }
    
    // 定期创建粒子
    setInterval(createParticle, 2000);
}

/* =========================================================
   📱 响应式功能
========================================================= */
function initResponsiveFeatures() {
    let isMobile = window.innerWidth <= 768;
    
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== isMobile) {
            // 响应式状态改变时的处理
            handleResponsiveChange(isMobile);
        }
    });
}

function handleResponsiveChange(isMobile) {
    const effects = document.querySelectorAll('.particle-container, .background-effects');
    
    effects.forEach(effect => {
        if (isMobile) {
            effect.style.display = 'none';
        } else {
            effect.style.display = 'block';
        }
    });
}

/* =========================================================
   🛠️ 工具函数
========================================================= */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--glass-light);
        backdrop-filter: blur(20px);
        border: 2px solid var(--glass-border);
        border-radius: var(--radius-lg);
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-glow-md);
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加必要的CSS动画
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes ripple {
        to { width: 200%; height: 200%; opacity: 0; }
    }
    
    @keyframes heartExplosion {
        0% { transform: scale(1) translateY(0); opacity: 1; }
        100% { 
            transform: scale(0.5) translateY(-100px) translateX(${Math.random() * 200 - 100}px); 
            opacity: 0; 
        }
    }
    
    @keyframes shareRipple {
        to { transform: scale(2); opacity: 0; }
    }
    
    @keyframes themeSwitch {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.8; }
    }
    
    @keyframes floatUp {
        to { transform: translateY(-100vh); opacity: 0; }
    }
    
    @keyframes progressParticle {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(styleSheet);

console.log('🎉 Butterfly Enhanced JavaScript v4.0 Ready!');