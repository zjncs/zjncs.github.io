// 立即停止所有页面跳转的紧急脚本
(function() {
    'use strict';
    
    console.log('🛑 启动跳转阻止器...');
    
    // 1. 阻止 window.location 赋值
    const originalLocation = window.location;
    let redirectCount = 0;
    
    Object.defineProperty(window, 'location', {
        get: function() {
            return originalLocation;
        },
        set: function(value) {
            redirectCount++;
            console.warn(`🚫 阻止跳转 #${redirectCount} 到:`, value);
            
            // 显示阻止跳转的通知
            showRedirectBlocked(value, redirectCount);
            
            // 如果跳转次数过多，显示警告
            if (redirectCount > 5) {
                showRedirectWarning();
            }
        }
    });
    
    // 2. 阻止 location.href 赋值
    Object.defineProperty(window.location, 'href', {
        get: function() {
            return originalLocation.href;
        },
        set: function(value) {
            redirectCount++;
            console.warn(`🚫 阻止location.href跳转 #${redirectCount} 到:`, value);
            showRedirectBlocked(value, redirectCount);
        }
    });
    
    // 3. 阻止 location.replace
    const originalReplace = window.location.replace;
    window.location.replace = function(url) {
        redirectCount++;
        console.warn(`🚫 阻止location.replace跳转 #${redirectCount} 到:`, url);
        showRedirectBlocked(url, redirectCount);
    };
    
    // 4. 阻止 location.assign
    const originalAssign = window.location.assign;
    window.location.assign = function(url) {
        redirectCount++;
        console.warn(`🚫 阻止location.assign跳转 #${redirectCount} 到:`, url);
        showRedirectBlocked(url, redirectCount);
    };
    
    // 5. 阻止 history.pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(state, title, url) {
        console.warn('🚫 阻止history.pushState到:', url);
        showRedirectBlocked(url, ++redirectCount);
    };
    
    history.replaceState = function(state, title, url) {
        console.warn('🚫 阻止history.replaceState到:', url);
        showRedirectBlocked(url, ++redirectCount);
    };
    
    // 6. 显示跳转被阻止的通知
    function showRedirectBlocked(url, count) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: ${20 + (count - 1) * 60}px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: ${10000 + count};
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 400px;
            word-break: break-all;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong>🚫 跳转已阻止 #${count}</strong><br>
                    <small>${url}</small>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // 7. 显示跳转循环警告
    function showRedirectWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff5722;
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 20000;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            max-width: 500px;
        `;
        
        warning.innerHTML = `
            <h2>🚨 检测到跳转循环</h2>
            <p style="margin: 15px 0;">已阻止 ${redirectCount} 次跳转尝试</p>
            <p style="margin: 15px 0;">这通常是由认证系统循环跳转引起的</p>
            <div style="margin-top: 20px;">
                <button onclick="window.location.href='admin-safe.html'" style="padding: 10px 20px; margin: 5px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">进入安全模式</button>
                <button onclick="window.location.href='safe-mode.html'" style="padding: 10px 20px; margin: 5px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">系统安全模式</button>
                <button onclick="this.remove()" style="padding: 10px 20px; margin: 5px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭警告</button>
            </div>
        `;
        
        document.body.appendChild(warning);
    }
    
    // 8. 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 9. 显示启动通知
    const startNotification = document.createElement('div');
    startNotification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    startNotification.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span>🛡️ 跳转阻止器已启用</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 15px;">×</button>
        </div>
    `;
    
    document.body.appendChild(startNotification);
    
    // 3秒后自动隐藏启动通知
    setTimeout(() => {
        if (startNotification.parentNode) {
            startNotification.parentNode.removeChild(startNotification);
        }
    }, 3000);
    
    // 10. 监听页面卸载事件
    window.addEventListener('beforeunload', function(e) {
        if (redirectCount > 0) {
            e.preventDefault();
            e.returnValue = '检测到跳转尝试，确定要离开页面吗？';
            console.warn('🚫 阻止页面卸载');
        }
    });
    
    // 11. 提供手动控制函数
    window.stopRedirectBlocker = function() {
        // 恢复原始功能
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true
        });
        
        window.location.replace = originalReplace;
        window.location.assign = originalAssign;
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        
        console.log('✅ 跳转阻止器已停用');
        
        const stopNotification = document.createElement('div');
        stopNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF9800;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
        `;
        stopNotification.textContent = '⚠️ 跳转阻止器已停用';
        document.body.appendChild(stopNotification);
        
        setTimeout(() => {
            if (stopNotification.parentNode) {
                stopNotification.parentNode.removeChild(stopNotification);
            }
        }, 3000);
    };
    
    window.getRedirectCount = function() {
        return redirectCount;
    };
    
    console.log('✅ 跳转阻止器启动完成');
    console.log('💡 使用 stopRedirectBlocker() 来停用阻止器');
    console.log('💡 使用 getRedirectCount() 查看阻止的跳转次数');
    
})();

// 使用说明：
// 1. 在浏览器控制台运行此脚本
// 2. 或在HTML中引入：<script src="stop-redirects.js"></script>
// 3. 脚本会自动阻止所有页面跳转
// 4. 使用 stopRedirectBlocker() 停用阻止器
// 5. 使用 getRedirectCount() 查看阻止次数
