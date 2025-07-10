// 增强交互效果系统
// 包含光影追随、滚动动画、微交互等

class EnhancedInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupMouseFollowEffects();
        this.setupScrollAnimations();
        this.setupMasonryLayout();
        this.setupImageEffects();
        this.setupLoadingAnimations();
        
        console.log('✨ 增强交互效果已启动');
    }
    
    // 光影追随效果
    setupMouseFollowEffects() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.post-card');
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // 只在鼠标在卡片内时应用效果
                if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
                    card.style.setProperty('--mouse-x', `${x}%`);
                    card.style.setProperty('--mouse-y', `${y}%`);
                }
            });
        });
        
        // 为卡片添加鼠标进入和离开事件
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('post-card')) {
                e.target.style.setProperty('--mouse-x', '50%');
                e.target.style.setProperty('--mouse-y', '50%');
            }
        }, true);
    }
    
    // 滚动触发动画
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // 添加延迟以创建波浪效果
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        // 观察所有需要动画的元素
        this.observeElements(observer);
        
        // 监听新元素的添加
        this.setupMutationObserver(observer);
    }
    
    observeElements(observer) {
        // 为文章卡片添加动画类
        const cards = document.querySelectorAll('.post-card');
        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            
            // 交错动画方向
            if (index % 3 === 0) {
                card.classList.add('slide-left');
            } else if (index % 3 === 1) {
                // 默认从下往上
            } else {
                card.classList.add('slide-right');
            }
            
            observer.observe(card);
        });
        
        // 为其他元素添加动画
        const animateElements = document.querySelectorAll('.blog-header, .search-container, .nav-link');
        animateElements.forEach(element => {
            if (!element.classList.contains('animate-on-scroll')) {
                element.classList.add('animate-on-scroll', 'scale');
                observer.observe(element);
            }
        });
    }
    
    setupMutationObserver(scrollObserver) {
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const cards = node.querySelectorAll ? node.querySelectorAll('.post-card') : [];
                        cards.forEach((card, index) => {
                            if (!card.classList.contains('animate-on-scroll')) {
                                card.classList.add('animate-on-scroll');
                                scrollObserver.observe(card);
                            }
                        });
                    }
                });
            });
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 瀑布流布局
    setupMasonryLayout() {
        const container = document.querySelector('.posts-container');
        if (!container) return;
        
        // 添加瀑布流类
        container.classList.add('posts-masonry');
        
        // 动态调整卡片高度
        this.adjustCardHeights();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.adjustCardHeights();
        });
    }
    
    adjustCardHeights() {
        const cards = document.querySelectorAll('.post-card');
        
        cards.forEach(card => {
            // 重置高度
            card.style.height = 'auto';
            
            // 获取内容高度
            const contentHeight = card.scrollHeight;
            
            // 计算grid-row-end
            const rowHeight = 10; // 对应CSS中的grid-auto-rows
            const rowSpan = Math.ceil(contentHeight / rowHeight);
            
            card.style.gridRowEnd = `span ${rowSpan}`;
        });
    }
    
    // 图片效果
    setupImageEffects() {
        const images = document.querySelectorAll('.post-card img');
        
        images.forEach(img => {
            const card = img.closest('.post-card');
            if (!card) return;
            
            // 添加图片容器
            const imgContainer = document.createElement('div');
            imgContainer.className = 'post-image-container';
            imgContainer.style.cssText = `
                overflow: hidden;
                border-radius: var(--radius-md);
                margin-bottom: var(--spacing-md);
                position: relative;
            `;
            
            // 包装图片
            img.parentNode.insertBefore(imgContainer, img);
            imgContainer.appendChild(img);
            
            // 添加图片样式
            img.style.cssText = `
                width: 100%;
                height: 200px;
                object-fit: cover;
                transition: all var(--transition-normal);
                filter: saturate(1) brightness(1);
            `;
            
            // 悬停效果
            card.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
                img.style.filter = 'saturate(1.2) brightness(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.filter = 'saturate(1) brightness(1)';
            });
        });
    }
    
    // 创意加载动画
    setupLoadingAnimations() {
        // 替换默认加载动画
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            this.createCreativeLoader(loadingElement);
        }
    }
    
    createCreativeLoader(container) {
        container.innerHTML = `
            <div class="creative-loader">
                <div class="loader-logo">
                    <div class="logo-circle"></div>
                    <div class="logo-text">Blog</div>
                </div>
                <div class="loader-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="loader-text">正在加载精彩内容...</div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .creative-loader {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2rem;
            }
            
            .loader-logo {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .logo-circle {
                width: 60px;
                height: 60px;
                border: 3px solid var(--primary-color);
                border-top: 3px solid transparent;
                border-radius: 50%;
                animation: logoSpin 2s linear infinite;
            }
            
            .logo-text {
                position: absolute;
                font-family: var(--font-serif);
                font-weight: 700;
                font-size: 1.2rem;
                color: var(--primary-color);
            }
            
            .loader-progress {
                width: 200px;
                height: 4px;
                background: rgba(102, 126, 234, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
                border-radius: 2px;
                animation: progressFill 3s ease-in-out infinite;
            }
            
            .loader-text {
                font-family: var(--font-mono);
                font-size: 0.9rem;
                color: var(--text-secondary);
                animation: textPulse 2s ease-in-out infinite;
            }
            
            @keyframes logoSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes progressFill {
                0%, 100% { width: 0%; }
                50% { width: 100%; }
            }
            
            @keyframes textPulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
        `;
        
        if (!document.querySelector('#creative-loader-styles')) {
            style.id = 'creative-loader-styles';
            document.head.appendChild(style);
        }
    }
    
    // 平滑滚动增强
    setupSmoothScrolling() {
        // 为所有内部链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // 微交互效果
    setupMicroInteractions() {
        // 按钮点击波纹效果
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .nav-link')) {
                this.createRippleEffect(e);
            }
        });
    }
    
    createRippleEffect(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // 确保按钮有相对定位
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // 添加波纹动画
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 清理
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // 性能优化的节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedInteractions = new EnhancedInteractions();
});

// 导出供其他脚本使用
window.EnhancedInteractions = EnhancedInteractions;
