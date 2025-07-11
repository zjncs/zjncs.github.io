// Service Worker 注册脚本
// 提供离线支持和性能优化

(function() {
  'use strict';

  // 检查浏览器支持
  if ('serviceWorker' in navigator) {
    // 等待页面加载完成
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  } else {
    console.log('Service Worker 不受支持');
  }

  // 注册 Service Worker
  function registerServiceWorker() {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 注册成功，作用域: ', registration.scope);
        
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker 更新中...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker 注册失败: ', error);
      });
  }

  // 显示更新通知
  function showUpdateNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="sw-update-content">
        <span>🔄 博客有新内容可用</span>
        <button class="sw-update-button">立即更新</button>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .sw-update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
      }
      
      .sw-update-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .sw-update-button {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      }
      
      .sw-update-button:hover {
        background: #357abd;
      }
      
      @keyframes slideIn {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 添加更新按钮事件
    const updateButton = notification.querySelector('.sw-update-button');
    updateButton.addEventListener('click', () => {
      // 刷新页面以应用更新
      window.location.reload();
    });
  }

  // 添加离线/在线状态监听
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // 更新在线状态
  function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    
    // 如果已经有通知，则移除
    const existingNotification = document.querySelector('.connection-status-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // 如果离线，显示通知
    if (!isOnline) {
      showConnectionNotification(false);
    } else {
      // 如果从离线恢复到在线，显示恢复通知
      if (document.documentElement.hasAttribute('data-was-offline')) {
        showConnectionNotification(true);
        document.documentElement.removeAttribute('data-was-offline');
      }
    }
    
    // 记录离线状态
    if (!isOnline) {
      document.documentElement.setAttribute('data-was-offline', 'true');
    }
  }
  
  // 显示连接状态通知
  function showConnectionNotification(isOnline) {
    const notification = document.createElement('div');
    notification.className = 'connection-status-notification';
    
    if (isOnline) {
      notification.innerHTML = `<div class="connection-status-content">✅ 网络已恢复</div>`;
      notification.style.backgroundColor = '#28a745';
    } else {
      notification.innerHTML = `<div class="connection-status-content">⚠️ 网络连接已断开，正在使用离线缓存</div>`;
      notification.style.backgroundColor = '#dc3545';
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .connection-status-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        animation: fadeIn 0.3s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 自动移除通知
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out forwards';
      
      style.textContent += `
        @keyframes fadeOut {
          from { opacity: 1; transform: translate(-50%, 0); }
          to { opacity: 0; transform: translate(-50%, -20px); }
        }
      `;
      
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // 初始检查在线状态
  updateOnlineStatus();
})();
