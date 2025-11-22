/**
 * 极客风格增强脚本
 * 文件路径: /source/js/geek-enhancements.js
 */

class GeekEnhancements {
  constructor() {
    const styles = getComputedStyle(document.documentElement);
    this.colors = {
      accent: (styles.getPropertyValue('--primary-color') || '#00eaff').trim(),
      glow: (styles.getPropertyValue('--secondary-color') || '#ff3cac').trim(),
      dim: '#8a92a6'
    };
    this.init();
  }

  init() {
    this.addTerminalCursor();
    this.enhanceCodeBlocks();
    this.addTypingEffect();
    this.addGlowEffects();
    this.customizeScrollbar();
    this.addKeyboardSounds();
    this.enhanceNavigation();
  }

  // 添加终端光标效果
  addTerminalCursor() {
    const titles = document.querySelectorAll('.post-title, .card-title');
    titles.forEach(title => {
      if (Math.random() > 0.7) { // 随机添加光标
        title.classList.add('terminal-cursor');
      }
    });
  }

  // 增强代码块
  enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code, .highlight code');
    
    codeBlocks.forEach((block, index) => {
      // 添加代码块标题
      const pre = block.closest('pre') || block.closest('.highlight');
      if (pre && !pre.querySelector('.code-header')) {
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
          <span class="code-title">
            <i class="fas fa-terminal"></i> 
            ${this.getLanguageFromClass(block) || 'code'}
          </span>
          <div class="code-actions">
            <span class="code-line-count">${block.textContent.split('\n').length - 1} lines</span>
            <button class="copy-btn" title="Copy to clipboard">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        `;
        
        header.style.cssText = `
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 8px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: ${this.colors.accent};
          border-radius: 8px 8px 0 0;
        `;
        
        pre.insertBefore(header, pre.firstChild);
        
        // 复制功能
        const copyBtn = header.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(block.textContent).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1000);
          });
        });
      }
    });
  }

  // 获取代码语言
  getLanguageFromClass(element) {
    const classList = element.className;
    const langMatch = classList.match(/language-(\w+)/);
    return langMatch ? langMatch[1] : null;
  }

  // 打字机效果增强
  addTypingEffect() {
    const typewriterElements = document.querySelectorAll('.typed-text, .subtitle');
    
    typewriterElements.forEach(element => {
      element.addEventListener('animationend', () => {
        element.style.borderRight = `2px solid ${this.colors.accent}`;
        element.style.animation = 'blink 1s infinite';
      });
    });
  }

  // 添加发光效果
  addGlowEffects() {
    // 为链接添加发光效果
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.textShadow = `0 0 10px ${this.colors.accent}`;
        link.style.transition = 'all 0.3s ease';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.textShadow = 'none';
      });
    });

    // 为按钮添加发光效果
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.boxShadow = `0 0 20px ${this.hexToRgba(this.colors.accent, 0.25)}`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.boxShadow = 'none';
      });
    });
  }

  // 自定义滚动条增强
  customizeScrollbar() {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar-thumb:hover {
        box-shadow: inset 0 0 5px ${this.hexToRgba(this.colors.accent, 0.35)};
      }
    `;
    document.head.appendChild(style);
  }

  // 键盘音效（可选）
  addKeyboardSounds() {
    if (localStorage.getItem('keyboard-sounds') === 'enabled') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          this.playTypingSound(audioContext);
        }
      });
    }
  }

  playTypingSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800 + Math.random() * 200;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // 导航增强
  enhanceNavigation() {
    const nav = document.querySelector('#nav');
    if (nav) {
      // 添加命令行风格的导航提示
      const navItems = nav.querySelectorAll('a');
      navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
          item.setAttribute('data-tooltip', `> ${item.textContent.trim()}`);
        });
      });
    }
  }

  // 添加系统状态指示器
  addSystemStatus() {
    const statusBar = document.createElement('div');
    statusBar.id = 'system-status';
    statusBar.innerHTML = `
      <div class="status-item">
        <span class="status-dot online"></span>
        <span>System Online</span>
      </div>
      <div class="status-item">
        <span>Uptime: ${this.getUptime()}</span>
      </div>
      <div class="status-item">
        <span id="current-time">${new Date().toLocaleTimeString()}</span>
      </div>
    `;
    
    statusBar.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(26, 26, 26, 0.9);
      border: 1px solid #333;
      border-radius: 4px;
      padding: 8px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: ${this.colors.dim};
      display: flex;
      gap: 15px;
      z-index: 1000;
    `;
    
    document.body.appendChild(statusBar);
    
    // 更新时间
    setInterval(() => {
      const timeElement = statusBar.querySelector('#current-time');
      if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
      }
    }, 1000);
  }

  getUptime() {
    const startTime = localStorage.getItem('session-start') || Date.now();
    const uptime = Date.now() - startTime;
    const minutes = Math.floor(uptime / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  // 添加命令行模拟器
  addCommandLine() {
    // 监听特殊按键组合
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.altKey && e.key === 't') {
        this.openTerminal();
        e.preventDefault();
      }
    });
  }

  openTerminal() {
    const terminal = document.createElement('div');
    terminal.id = 'terminal-overlay';
    terminal.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-header">
          <span>Terminal</span>
          <button class="terminal-close">&times;</button>
        </div>
        <div class="terminal-body">
          <div class="terminal-output">
            <div>Welcome to Geek Terminal v1.0</div>
            <div>Type 'help' for available commands</div>
          </div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">guest@geekblog:~$ </span>
            <input type="text" class="terminal-input" autofocus>
          </div>
        </div>
      </div>
    `;
    
    terminal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    document.body.appendChild(terminal);
    
    // 终端功能实现
    this.initTerminalCommands(terminal);
  }

  initTerminalCommands(terminal) {
    const input = terminal.querySelector('.terminal-input');
    const output = terminal.querySelector('.terminal-output');
    const closeBtn = terminal.querySelector('.terminal-close');
    
    const commands = {
      help: () => 'Available commands: help, clear, date, about, theme, exit',
      clear: () => { output.innerHTML = ''; return ''; },
      date: () => new Date().toString(),
      about: () => 'Johnny-Zhao\'s Tech Blog - Modern Geek Theme',
      theme: () => 'Current theme: Dark Geek Mode',
      exit: () => { terminal.remove(); return ''; }
    };
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = input.value.trim();
        const result = commands[command] || `Command not found: ${command}`;
        
        output.innerHTML += `<div><span class="terminal-prompt">guest@geekblog:~$ </span>${command}</div>`;
        if (result) output.innerHTML += `<div>${result}</div>`;
        
        input.value = '';
        output.scrollTop = output.scrollHeight;
      }
    });
    
    closeBtn.addEventListener('click', () => terminal.remove());
    terminal.addEventListener('click', (e) => {
      if (e.target === terminal) terminal.remove();
    });
  }

  // Utility: convert hex to rgba with opacity
  hexToRgba(hex, alpha) {
    const sanitized = hex.replace('#', '');
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 设置会话开始时间
  if (!localStorage.getItem('session-start')) {
    localStorage.setItem('session-start', Date.now());
  }
  
  // 初始化极客增强功能
  new GeekEnhancements();
});

// Konami Code 彩蛋
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.toString() === konamiSequence.toString()) {
    console.log('%cKonami Code Activated! 🎮', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 3000);
    konamiCode = [];
  }
});

// 性能监控
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      console.log(`%cPage Load Time: ${loadTime}ms`, 'color: #00eaff;');
    }, 0);
  });
}
