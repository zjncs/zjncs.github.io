// 看板娘头部完整显示修复脚本
// 专门解决头部被切掉的问题

(function() {
    'use strict';
    
    console.log('🎭 启动看板娘头部完整显示修复...');
    
    let fixAttempts = 0;
    const maxAttempts = 10;
    
    function waitForWaifu() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (widget && canvas) {
            console.log('✅ 找到看板娘元素，开始修复');
            fixWaifuHead();
        } else {
            fixAttempts++;
            if (fixAttempts < maxAttempts) {
                console.log(`⏳ 等待看板娘加载... (${fixAttempts}/${maxAttempts})`);
                setTimeout(waitForWaifu, 1000);
            } else {
                console.error('❌ 看板娘加载超时');
            }
        }
    }
    
    function fixWaifuHead() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (!widget || !canvas) {
            console.error('❌ 找不到看板娘元素');
            return;
        }
        
        console.log('🔧 应用头部显示修复...');
        
        // 修复容器样式
        widget.style.cssText += `
            position: fixed !important;
            top: -30px !important;
            right: -15px !important;
            bottom: auto !important;
            left: auto !important;
            z-index: 999 !important;
            pointer-events: none !important;
            overflow: visible !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 30px 15px 0 0 !important;
            transform: none !important;
            clip: none !important;
            clip-path: none !important;
        `;
        
        // 修复画布样式
        canvas.style.cssText += `
            max-width: none !important;
            max-height: none !important;
            width: auto !important;
            height: auto !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            clip: none !important;
            clip-path: none !important;
            overflow: visible !important;
            pointer-events: auto !important;
        `;
        
        console.log('✅ 基础样式修复完成');
        
        // 检查头部是否完整显示
        setTimeout(() => {
            checkHeadComplete();
        }, 1500);
        
        // 添加响应式处理
        handleResponsive();
        
        // 监听窗口变化
        window.addEventListener('resize', handleResponsive);
    }
    
    function checkHeadComplete() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (!widget || !canvas) return;
        
        const widgetRect = widget.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        console.log('📊 看板娘位置信息:');
        console.log(`容器: top=${widgetRect.top}, right=${window.innerWidth - widgetRect.right}`);
        console.log(`画布: top=${canvasRect.top}, right=${window.innerWidth - canvasRect.right}`);
        
        // 检查头部是否被切掉
        const isHeadCut = canvasRect.top < 0 || widgetRect.top < -20;
        
        if (isHeadCut) {
            console.warn('⚠️ 检测到头部可能被切掉，应用额外修复');
            applyExtraFix();
        } else {
            console.log('✅ 头部显示正常');
            showNotification('看板娘头部显示修复完成！', 'success');
        }
    }
    
    function applyExtraFix() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (!widget || !canvas) return;
        
        console.log('🔧 应用额外的头部修复...');
        
        // 进一步调整容器位置
        widget.style.top = '-50px !important';
        widget.style.paddingTop = '50px !important';
        
        // 确保画布有足够的顶部空间
        canvas.style.marginTop = '0 !important';
        canvas.style.transform = 'translateY(0) !important';
        
        // 如果还是不行，尝试调整整个Live2D的显示区域
        setTimeout(() => {
            const finalCheck = canvas.getBoundingClientRect();
            if (finalCheck.top < 0) {
                console.log('🚀 应用最终修复方案');
                widget.style.transform = 'translateY(50px) !important';
                showNotification('已应用最强修复，头部应该完整显示了', 'success');
            } else {
                showNotification('头部显示修复成功！', 'success');
            }
        }, 1000);
    }
    
    function handleResponsive() {
        const widget = document.getElementById('live2d-widget');
        if (!widget) return;
        
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 768) {
            // 移动端：缩小并移到右下角
            widget.style.cssText += `
                top: auto !important;
                bottom: 0 !important;
                right: -20px !important;
                transform: scale(0.6) !important;
                transform-origin: bottom right !important;
                padding: 0 20px 0 0 !important;
            `;
            console.log('📱 应用移动端头部修复');
        } else if (screenWidth <= 1024) {
            // 平板端：适当缩小
            widget.style.cssText += `
                top: -40px !important;
                right: -10px !important;
                transform: scale(0.8) !important;
                transform-origin: top right !important;
                padding: 40px 10px 0 0 !important;
            `;
            console.log('📟 应用平板端头部修复');
        } else {
            // 桌面端：完整显示
            widget.style.cssText += `
                top: -30px !important;
                right: -15px !important;
                transform: none !important;
                padding: 30px 15px 0 0 !important;
            `;
            console.log('🖥️ 应用桌面端头部修复');
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10001;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    notification.parentNode.removeChild(notification);
                }, 300);
            }
        }, 3000);
    }
    
    // 提供手动调整功能
    window.fixWaifuHeadManually = function() {
        console.log('🔧 手动修复看板娘头部');
        fixWaifuHead();
    };
    
    window.adjustWaifuTop = function(offset = 0) {
        const widget = document.getElementById('live2d-widget');
        if (widget) {
            widget.style.top = `${offset}px !important`;
            widget.style.paddingTop = `${Math.abs(Math.min(offset, 0))}px !important`;
            console.log(`🎯 调整看板娘顶部位置: ${offset}px`);
            showNotification(`看板娘顶部位置已调整: ${offset}px`);
        }
    };
    
    // 开始修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(waitForWaifu, 2000);
        });
    } else {
        setTimeout(waitForWaifu, 2000);
    }
    
    console.log('🎭 看板娘头部修复脚本已加载');
    console.log('💡 手动修复: fixWaifuHeadManually()');
    console.log('💡 调整顶部: adjustWaifuTop(-50) // 负数向上移动');
    
})();

// 快速修复命令：
// 在浏览器控制台运行：
// adjustWaifuTop(-50)  // 向上移动50px
// adjustWaifuTop(-80)  // 向上移动80px
// fixWaifuHeadManually()  // 重新应用修复
