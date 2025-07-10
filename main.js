import BlogEngine from './blog-engine.js';

// 创建博客引擎实例
const blogEngine = new BlogEngine();

// 全局暴露博客引擎，供 HTML 中的 onclick 事件使用
window.blogEngine = blogEngine;

// 初始化博客
document.addEventListener('DOMContentLoaded', function() {
    blogEngine.init();
    
    // 添加一些基础交互功能
    setupSearchFunctionality();
    setupThemeToggle();
    setupScrollToTop();
});

// 搜索功能
function setupSearchFunctionality() {
    // 创建搜索框
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML = `
        <input type="text" id="search-input" placeholder="搜索文章..." />
        <div id="search-results" class="search-results"></div>
    `;
    
    // 将搜索框添加到页面
    const header = document.querySelector('.blog-header');
    if (header) {
        header.appendChild(searchBox);
    }
    
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                const results = blogEngine.blogData.posts.filter(post => 
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query)) ||
                    (post.category && post.category.toLowerCase().includes(query))
                ).slice(0, 5);
                
                if (results.length > 0) {
                    searchResults.innerHTML = results.map(post => `
                        <div class="search-result-item" onclick="blogEngine.showPost('${post.id}')">
                            <h4>${post.title}</h4>
                            <p>${post.excerpt || blogEngine.generateExcerpt(post.content)}</p>
                        </div>
                    `).join('');
                    searchResults.style.display = 'block';
                } else {
                    searchResults.innerHTML = '<div class="no-results">没有找到相关文章</div>';
                    searchResults.style.display = 'block';
                }
            }, 300);
        });
        
        // 点击外部关闭搜索结果
        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// 主题切换
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = '切换主题';
    
    // 添加到导航栏
    const nav = document.querySelector('.blog-nav');
    if (nav) {
        nav.appendChild(themeToggle);
    }
    
    // 检查当前主题
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeToggle, currentTheme);
    
    // 主题切换事件
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeToggle, newTheme);
    });
}

function updateThemeIcon(button, theme) {
    const icon = button.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// 回到顶部
function setupScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.title = '回到顶部';
    
    document.body.appendChild(scrollToTopBtn);
    
    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击回到顶部
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 添加一些实用的全局函数
window.utils = {
    // 格式化日期
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // 复制到剪贴板
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            blogEngine.showNotification('已复制到剪贴板', 'success');
        } catch (err) {
            console.error('复制失败:', err);
            blogEngine.showNotification('复制失败', 'error');
        }
    },
    
    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

console.log('博客系统已加载完成！');