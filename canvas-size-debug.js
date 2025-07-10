// 看板娘画布尺寸调试工具
// 专门解决画布太小导致头部被切的问题

(function() {
    'use strict';
    
    console.log('🎨 启动画布尺寸调试工具...');
    
    let debugInfo = {
        originalWidth: 0,
        originalHeight: 0,
        currentWidth: 0,
        currentHeight: 0,
        canvasFound: false
    };
    
    function waitForCanvas() {
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (widget && canvas) {
            console.log('🎯 找到看板娘画布，开始调试');
            analyzeCanvas(widget, canvas);
            expandCanvas(widget, canvas);
        } else {
            setTimeout(waitForCanvas, 1000);
        }
    }
    
    function analyzeCanvas(widget, canvas) {
        const widgetRect = widget.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        debugInfo.originalWidth = canvas.width || canvasRect.width;
        debugInfo.originalHeight = canvas.height || canvasRect.height;
        debugInfo.canvasFound = true;
        
        console.log('📊 画布分析结果:');
        console.log(`容器尺寸: ${widgetRect.width}x${widgetRect.height}`);
        console.log(`画布尺寸: ${debugInfo.originalWidth}x${debugInfo.originalHeight}`);
        console.log(`画布位置: top=${canvasRect.top}, left=${canvasRect.left}`);
        
        // 检查头部是否被切
        if (canvasRect.top > 0) {
            console.warn('⚠️ 画布顶部可能有空白，头部可能被切掉');
        }
        
        if (debugInfo.originalHeight < 500) {
            console.warn('⚠️ 画布高度可能不足，建议增加');
        }
    }
    
    function expandCanvas(widget, canvas) {
        console.log('🔧 扩大画布尺寸...');
        
        // 设置更大的画布尺寸
        const newWidth = 350;
        const newHeight = 700;
        
        // 方法1: 直接设置画布属性
        if (canvas.width !== undefined) {
            canvas.width = newWidth;
            canvas.height = newHeight;
        }
        
        // 方法2: 通过CSS强制设置尺寸
        canvas.style.cssText += `
            width: ${newWidth}px !important;
            height: ${newHeight}px !important;
            max-width: none !important;
            max-height: none !important;
            min-width: ${newWidth}px !important;
            min-height: ${newHeight}px !important;
        `;
        
        // 方法3: 设置容器尺寸
        widget.style.cssText += `
            width: ${newWidth}px !important;
            height: ${newHeight}px !important;
            min-width: ${newWidth}px !important;
            min-height: ${newHeight}px !important;
        `;
        
        debugInfo.currentWidth = newWidth;
        debugInfo.currentHeight = newHeight;
        
        console.log(`✅ 画布尺寸已扩大到: ${newWidth}x${newHeight}`);
        
        // 验证修改结果
        setTimeout(() => {
            verifyCanvasSize(canvas);
        }, 1000);
    }
    
    function verifyCanvasSize(canvas) {
        const rect = canvas.getBoundingClientRect();
        console.log('🔍 验证画布尺寸:');
        console.log(`实际显示尺寸: ${rect.width}x${rect.height}`);
        console.log(`画布属性尺寸: ${canvas.width}x${canvas.height}`);
        
        if (rect.height >= 600) {
            console.log('✅ 画布高度充足，头部应该完整显示');
            showNotification('画布尺寸已优化，头部应该完整显示！', 'success');
        } else {
            console.warn('⚠️ 画布高度仍然不足，尝试进一步调整');
            forceExpandCanvas(canvas);
        }
    }
    
    function forceExpandCanvas(canvas) {
        console.log('🚀 强制扩大画布...');
        
        // 更激进的方法
        const style = document.createElement('style');
        style.textContent = `
            #live2d-widget,
            #live2d-widget canvas,
            #live2dcanvas {
                width: 400px !important;
                height: 800px !important;
                max-width: none !important;
                max-height: none !important;
                min-width: 400px !important;
                min-height: 800px !important;
            }
            
            #live2d-widget {
                top: -150px !important;
                right: -50px !important;
                padding-top: 150px !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ 应用强制画布扩大样式');
        showNotification('已应用强制画布扩大，头部应该完整了！', 'success');
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
    window.expandWaifuCanvas = function(width = 400, height = 800) {
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        const widget = document.getElementById('live2d-widget');
        
        if (canvas && widget) {
            console.log(`🎨 手动设置画布尺寸: ${width}x${height}`);
            
            canvas.style.cssText += `
                width: ${width}px !important;
                height: ${height}px !important;
            `;
            
            widget.style.cssText += `
                width: ${width}px !important;
                height: ${height}px !important;
                top: -${Math.floor(height * 0.2)}px !important;
                padding-top: ${Math.floor(height * 0.2)}px !important;
            `;
            
            showNotification(`画布尺寸已设置为 ${width}x${height}`);
        }
    };
    
    window.getCanvasInfo = function() {
        console.log('📊 当前画布信息:', debugInfo);
        return debugInfo;
    };
    
    window.resetCanvasSize = function() {
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        const widget = document.getElementById('live2d-widget');
        
        if (canvas && widget) {
            canvas.style.width = '';
            canvas.style.height = '';
            widget.style.width = '';
            widget.style.height = '';
            
            console.log('🔄 画布尺寸已重置');
            showNotification('画布尺寸已重置');
            
            setTimeout(() => {
                expandCanvas(widget, canvas);
            }, 500);
        }
    };
    
    // 开始调试
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(waitForCanvas, 2000);
        });
    } else {
        setTimeout(waitForCanvas, 2000);
    }
    
    console.log('🎨 画布尺寸调试工具已加载');
    console.log('💡 手动扩大画布: expandWaifuCanvas(400, 800)');
    console.log('💡 查看画布信息: getCanvasInfo()');
    console.log('💡 重置画布: resetCanvasSize()');
    
})();

// 快速使用命令：
// expandWaifuCanvas(400, 800)  // 设置画布为400x800
// expandWaifuCanvas(450, 900)  // 设置画布为450x900（更大）
// getCanvasInfo()              // 查看当前画布信息
// resetCanvasSize()            // 重置并重新应用
