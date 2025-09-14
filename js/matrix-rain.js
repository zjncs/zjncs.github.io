/**
 * Matrix 代码雨效果
 * 文件路径: /source/js/matrix-rain.js
 */

class MatrixRain {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.drops = [];
    this.chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?`~';
    this.fontSize = 14;
    this.isActive = false;
    
    this.init();
  }

  init() {
    // 检查是否在移动设备上
    if (window.innerWidth < 768) {
      return; // 移动设备不显示
    }

    this.createCanvas();
    this.setupDrops();
    this.bindEvents();
    this.start();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'matrix-rain';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.1;
      pointer-events: none;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(columns).fill(1);
  }

  setupDrops() {
    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(columns).fill(1);
  }

  draw() {
    // 清除画布，使用半透明黑色产生拖尾效果
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 设置字符颜色
    this.ctx.fillStyle = '#00ff7f';
    this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      // 随机选择字符
      const text = this.chars[Math.floor(Math.random() * this.chars.length)];
      
      // 绘制字符
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      this.ctx.fillText(text, x, y);
      
      // 重置drop位置
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
  }

  animate() {
    if (!this.isActive) return;
    
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  start() {
    this.isActive = true;
    this.animate();
  }

  stop() {
    this.isActive = false;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.setupDrops();
    });

    // 页面可见性API，优化性能
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }
}

// 初始化Matrix雨效果
document.addEventListener('DOMContentLoaded', () => {
  // 延迟启动以确保页面加载完成
  setTimeout(() => {
    new MatrixRain();
  }, 1000);
});

// 添加控制台欢迎信息
console.log(`
%c╔══════════════════════════════════════╗
║     Welcome to the Matrix            ║
║     现代极客博客系统已启动             ║
║     System Status: Online           ║
║     Author: Johnny-Zhao            ║
╚══════════════════════════════════════╝`, 
'color: #00ff7f; font-family: "JetBrains Mono", monospace; font-size: 12px;'
);

console.log('%cconst blog = new GeekBlog();', 'color: #00ff7f; font-weight: bold;');
console.log('%cblog.init();', 'color: #00ff7f; font-weight: bold;');
console.log('%c// Ready to explore the digital world', 'color: #666; font-style: italic;');