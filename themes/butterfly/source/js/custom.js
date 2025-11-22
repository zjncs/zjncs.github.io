/* ==========================================================================
   Script: Academic OS Interaction
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Academic OS v6.0 Loaded');

    // 1. 注入 Mac 风格代码块按钮 (红黄绿)
    const addMacButtons = () => {
        const tools = document.querySelectorAll('.highlight-tools');
        tools.forEach(tool => {
            if (!tool.querySelector('.mac-dots')) {
                const dots = document.createElement('div');
                dots.className = 'mac-dots';
                dots.style.cssText = `
                    display: flex; 
                    gap: 6px; 
                    margin-left: 12px; 
                    margin-right: 10px;
                    align-items: center;
                `;
                dots.innerHTML = `
                    <div style="width:11px;height:11px;border-radius:50%;background:#ff5f56;box-shadow:0 0 4px rgba(255,95,86,0.3);"></div>
                    <div style="width:11px;height:11px;border-radius:50%;background:#ffbd2e;box-shadow:0 0 4px rgba(255,189,46,0.3);"></div>
                    <div style="width:11px;height:11px;border-radius:50%;background:#27c93f;box-shadow:0 0 4px rgba(39,201,63,0.3);"></div>
                `;
                tool.insertBefore(dots, tool.firstChild);
                // 调整右侧按钮
                const expandBtn = tool.querySelector('.expand');
                if(expandBtn) expandBtn.style.marginLeft = 'auto';
            }
        });
    };
    
    // 2. 外部链接新标签页打开
    const secureLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname !== window.location.hostname && link.hostname !== '') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    };

    // 初始化与 PJAX 适配
    addMacButtons();
    secureLinks();
    document.addEventListener('pjax:complete', () => {
        addMacButtons();
        secureLinks();
    });
});