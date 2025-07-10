// 博客系统重启脚本
// 用于彻底清理和重启系统，解决无限请求问题

(function() {
    'use strict';
    
    console.log('🔄 开始执行系统重启...');
    
    // 1. 立即停止所有定时器
    function stopAllTimers() {
        console.log('⏹️ 停止所有定时器...');
        
        // 停止所有setTimeout
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i <= highestTimeoutId; i++) {
            clearTimeout(i);
        }
        
        // 停止所有setInterval
        const highestIntervalId = setInterval(() => {}, 1000);
        for (let i = 0; i <= highestIntervalId; i++) {
            clearInterval(i);
        }
        clearInterval(highestIntervalId);
        
        console.log('✅ 所有定时器已停止');
    }
    
    // 2. 阻止所有网络请求
    function blockNetworkRequests() {
        console.log('🚫 阻止所有网络请求...');
        
        // 阻止fetch
        const originalFetch = window.fetch;
        window.fetch = function() {
            console.warn('🚫 阻止fetch请求');
            return Promise.reject(new Error('请求已被阻止'));
        };
        
        // 阻止XMLHttpRequest
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            console.warn('🚫 阻止XMLHttpRequest');
            throw new Error('XMLHttpRequest已被阻止');
        };
        
        console.log('✅ 网络请求已阻止');
    }
    
    // 3. 清理事件监听器
    function cleanupEventListeners() {
        console.log('🧹 清理事件监听器...');
        
        // 移除所有可能有问题的事件监听器
        const events = ['storage', 'beforeunload', 'unload', 'resize', 'scroll'];
        events.forEach(eventType => {
            const listeners = window.getEventListeners ? window.getEventListeners(window)[eventType] : [];
            if (listeners) {
                listeners.forEach(listener => {
                    window.removeEventListener(eventType, listener.listener);
                });
            }
        });
        
        console.log('✅ 事件监听器已清理');
    }
    
    // 4. 清理本地存储中的问题数据
    function cleanupStorage() {
        console.log('🗑️ 清理存储数据...');
        
        try {
            // 保留重要数据，清理可能有问题的数据
            const importantKeys = ['blogData', 'blog_auth_settings'];
            const allKeys = Object.keys(localStorage);
            
            allKeys.forEach(key => {
                if (!importantKeys.includes(key)) {
                    localStorage.removeItem(key);
                    console.log(`删除存储项: ${key}`);
                }
            });
            
            // 清理会话存储
            sessionStorage.clear();
            
            console.log('✅ 存储数据已清理');
        } catch (error) {
            console.error('❌ 清理存储失败:', error);
        }
    }
    
    // 5. 移除有问题的脚本
    function removeProblematicScripts() {
        console.log('📜 移除有问题的脚本...');
        
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (script.src.includes('live2d') || 
                script.src.includes('L2Dwidget') ||
                script.src.includes('cdn.jsdelivr.net/npm/live2d')) {
                script.remove();
                console.log(`移除脚本: ${script.src}`);
            }
        });
        
        console.log('✅ 有问题的脚本已移除');
    }
    
    // 6. 停止所有动画
    function stopAnimations() {
        console.log('🎬 停止所有动画...');
        
        try {
            const animations = document.getAnimations();
            animations.forEach(animation => {
                animation.cancel();
            });
            console.log(`✅ 停止了 ${animations.length} 个动画`);
        } catch (error) {
            console.log('⚠️ 动画停止功能不可用');
        }
    }
    
    // 7. 清理Service Worker
    function cleanupServiceWorkers() {
        console.log('🔧 清理Service Worker...');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                    console.log('移除Service Worker');
                });
            });
        }
    }
    
    // 8. 重置全局变量
    function resetGlobalVariables() {
        console.log('🌐 重置全局变量...');
        
        // 重置可能有问题的全局变量
        if (window.blogEngine) {
            if (typeof window.blogEngine.cleanup === 'function') {
                window.blogEngine.cleanup();
            }
            window.blogEngine = null;
        }
        
        if (window.githubIntegration) {
            window.githubIntegration = null;
        }
        
        console.log('✅ 全局变量已重置');
    }
    
    // 9. 执行完整重启
    function performRestart() {
        console.log('🚀 执行完整重启...');
        
        // 按顺序执行所有清理操作
        stopAllTimers();
        blockNetworkRequests();
        cleanupEventListeners();
        removeProblematicScripts();
        stopAnimations();
        cleanupServiceWorkers();
        resetGlobalVariables();
        cleanupStorage();
        
        console.log('✅ 系统重启完成');
        
        // 显示重启完成消息
        const restartMessage = document.createElement('div');
        restartMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        restartMessage.textContent = '✅ 系统重启完成！无限请求已停止。';
        document.body.appendChild(restartMessage);
        
        // 3秒后移除消息
        setTimeout(() => {
            if (restartMessage.parentNode) {
                restartMessage.parentNode.removeChild(restartMessage);
            }
        }, 3000);
        
        // 提供导航选项
        setTimeout(() => {
            const choice = confirm('系统重启完成！\n\n点击"确定"进入安全模式\n点击"取消"刷新当前页面');
            if (choice) {
                window.location.href = 'safe-mode.html';
            } else {
                window.location.reload();
            }
        }, 3500);
    }
    
    // 10. 监控系统状态
    function monitorSystem() {
        console.log('📊 开始监控系统状态...');
        
        let requestCount = 0;
        const startTime = Date.now();
        
        // 监控网络请求
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            requestCount++;
            console.warn(`⚠️ 检测到请求 #${requestCount}: ${args[0]}`);
            
            if (requestCount > 10) {
                console.error('🚨 检测到异常请求频率，执行紧急重启');
                performRestart();
                return Promise.reject(new Error('异常请求已被阻止'));
            }
            
            return originalFetch.apply(this, args);
        };
        
        // 定期报告状态
        const statusInterval = setInterval(() => {
            const uptime = Date.now() - startTime;
            console.log(`📊 系统状态 - 运行时间: ${uptime}ms, 请求数: ${requestCount}`);
            
            if (uptime > 30000) { // 30秒后停止监控
                clearInterval(statusInterval);
                console.log('✅ 系统监控结束');
            }
        }, 5000);
    }
    
    // 主函数
    function main() {
        console.log('🎯 博客系统重启脚本启动');
        
        // 立即执行重启
        performRestart();
        
        // 开始监控
        monitorSystem();
        
        console.log('🏁 重启脚本执行完成');
    }
    
    // 如果页面已加载，立即执行；否则等待加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    
    // 导出重启函数供外部调用
    window.emergencyRestart = performRestart;
    window.systemMonitor = monitorSystem;
    
})();

// 使用方法：
// 1. 在浏览器控制台中运行此脚本
// 2. 或者在HTML中引入：<script src="restart.js"></script>
// 3. 或者直接调用：window.emergencyRestart()
