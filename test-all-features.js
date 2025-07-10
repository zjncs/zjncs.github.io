// 功能测试脚本
// 测试博客系统的所有功能

console.log('🧪 开始功能测试...');

class FeatureTester {
    constructor() {
        this.testResults = [];
    }

    // 添加测试结果
    addResult(testName, passed, message = '') {
        this.testResults.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${message}`);
    }

    // 测试DOM元素
    testDOMElements() {
        console.log('📋 测试DOM元素...');
        
        const content = document.getElementById('content');
        this.addResult('Content容器', !!content, content ? '存在' : '不存在');
        
        const scripts = document.querySelectorAll('script[src]');
        this.addResult('外部脚本加载', scripts.length > 0, `加载了${scripts.length}个脚本`);
        
        return content && scripts.length > 0;
    }

    // 测试博客实例
    testBlogInstance() {
        console.log('🏠 测试博客实例...');
        
        const blogExists = !!window.blog;
        this.addResult('Blog实例', blogExists, blogExists ? '存在' : '不存在');
        
        if (blogExists) {
            const hasData = !!window.blog.blogData;
            this.addResult('博客数据', hasData, hasData ? '存在' : '不存在');
            
            if (hasData) {
                const postsCount = window.blog.blogData.posts?.length || 0;
                this.addResult('文章数据', postsCount > 0, `${postsCount}篇文章`);
                
                const hasSettings = !!window.blog.blogData.settings;
                this.addResult('设置数据', hasSettings, hasSettings ? '存在' : '不存在');
                
                const hasFriendLinks = !!window.blog.blogData.friendLinks;
                this.addResult('友链数据', hasFriendLinks, hasFriendLinks ? `${window.blog.blogData.friendLinks.length}个友链` : '不存在');
            }
        }
        
        return blogExists;
    }

    // 测试页面导航
    async testPageNavigation() {
        console.log('🧭 测试页面导航...');
        
        if (!window.blog) {
            this.addResult('页面导航', false, 'Blog实例不存在');
            return false;
        }
        
        const pages = ['home', 'categories', 'tags', 'friends', 'about'];
        let allPassed = true;
        
        for (const page of pages) {
            try {
                await window.blog.showPage(page);
                const content = document.getElementById('content').innerHTML;
                const hasContent = content.length > 100 && !content.includes('正在加载');
                this.addResult(`${page}页面`, hasContent, hasContent ? '正常显示' : '显示异常');
                if (!hasContent) allPassed = false;
            } catch (error) {
                this.addResult(`${page}页面`, false, `错误: ${error.message}`);
                allPassed = false;
            }
        }
        
        return allPassed;
    }

    // 测试Coding Time功能
    async testCodingTimeFeature() {
        console.log('💻 测试Coding Time功能...');
        
        const statsExists = !!window.CodingTimeStats;
        this.addResult('CodingTimeStats类', statsExists, statsExists ? '存在' : '不存在');
        
        const rendererExists = !!window.CodingTimeRenderer;
        this.addResult('CodingTimeRenderer类', rendererExists, rendererExists ? '存在' : '不存在');
        
        if (statsExists && rendererExists) {
            try {
                const stats = new CodingTimeStats();
                const data = await stats.generateCodingStats();
                this.addResult('统计数据生成', !!data, data ? '成功' : '失败');
                
                const renderer = new CodingTimeRenderer();
                const html = await renderer.renderCodingTimePage();
                this.addResult('页面渲染', html.length > 1000, `生成了${html.length}字符的HTML`);
                
                // 测试页面显示
                if (window.blog) {
                    await window.blog.showPage('coding');
                    const content = document.getElementById('content').innerHTML;
                    const hasCodingContent = content.includes('编程时间') || content.includes('GitHub');
                    this.addResult('Coding页面显示', hasCodingContent, hasCodingContent ? '正常显示' : '显示异常');
                }
                
                return true;
            } catch (error) {
                this.addResult('Coding Time功能', false, `错误: ${error.message}`);
                return false;
            }
        }
        
        return false;
    }

    // 测试Live2D
    testLive2D() {
        console.log('🎭 测试Live2D...');
        
        const l2dExists = !!window.L2Dwidget;
        this.addResult('L2Dwidget库', l2dExists, l2dExists ? '已加载' : '未加载');
        
        // 检查Live2D容器
        setTimeout(() => {
            const l2dCanvas = document.querySelector('#live2dcanvas');
            this.addResult('Live2D画布', !!l2dCanvas, l2dCanvas ? '已创建' : '未创建');
        }, 2000);
        
        return l2dExists;
    }

    // 测试动态背景
    testDynamicBackground() {
        console.log('🌟 测试动态背景...');
        
        const backgroundExists = !!window.DynamicBackground;
        this.addResult('动态背景类', backgroundExists, backgroundExists ? '存在' : '不存在');
        
        const canvas = document.querySelector('#background-canvas');
        this.addResult('背景画布', !!canvas, canvas ? '存在' : '不存在');
        
        return backgroundExists;
    }

    // 测试增强交互
    testEnhancedInteractions() {
        console.log('✨ 测试增强交互...');
        
        const interactionsExists = !!window.EnhancedInteractions;
        this.addResult('增强交互类', interactionsExists, interactionsExists ? '存在' : '不存在');
        
        return interactionsExists;
    }

    // 测试主题切换
    testThemeToggle() {
        console.log('🎨 测试主题切换...');
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.addResult('当前主题', !!currentTheme, currentTheme || '未设置');
        
        if (window.blog && typeof window.blog.toggleTheme === 'function') {
            try {
                const originalTheme = currentTheme;
                window.blog.toggleTheme();
                const newTheme = document.documentElement.getAttribute('data-theme');
                const themeChanged = originalTheme !== newTheme;
                this.addResult('主题切换', themeChanged, themeChanged ? `${originalTheme} → ${newTheme}` : '未改变');
                
                // 切换回原主题
                if (themeChanged) {
                    window.blog.toggleTheme();
                }
                
                return themeChanged;
            } catch (error) {
                this.addResult('主题切换', false, `错误: ${error.message}`);
                return false;
            }
        } else {
            this.addResult('主题切换功能', false, '方法不存在');
            return false;
        }
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🚀 开始完整功能测试...');
        
        const results = {
            dom: this.testDOMElements(),
            blog: this.testBlogInstance(),
            navigation: await this.testPageNavigation(),
            codingTime: await this.testCodingTimeFeature(),
            live2d: this.testLive2D(),
            background: this.testDynamicBackground(),
            interactions: this.testEnhancedInteractions(),
            theme: this.testThemeToggle()
        };
        
        // 生成测试报告
        this.generateReport(results);
        
        return results;
    }

    // 生成测试报告
    generateReport(results) {
        console.log('\n📊 ===== 功能测试报告 =====');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const passRate = ((passed / total) * 100).toFixed(1);
        
        console.log(`总体通过率: ${passed}/${total} (${passRate}%)`);
        console.log('\n详细结果:');
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.message}`);
        });
        
        console.log('\n功能模块状态:');
        Object.entries(results).forEach(([module, status]) => {
            const icon = status ? '✅' : '❌';
            console.log(`${icon} ${module}: ${status ? '正常' : '异常'}`);
        });
        
        if (passRate >= 80) {
            console.log('\n🎉 博客系统功能基本正常！');
        } else if (passRate >= 60) {
            console.log('\n⚠️ 博客系统有部分功能需要修复');
        } else {
            console.log('\n🚨 博客系统存在较多问题，需要检查');
        }
        
        console.log('\n💡 可以运行以下命令进行特定测试:');
        console.log('   - tester.testBlogInstance() - 测试博客实例');
        console.log('   - tester.testCodingTimeFeature() - 测试Coding Time');
        console.log('   - tester.testPageNavigation() - 测试页面导航');
    }
}

// 创建测试实例
const tester = new FeatureTester();

// 导出到全局
window.FeatureTester = FeatureTester;
window.tester = tester;

// 页面加载完成后自动运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => tester.runAllTests(), 2000);
    });
} else {
    setTimeout(() => tester.runAllTests(), 2000);
}

console.log('🧪 功能测试脚本已加载');
console.log('💡 运行 tester.runAllTests() 开始完整测试');
