// 动态视觉背景控制系统
// 支持多种背景效果：粒子、星空、几何图形等

class DynamicBackground {
    constructor(options = {}) {
        this.options = {
            type: 'particles', // particles, stars, geometry, waves
            particleCount: 80,
            connectionDistance: 120,
            mouseInteraction: true,
            colors: [
                'rgba(102, 126, 234, 0.6)',
                'rgba(118, 75, 162, 0.6)',
                'rgba(45, 90, 135, 0.6)',
                'rgba(212, 165, 116, 0.6)',
                'rgba(107, 142, 90, 0.6)'
            ],
            ...options
        };
        
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createElements();
        this.bindEvents();
        this.animate();
        
        console.log(`✨ 动态背景已启动 - 类型: ${this.options.type}`);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createElements() {
        switch (this.options.type) {
            case 'particles':
                this.createParticles();
                break;
            case 'stars':
                this.createStars();
                break;
            case 'geometry':
                this.createGeometry();
                break;
            case 'waves':
                this.createWaves();
                break;
            default:
                this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.min(this.options.particleCount, Math.floor(window.innerWidth / 12));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.01 + Math.random() * 0.02
            });
        }
    }
    
    createStars() {
        this.particles = [];
        const count = Math.min(150, Math.floor(window.innerWidth / 8));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: 0.01 + Math.random() * 0.02,
                twinkle: Math.random() * Math.PI * 2,
                color: 'rgba(255, 255, 255, 0.8)'
            });
        }
    }
    
    createGeometry() {
        this.particles = [];
        const count = Math.min(20, Math.floor(window.innerWidth / 60));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 40 + 20,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.3 + 0.1,
                color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                shape: Math.floor(Math.random() * 3) // 0: triangle, 1: square, 2: hexagon
            });
        }
    }
    
    createWaves() {
        this.waveParams = {
            amplitude: 50,
            frequency: 0.02,
            speed: 0.01,
            layers: 3
        };
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createElements();
        });
        
        if (this.options.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }
    }
    
    update() {
        this.time += 0.01;
        
        switch (this.options.type) {
            case 'particles':
                this.updateParticles();
                break;
            case 'stars':
                this.updateStars();
                break;
            case 'geometry':
                this.updateGeometry();
                break;
            case 'waves':
                this.updateWaves();
                break;
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // 基础移动
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 鼠标交互
            if (this.options.mouseInteraction) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx += (dx / distance) * force * 0.008;
                    particle.vy += (dy / distance) * force * 0.008;
                }
            }
            
            // 脉动效果
            particle.pulse += particle.pulseSpeed;
            particle.opacity = 0.2 + Math.sin(particle.pulse) * 0.4;
            
            // 边界处理
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // 速度衰减
            particle.vx *= 0.995;
            particle.vy *= 0.995;
        });
    }
    
    updateStars() {
        this.particles.forEach(star => {
            star.twinkle += star.twinkleSpeed;
            star.opacity = 0.3 + Math.sin(star.twinkle) * 0.5;
        });
    }
    
    updateGeometry() {
        this.particles.forEach(shape => {
            shape.rotation += shape.rotationSpeed;
        });
    }
    
    updateWaves() {
        // 波浪效果在绘制时计算
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.options.type) {
            case 'particles':
                this.drawParticles();
                break;
            case 'stars':
                this.drawStars();
                break;
            case 'geometry':
                this.drawGeometry();
                break;
            case 'waves':
                this.drawWaves();
                break;
        }
    }
    
    drawParticles() {
        // 绘制连接线
        this.drawConnections();
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (this.options.connectionDistance - distance) / this.options.connectionDistance * 0.3;
                    this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.4)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    drawStars() {
        this.particles.forEach(star => {
            this.ctx.save();
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = star.color;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 星光效果
            if (star.opacity > 0.6) {
                this.ctx.strokeStyle = star.color;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(star.x - star.size * 2, star.y);
                this.ctx.lineTo(star.x + star.size * 2, star.y);
                this.ctx.moveTo(star.x, star.y - star.size * 2);
                this.ctx.lineTo(star.x, star.y + star.size * 2);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        });
    }
    
    drawGeometry() {
        this.particles.forEach(shape => {
            this.ctx.save();
            this.ctx.globalAlpha = shape.opacity;
            this.ctx.strokeStyle = shape.color;
            this.ctx.lineWidth = 2;
            this.ctx.translate(shape.x, shape.y);
            this.ctx.rotate(shape.rotation);
            
            this.ctx.beginPath();
            
            switch (shape.shape) {
                case 0: // Triangle
                    this.ctx.moveTo(0, -shape.size / 2);
                    this.ctx.lineTo(-shape.size / 2, shape.size / 2);
                    this.ctx.lineTo(shape.size / 2, shape.size / 2);
                    this.ctx.closePath();
                    break;
                case 1: // Square
                    this.ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                    break;
                case 2: // Hexagon
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI) / 3;
                        const x = Math.cos(angle) * shape.size / 2;
                        const y = Math.sin(angle) * shape.size / 2;
                        if (i === 0) this.ctx.moveTo(x, y);
                        else this.ctx.lineTo(x, y);
                    }
                    this.ctx.closePath();
                    break;
            }
            
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    drawWaves() {
        const { amplitude, frequency, speed, layers } = this.waveParams;
        
        for (let layer = 0; layer < layers; layer++) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.1 + layer * 0.05;
            this.ctx.strokeStyle = this.options.colors[layer % this.options.colors.length];
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = this.canvas.height / 2 + 
                         Math.sin(x * frequency + this.time * speed + layer) * amplitude +
                         Math.sin(x * frequency * 2 + this.time * speed * 1.5 + layer) * amplitude / 2;
                
                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
    
    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // 切换背景类型
    switchType(type) {
        this.options.type = type;
        this.createElements();
        console.log(`🔄 背景类型已切换为: ${type}`);
    }
    
    // 调整粒子数量
    setParticleCount(count) {
        this.options.particleCount = count;
        this.createElements();
    }
    
    // 切换鼠标交互
    toggleMouseInteraction() {
        this.options.mouseInteraction = !this.options.mouseInteraction;
        console.log(`🖱️ 鼠标交互: ${this.options.mouseInteraction ? '开启' : '关闭'}`);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.handleMouseMove);
    }
}

// 导出供全局使用
window.DynamicBackground = DynamicBackground;

// 使用示例：
// const bg = new DynamicBackground({ type: 'particles', particleCount: 100 });
// bg.switchType('stars');
// bg.toggleMouseInteraction();
