// 交互式代码块功能
class CodeCopyManager {
    constructor() {
        this.init();
    }

    init() {
        // 等待DOM加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCodeBlocks());
        } else {
            this.setupCodeBlocks();
        }

        // 监听动态内容变化（如搜索结果、文章切换等）
        this.observeContentChanges();
    }

    setupCodeBlocks() {
        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('pre code, .highlight pre, .highlighter-rouge pre');
        
        codeBlocks.forEach((codeBlock, index) => {
            this.enhanceCodeBlock(codeBlock, index);
        });
    }

    enhanceCodeBlock(codeBlock, index) {
        const pre = codeBlock.closest('pre');
        if (!pre || pre.querySelector('.code-header')) {
            return; // 已经处理过或找不到pre元素
        }

        // 创建代码块容器
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';
        
        // 创建代码头部
        const codeHeader = document.createElement('div');
        codeHeader.className = 'code-header';
        
        // 检测编程语言
        const language = this.detectLanguage(codeBlock);
        
        // 创建语言标识
        const languageLabel = document.createElement('span');
        languageLabel.className = 'code-language';
        languageLabel.textContent = language;
        
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i><span>复制</span>';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.setAttribute('data-code-index', index);
        
        // 绑定复制事件
        copyButton.addEventListener('click', (e) => this.handleCopyClick(e, codeBlock));
        
        // 组装头部
        codeHeader.appendChild(languageLabel);
        codeHeader.appendChild(copyButton);
        
        // 包装原有的pre元素
        pre.parentNode.insertBefore(codeContainer, pre);
        codeContainer.appendChild(codeHeader);
        codeContainer.appendChild(pre);
        
        // 添加行号（可选）
        if (this.shouldShowLineNumbers(codeBlock)) {
            this.addLineNumbers(pre, codeBlock);
        }
        
        // 添加代码块样式类
        codeContainer.classList.add(`language-${language.toLowerCase()}`);
    }

    detectLanguage(codeBlock) {
        // 从类名中检测语言
        const classList = Array.from(codeBlock.classList);
        
        // 检查常见的语言类名模式
        for (const className of classList) {
            if (className.startsWith('language-')) {
                return className.replace('language-', '').toUpperCase();
            }
            if (className.startsWith('lang-')) {
                return className.replace('lang-', '').toUpperCase();
            }
        }
        
        // 检查父元素的类名
        const pre = codeBlock.closest('pre');
        if (pre) {
            const preClassList = Array.from(pre.classList);
            for (const className of preClassList) {
                if (className.startsWith('language-')) {
                    return className.replace('language-', '').toUpperCase();
                }
            }
        }
        
        // 尝试从代码内容推断语言
        const code = codeBlock.textContent || codeBlock.innerText;
        return this.inferLanguageFromContent(code);
    }

    inferLanguageFromContent(code) {
        const trimmedCode = code.trim();
        
        // JavaScript/TypeScript
        if (/^(import|export|const|let|var|function|class|\{|\[)/.test(trimmedCode) ||
            /console\.log|document\.|window\./.test(trimmedCode)) {
            return 'JavaScript';
        }
        
        // HTML
        if (/^<!DOCTYPE|^<html|^<\w+/.test(trimmedCode)) {
            return 'HTML';
        }
        
        // CSS
        if (/^[\w\-\.#].*\{|@media|@import/.test(trimmedCode)) {
            return 'CSS';
        }
        
        // Python
        if (/^(def|class|import|from|if __name__|print\(|#!)/.test(trimmedCode)) {
            return 'Python';
        }
        
        // Java
        if (/^(public|private|protected|class|interface|package|import)/.test(trimmedCode) ||
            /System\.out\.println/.test(trimmedCode)) {
            return 'Java';
        }
        
        // Shell/Bash
        if (/^(#!/bin/bash|#!/bin/sh|\$|#)/.test(trimmedCode) ||
            /^(ls|cd|mkdir|rm|cp|mv|grep|awk|sed)/.test(trimmedCode)) {
            return 'Shell';
        }
        
        // JSON
        if (/^\{.*\}$|^\[.*\]$/s.test(trimmedCode)) {
            try {
                JSON.parse(trimmedCode);
                return 'JSON';
            } catch (e) {
                // 不是有效的JSON
            }
        }
        
        return 'Code';
    }

    shouldShowLineNumbers(codeBlock) {
        const code = codeBlock.textContent || codeBlock.innerText;
        const lines = code.split('\n').length;
        
        // 超过5行的代码显示行号
        return lines > 5;
    }

    addLineNumbers(pre, codeBlock) {
        const code = codeBlock.textContent || codeBlock.innerText;
        const lines = code.split('\n');
        
        // 创建行号容器
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'code-line-numbers';
        
        // 生成行号
        for (let i = 1; i <= lines.length; i++) {
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            lineNumbers.appendChild(lineNumber);
        }
        
        // 添加到pre元素
        pre.classList.add('has-line-numbers');
        pre.insertBefore(lineNumbers, codeBlock);
    }

    async handleCopyClick(event, codeBlock) {
        const button = event.currentTarget;
        const originalContent = button.innerHTML;
        
        try {
            // 获取代码内容
            const code = this.getCleanCodeContent(codeBlock);
            
            // 复制到剪贴板
            await navigator.clipboard.writeText(code);
            
            // 显示成功状态
            button.innerHTML = '<i class="fas fa-check"></i><span>已复制</span>';
            button.classList.add('copied');
            
            // 触发成功动画
            this.showCopySuccess(button);
            
            // 2秒后恢复原状
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (error) {
            console.error('复制失败:', error);
            
            // 显示错误状态
            button.innerHTML = '<i class="fas fa-times"></i><span>复制失败</span>';
            button.classList.add('error');
            
            // 2秒后恢复原状
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('error');
            }, 2000);
            
            // 降级处理：选择文本
            this.fallbackCopyMethod(codeBlock);
        }
    }

    getCleanCodeContent(codeBlock) {
        // 克隆节点以避免修改原始内容
        const clone = codeBlock.cloneNode(true);
        
        // 移除行号等辅助元素
        const lineNumbers = clone.querySelectorAll('.line-number');
        lineNumbers.forEach(el => el.remove());
        
        // 获取纯文本内容
        return clone.textContent || clone.innerText || '';
    }

    fallbackCopyMethod(codeBlock) {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = this.getCleanCodeContent(codeBlock);
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // 选择并复制
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('使用降级方法复制成功');
        } catch (err) {
            console.error('降级复制方法也失败了:', err);
        }
        
        // 清理
        document.body.removeChild(textArea);
    }

    showCopySuccess(button) {
        // 创建成功提示动画
        const ripple = document.createElement('div');
        ripple.className = 'copy-ripple';
        button.appendChild(ripple);
        
        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    observeContentChanges() {
        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            let shouldReinitialize = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查是否有新的代码块添加
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasCodeBlocks = node.querySelectorAll && 
                                node.querySelectorAll('pre code, .highlight pre, .highlighter-rouge pre').length > 0;
                            if (hasCodeBlocks) {
                                shouldReinitialize = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReinitialize) {
                // 延迟重新初始化，避免频繁调用
                setTimeout(() => this.setupCodeBlocks(), 100);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 自动初始化
const codeCopyManager = new CodeCopyManager();

// 导出供其他模块使用
window.CodeCopyManager = CodeCopyManager;