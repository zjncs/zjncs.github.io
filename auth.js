// 博客认证系统
class BlogAuth {
    constructor() {
        this.sessionKey = 'blog_session';
        this.settingsKey = 'blog_auth_settings';
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15分钟
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24小时
        this.eventListenersSetup = false;

        // 异步初始化
        this.initializeAuth().catch(error => {
            console.error('认证系统初始化失败:', error);
        });
    }

    // 初始化认证系统
    async initializeAuth() {
        // 检查是否首次使用
        const settings = this.getAuthSettings();
        if (!settings.initialized) {
            await this.showFirstTimeSetup();
        }

        // 清理过期的锁定
        this.cleanupLockouts();

        // 设置事件监听器
        this.setupEventListeners();
    }

    // 获取认证设置
    getAuthSettings() {
        const settings = localStorage.getItem(this.settingsKey);
        if (settings) {
            try {
                return JSON.parse(settings);
            } catch (error) {
                console.error('解析认证设置失败:', error);
            }
        }
        
        return {
            initialized: false,
            username: '',
            passwordHash: '',
            salt: '',
            lockouts: {},
            securityQuestions: []
        };
    }

    // 保存认证设置
    saveAuthSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    // 首次设置
    async showFirstTimeSetup() {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;

            const username = prompt('首次使用，请设置管理员用户名:');
            if (!username) {
                if (attempts >= maxAttempts) {
                    alert('设置已取消，请刷新页面重试');
                    return;
                }
                alert('用户名不能为空');
                continue;
            }

            const password = prompt('请设置管理员密码（至少8位，包含字母和数字）:');
            if (!this.validatePassword(password)) {
                if (attempts >= maxAttempts) {
                    alert('设置已取消，请刷新页面重试');
                    return;
                }
                alert('密码强度不够！请使用至少8位字符，包含字母和数字');
                continue;
            }

            const confirmPassword = prompt('请确认密码:');
            if (password !== confirmPassword) {
                if (attempts >= maxAttempts) {
                    alert('设置已取消，请刷新页面重试');
                    return;
                }
                alert('两次输入的密码不一致');
                continue;
            }

            try {
                // 生成盐值和密码哈希
                const salt = this.generateSalt();
                const passwordHash = await this.hashPassword(password, salt);

                const settings = {
                    initialized: true,
                    username: username,
                    passwordHash: passwordHash,
                    salt: salt,
                    lockouts: {},
                    securityQuestions: []
                };

                this.saveAuthSettings(settings);
                alert('管理员账户设置成功！请刷新页面后登录。');

                // 刷新页面以重新初始化
                window.location.reload();
                return;
            } catch (error) {
                console.error('设置账户失败:', error);
                alert('设置账户失败，请重试');
                continue;
            }
        }

        alert('设置失败次数过多，请刷新页面重试');
    }

    // 验证密码强度
    validatePassword(password) {
        if (!password || password.length < 8) return false;
        
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return hasLetter && hasNumber;
    }

    // 生成盐值
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 密码哈希
    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 检查是否被锁定
    isLockedOut() {
        const settings = this.getAuthSettings();
        const clientIP = 'local'; // 本地存储，使用固定标识
        const lockout = settings.lockouts[clientIP];
        
        if (!lockout) return false;
        
        const now = Date.now();
        if (lockout.attempts >= this.maxAttempts && (now - lockout.lastAttempt) < this.lockoutTime) {
            return true;
        }
        
        return false;
    }

    // 记录登录尝试
    recordAttempt(success) {
        const settings = this.getAuthSettings();
        const clientIP = 'local';
        
        if (!settings.lockouts[clientIP]) {
            settings.lockouts[clientIP] = { attempts: 0, lastAttempt: 0 };
        }
        
        if (success) {
            // 成功登录，清除尝试记录
            delete settings.lockouts[clientIP];
        } else {
            // 失败登录，增加尝试次数
            settings.lockouts[clientIP].attempts++;
            settings.lockouts[clientIP].lastAttempt = Date.now();
        }
        
        this.saveAuthSettings(settings);
    }

    // 清理过期锁定
    cleanupLockouts() {
        const settings = this.getAuthSettings();
        const now = Date.now();
        
        Object.keys(settings.lockouts).forEach(ip => {
            const lockout = settings.lockouts[ip];
            if ((now - lockout.lastAttempt) >= this.lockoutTime) {
                delete settings.lockouts[ip];
            }
        });
        
        this.saveAuthSettings(settings);
    }

    // 登录验证
    async login(username, password, remember = false) {
        // 检查是否被锁定
        if (this.isLockedOut()) {
            const remainingTime = Math.ceil((this.lockoutTime - (Date.now() - this.getLastAttemptTime())) / 60000);
            throw new Error(`账户已被锁定，请 ${remainingTime} 分钟后再试`);
        }

        const settings = this.getAuthSettings();
        
        // 验证用户名
        if (username !== settings.username) {
            this.recordAttempt(false);
            throw new Error('用户名或密码错误');
        }

        // 验证密码
        const passwordHash = await this.hashPassword(password, settings.salt);
        if (passwordHash !== settings.passwordHash) {
            this.recordAttempt(false);
            throw new Error('用户名或密码错误');
        }

        // 登录成功
        this.recordAttempt(true);
        
        const session = {
            username: username,
            loginTime: Date.now(),
            remember: remember,
            expires: remember ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + this.sessionTimeout
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return true;
    }

    // 检查登录状态
    isLoggedIn() {
        const session = this.getSession();
        if (!session) return false;
        
        const now = Date.now();
        if (now > session.expires) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // 获取会话信息
    getSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (error) {
                console.error('解析会话数据失败:', error);
                this.logout();
            }
        }
        return null;
    }

    // 登出
    logout() {
        localStorage.removeItem(this.sessionKey);
    }

    // 获取最后尝试时间
    getLastAttemptTime() {
        const settings = this.getAuthSettings();
        const lockout = settings.lockouts['local'];
        return lockout ? lockout.lastAttempt : 0;
    }

    // 显示消息
    showMessage(message, type = 'info') {
        const messageElement = document.getElementById(type === 'error' ? 'error-message' : 'success-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 防止重复绑定
        if (this.eventListenersSetup) {
            return;
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            // 移除可能存在的监听器
            loginForm.removeEventListener('submit', this.handleLogin.bind(this));
            // 绑定新的监听器
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        this.eventListenersSetup = true;
    }

    // 处理登录表单提交
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember-me').checked;
        const loginBtn = document.getElementById('login-btn');
        
        // 基本验证
        if (!username || !password) {
            this.showMessage('请输入用户名和密码', 'error');
            return;
        }

        // 显示加载状态
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            await this.login(username, password, remember);
            this.showMessage('登录成功！', 'success');

            // 显示跳转选项而不是自动跳转
            const successPrompt = document.createElement('div');
            successPrompt.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4CAF50;
                color: white;
                padding: 30px;
                border-radius: 10px;
                z-index: 10000;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            `;
            successPrompt.innerHTML = `
                <h3>✅ 登录成功！</h3>
                <p style="margin: 15px 0;">选择您要进入的页面：</p>
                <button onclick="window.location.href='admin.html'" style="padding: 10px 20px; margin: 5px; background: white; color: #4CAF50; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">管理后台</button>
                <button onclick="window.location.href='admin-safe.html'" style="padding: 10px 20px; margin: 5px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">安全模式</button>
                <button onclick="window.location.href='index.html'" style="padding: 10px 20px; margin: 5px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">返回首页</button>
                <br>
                <button onclick="this.remove()" style="padding: 5px 15px; margin-top: 10px; background: transparent; color: white; border: 1px solid white; border-radius: 5px; cursor: pointer;">留在此页</button>
            `;
            document.body.appendChild(successPrompt);
            
        } catch (error) {
            this.showMessage(error.message, 'error');
            
            // 添加错误样式
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            usernameInput.classList.add('error');
            passwordInput.classList.add('error');
            
            // 清除错误样式
            setTimeout(() => {
                usernameInput.classList.remove('error');
                passwordInput.classList.remove('error');
            }, 3000);
            
        } finally {
            // 恢复按钮状态
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // 重置密码（安全问题验证）
    resetPassword() {
        // 跳转到密码重置页面
        window.location.href = 'reset-password.html';
    }
}

// 工具函数
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showForgotPassword() {
    if (blogAuth) {
        blogAuth.resetPassword();
    }
}

// 初始化认证系统
let blogAuth;

document.addEventListener('DOMContentLoaded', function() {
    try {
        blogAuth = new BlogAuth();

        // 检查是否已经登录（不自动跳转，避免循环）
        if (blogAuth.isLoggedIn()) {
            // 显示已登录提示而不是自动跳转
            const loginStatus = document.createElement('div');
            loginStatus.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 1000;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            loginStatus.innerHTML = `
                ✅ 您已登录
                <button onclick="window.location.href='admin.html'" style="margin-left: 10px; padding: 5px 10px; background: white; color: #4CAF50; border: none; border-radius: 4px; cursor: pointer;">进入后台</button>
                <button onclick="this.parentElement.remove()" style="margin-left: 5px; padding: 5px 10px; background: transparent; color: white; border: 1px solid white; border-radius: 4px; cursor: pointer;">×</button>
            `;
            document.body.appendChild(loginStatus);

            // 5秒后自动隐藏提示
            setTimeout(() => {
                if (loginStatus.parentNode) {
                    loginStatus.parentNode.removeChild(loginStatus);
                }
            }, 5000);
        }
    } catch (error) {
        console.error('认证系统初始化失败:', error);
        // 如果认证系统有问题，显示错误提示
        const errorStatus = document.createElement('div');
        errorStatus.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorStatus.innerHTML = `
            ⚠️ 认证系统错误
            <button onclick="window.location.href='admin-safe.html'" style="margin-left: 10px; padding: 5px 10px; background: white; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">安全模式</button>
            <button onclick="this.parentElement.remove()" style="margin-left: 5px; padding: 5px 10px; background: transparent; color: white; border: 1px solid white; border-radius: 4px; cursor: pointer;">×</button>
        `;
        document.body.appendChild(errorStatus);
    }
});

// 导出认证类供其他页面使用
window.BlogAuth = BlogAuth;
