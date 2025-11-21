/* Advanced Interaction Script
   Focus: Usability & Aesthetics
*/
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Academic Glass OS Loaded');

    // 1. Mac 风格代码块红黄绿点 (如果主题没有自动生成)
    const addMacButtons = () => {
        const tools = document.querySelectorAll('.highlight-tools');
        tools.forEach(tool => {
            if (!tool.querySelector('.mac-dots')) {
                const dots = document.createElement('div');
                dots.className = 'mac-dots';
                dots.style.cssText = 'display:flex; gap:6px; margin-left:12px; margin-right:auto;';
                dots.innerHTML = `
                    <div style="width:11px;height:11px;border-radius:50%;background:#ff5f56;"></div>
                    <div style="width:11px;height:11px;border-radius:50%;background:#ffbd2e;"></div>
                    <div style="width:11px;height:11px;border-radius:50%;background:#27c93f;"></div>
                `;
                // 插入到最前面
                tool.insertBefore(dots, tool.firstChild);
            }
        });
    };
    addMacButtons();

    // 2. 外部链接安全处理
    const secureLinks = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.hostname !== window.location.hostname && link.hostname !== '') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    };
    secureLinks();

    // 3. 简单的动态标题 (可选)
    let originTitle = document.title;
    let titleTimer;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = '👀 Waiting for you...';
            clearTimeout(titleTimer);
        } else {
            document.title = '⚡️ Welcome Back!';
            titleTimer = setTimeout(() => {
                document.title = originTitle;
            }, 2000);
        }
    });
});