// 看板娘头部显示修复脚本
// 立即修复看板娘头部被遮挡的问题

(function() {
    'use strict';
    
    console.log('🎭 开始修复看板娘头部显示问题...');
    
    // 等待看板娘加载完成
    function waitForWaifu() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas');
        
        if (widget && canvas) {
            applyFix();
        } else {
            setTimeout(waitForWaifu, 500);
        }
    }
    
    // 应用修复
    function applyFix() {
        console.log('🔧 应用看板娘头部显示修复...');
        
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas');
        
        if (widget) {
            // 确保容器有足够的空间
            widget.style.cssText += `
                top: 0 !important;
                right: 0 !important;
                bottom: auto !important;
                position: fixed !important;
                overflow: visible !important;
                width: auto !important;
                height: auto !important;
                z-index: 999 !important;
                pointer-events: none !important;
            `;
            
            console.log('✅ 看板娘容器样式已修复');
        }
        
        if (canvas) {
            // 确保画布不被裁剪
            canvas.style.cssText += `
                max-width: none !important;
                max-height: none !important;
                pointer-events: auto !important;
            `;
            
            console.log('✅ 看板娘画布样式已修复');
        }
        
        // 添加调试边框（可选）
        if (widget && window.location.search.includes('debug')) {
            widget.style.border = '2px dashed rgba(255, 0, 0, 0.5)';
            console.log('🔍 调试边框已添加');
        }
        
        // 检查头部是否可见
        setTimeout(() => {
            checkHeadVisibility();
        }, 1000);
    }
    
    // 检查头部可见性
    function checkHeadVisibility() {
        const widget = document.getElementById('live2d-widget');
        if (!widget) return;
        
        const rect = widget.getBoundingClientRect();
        const isHeadVisible = rect.top >= 0;
        
        if (isHeadVisible) {
            console.log('✅ 看板娘头部显示正常');
            showNotification('看板娘头部显示已修复！', 'success');
        } else {
            console.warn('⚠️ 看板娘头部可能仍被遮挡');
            showNotification('看板娘头部可能仍有问题，请检查', 'warning');
            
            // 尝试进一步调整
            widget.style.transform = 'translateY(20px)';
            console.log('🔧 应用额外的垂直偏移');
        }
    }
    
    // 显示通知
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
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    notification.parentNode.removeChild(notification);
                }, 300);
            }
        }, 3000);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 响应式调整
    function handleResize() {
        const widget = document.getElementById('live2d-widget');
        if (!widget) return;
        
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 768) {
            // 移动端调整
            widget.style.cssText += `
                transform: scale(0.7) translateY(10px) !important;
                right: -20px !important;
                bottom: 0 !important;
                top: auto !important;
            `;
            console.log('📱 应用移动端调整');
        } else if (screenWidth <= 1024) {
            // 平板端调整
            widget.style.cssText += `
                transform: scale(0.85) !important;
                right: -15px !important;
            `;
            console.log('📟 应用平板端调整');
        } else {
            // 桌面端调整
            widget.style.cssText += `
                transform: none !important;
                right: 0 !important;
                top: 0 !important;
                bottom: auto !important;
            `;
            console.log('🖥️ 应用桌面端调整');
        }
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 提供手动调整功能
    window.adjustWaifuPosition = function(vOffset = 0) {
        const widget = document.getElementById('live2d-widget');
        if (widget) {
            widget.style.transform = `translateY(${vOffset}px)`;
            console.log(`🎯 手动调整看板娘位置: ${vOffset}px`);
            showNotification(`看板娘位置已调整: ${vOffset}px`);
        }
    };
    
    // 提供重置功能
    window.resetWaifuPosition = function() {
        const widget = document.getElementById('live2d-widget');
        if (widget) {
            widget.style.transform = '';
            console.log('🔄 看板娘位置已重置');
            showNotification('看板娘位置已重置');
            setTimeout(() => {
                applyFix();
                handleResize();
            }, 100);
        }
    };
    
    // 开始修复流程
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForWaifu);
    } else {
        waitForWaifu();
    }
    
    console.log('🎭 看板娘修复脚本已加载');
    console.log('💡 使用 adjustWaifuPosition(offset) 手动调整位置');
    console.log('💡 使用 resetWaifuPosition() 重置位置');
    
})();

// 使用说明：
// 1. 在浏览器控制台运行此脚本
// 2. 或在HTML中引入：<script src="fix-waifu-head.js"></script>
// 3. 手动调整：adjustWaifuPosition(20) // 向下移动20px
// 4. 重置位置：resetWaifuPosition()
// 5. 调试模式：在URL后添加 ?debug 查看边框
