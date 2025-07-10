// 一键修复布局问题脚本
// 修复Markdown编辑器和看板娘头部显示问题

(function() {
    'use strict';
    
    console.log('🔧 开始修复布局问题...');
    
    // 修复Markdown编辑器布局
    function fixMarkdownEditor() {
        console.log('📝 修复Markdown编辑器布局...');
        
        // 查找编辑器元素
        const editor = document.getElementById('post-content');
        const previewContainer = document.querySelector('.preview-container');
        const previewPanels = document.querySelectorAll('.preview-panel');
        
        if (editor) {
            // 确保编辑器占满容器
            editor.style.cssText += `
                width: 100% !important;
                box-sizing: border-box !important;
                min-height: 400px !important;
                resize: vertical !important;
            `;
            console.log('✅ Markdown编辑器样式已修复');
        }
        
        if (previewContainer) {
            // 确保预览容器布局正确
            previewContainer.style.cssText += `
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 20px !important;
                width: 100% !important;
                box-sizing: border-box !important;
            `;
            console.log('✅ 预览容器布局已修复');
        }
        
        previewPanels.forEach((panel, index) => {
            panel.style.cssText += `
                width: 100% !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
            `;
            
            const textarea = panel.querySelector('textarea');
            if (textarea) {
                textarea.style.cssText += `
                    width: 100% !important;
                    box-sizing: border-box !important;
                    border: none !important;
                    outline: none !important;
                `;
            }
        });
        
        console.log('✅ 预览面板样式已修复');
    }
    
    // 修复看板娘头部显示
    function fixWaifuHead() {
        console.log('🎭 修复看板娘头部显示...');
        
        const widget = document.getElementById('live2d-widget');
        const canvas = document.getElementById('live2dcanvas') || document.querySelector('#live2d-widget canvas');
        
        if (widget) {
            // 应用最强的头部修复
            widget.style.cssText += `
                position: fixed !important;
                top: -100px !important;
                right: -20px !important;
                bottom: auto !important;
                left: auto !important;
                z-index: 999 !important;
                pointer-events: none !important;
                overflow: visible !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 100px 20px 0 0 !important;
                transform: none !important;
                clip: none !important;
                clip-path: none !important;
            `;
            console.log('✅ 看板娘容器位置已修复');
        }
        
        if (canvas) {
            // 确保画布不被裁剪
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
            console.log('✅ 看板娘画布样式已修复');
        }
        
        // 响应式处理
        const screenWidth = window.innerWidth;
        if (screenWidth <= 768) {
            // 移动端特殊处理
            if (widget) {
                widget.style.cssText += `
                    top: auto !important;
                    bottom: 0 !important;
                    right: -30px !important;
                    transform: scale(0.6) !important;
                    transform-origin: bottom right !important;
                    padding: 0 30px 0 0 !important;
                `;
            }
            console.log('📱 应用移动端看板娘修复');
        }
    }
    
    // 显示修复结果
    function showFixResult() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10001;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        
        notification.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 16px; margin-bottom: 5px;">🎉 布局问题修复完成！</div>
                <div style="font-size: 12px; opacity: 0.9;">Markdown编辑器和看板娘头部已修复</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    notification.parentNode.removeChild(notification);
                }, 300);
            }
        }, 4000);
    }
    
    // 等待页面元素加载
    function waitAndFix() {
        let attempts = 0;
        const maxAttempts = 10;
        
        function tryFix() {
            attempts++;
            
            // 检查是否在管理页面
            const isAdminPage = window.location.pathname.includes('admin') || 
                               document.getElementById('post-content') !== null;
            
            if (isAdminPage) {
                fixMarkdownEditor();
            }
            
            // 检查看板娘是否存在
            const hasWaifu = document.getElementById('live2d-widget') !== null;
            
            if (hasWaifu) {
                fixWaifuHead();
            }
            
            if ((isAdminPage || hasWaifu) || attempts >= maxAttempts) {
                console.log('🎯 修复完成');
                showFixResult();
                return;
            }
            
            // 继续等待
            setTimeout(tryFix, 1000);
        }
        
        tryFix();
    }
    
    // 提供手动修复功能
    window.fixLayoutIssues = function() {
        console.log('🔧 手动执行布局修复');
        fixMarkdownEditor();
        fixWaifuHead();
        showFixResult();
    };
    
    window.fixMarkdownOnly = function() {
        console.log('📝 仅修复Markdown编辑器');
        fixMarkdownEditor();
        showNotification('Markdown编辑器已修复');
    };
    
    window.fixWaifuOnly = function() {
        console.log('🎭 仅修复看板娘');
        fixWaifuHead();
        showNotification('看板娘头部已修复');
    };
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 10001;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        setTimeout(() => {
            fixWaifuHead();
        }, 100);
    });
    
    // 开始修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(waitAndFix, 1000);
        });
    } else {
        setTimeout(waitAndFix, 1000);
    }
    
    console.log('🔧 布局修复脚本已加载');
    console.log('💡 手动修复: fixLayoutIssues()');
    console.log('💡 仅修复编辑器: fixMarkdownOnly()');
    console.log('💡 仅修复看板娘: fixWaifuOnly()');
    
})();

// 使用方法：
// 1. 在浏览器控制台运行此脚本
// 2. 或在HTML中引入：<script src="fix-layout-issues.js"></script>
// 3. 手动修复：fixLayoutIssues()
// 4. 单独修复：fixMarkdownOnly() 或 fixWaifuOnly()
