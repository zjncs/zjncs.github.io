// 博客调试脚本
// 用于诊断博客加载问题

console.log('🔍 开始博客调试...');

// 检查DOM元素
function checkDOMElements() {
    console.log('📋 检查DOM元素:');
    
    const content = document.getElementById('content');
    console.log('- content元素:', content ? '✅ 存在' : '❌ 不存在');
    
    if (content) {
        console.log('- content内容:', content.innerHTML.substring(0, 100) + '...');
    }
    
    const scripts = document.querySelectorAll('script[src]');
    console.log('- 外部脚本数量:', scripts.length);
    scripts.forEach(script => {
        console.log(`  - ${script.src}`);
    });
}

// 检查全局变量
function checkGlobalVariables() {
    console.log('🌐 检查全局变量:');
    console.log('- window.blog:', typeof window.blog);
    console.log('- window.SimpleBlog:', typeof window.SimpleBlog);
    console.log('- window.CodingTimeStats:', typeof window.CodingTimeStats);
    console.log('- window.CodingTimeRenderer:', typeof window.CodingTimeRenderer);
}

// 检查博客数据
function checkBlogData() {
    console.log('📊 检查博客数据:');
    
    if (window.blog) {
        console.log('- blog实例存在');
        console.log('- blogData:', window.blog.blogData ? '✅ 存在' : '❌ 不存在');
        
        if (window.blog.blogData) {
            console.log('- 文章数量:', window.blog.blogData.posts?.length || 0);
            console.log('- 设置:', window.blog.blogData.settings ? '✅ 存在' : '❌ 不存在');
        }
    } else {
        console.log('- blog实例不存在');
    }
    
    // 检查localStorage
    const savedData = localStorage.getItem('blogData');
    console.log('- localStorage中的blogData:', savedData ? '✅ 存在' : '❌ 不存在');
    
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            console.log('- localStorage数据解析成功，文章数量:', parsed.posts?.length || 0);
        } catch (error) {
            console.log('- localStorage数据解析失败:', error.message);
        }
    }
}

// 检查错误
function checkErrors() {
    console.log('🚨 检查错误:');
    
    // 监听JavaScript错误
    window.addEventListener('error', (e) => {
        console.error('JavaScript错误:', e.error);
        console.error('文件:', e.filename);
        console.error('行号:', e.lineno);
    });
    
    // 监听Promise错误
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise错误:', e.reason);
    });
}

// 尝试手动初始化
function manualInit() {
    console.log('🔧 尝试手动初始化...');
    
    if (window.blog) {
        try {
            console.log('调用blog.init()...');
            window.blog.init();
            console.log('✅ 手动初始化成功');
        } catch (error) {
            console.error('❌ 手动初始化失败:', error);
        }
    } else {
        console.log('❌ blog实例不存在，无法手动初始化');
    }
}

// 强制显示主页
function forceShowHome() {
    console.log('🏠 强制显示主页...');
    
    if (window.blog) {
        try {
            window.blog.showPage('home');
            console.log('✅ 强制显示主页成功');
        } catch (error) {
            console.error('❌ 强制显示主页失败:', error);
        }
    }
}

// 重置博客数据
function resetBlogData() {
    console.log('🔄 重置博客数据...');
    
    localStorage.removeItem('blogData');
    console.log('✅ 已清除localStorage中的blogData');
    
    if (window.blog) {
        window.blog.blogData = window.blog.loadBlogData();
        console.log('✅ 已重新加载博客数据');
        
        try {
            window.blog.showPage('home');
            console.log('✅ 已重新显示主页');
        } catch (error) {
            console.error('❌ 重新显示主页失败:', error);
        }
    }
}

// 主调试函数
function debugBlog() {
    console.log('🔍 ===== 博客调试报告 =====');
    
    checkDOMElements();
    console.log('');
    
    checkGlobalVariables();
    console.log('');
    
    checkBlogData();
    console.log('');
    
    checkErrors();
    console.log('');
    
    console.log('🔧 ===== 修复尝试 =====');
    
    // 等待一下再尝试修复
    setTimeout(() => {
        manualInit();
        
        setTimeout(() => {
            forceShowHome();
        }, 1000);
    }, 500);
}

// 导出调试函数到全局
window.debugBlog = debugBlog;
window.resetBlogData = resetBlogData;
window.forceShowHome = forceShowHome;

// 页面加载完成后自动运行调试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugBlog);
} else {
    debugBlog();
}

console.log('🔍 调试脚本加载完成');
console.log('💡 可以在控制台运行以下命令:');
console.log('   - debugBlog() - 运行完整调试');
console.log('   - resetBlogData() - 重置博客数据');
console.log('   - forceShowHome() - 强制显示主页');
