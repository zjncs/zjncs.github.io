// Service Worker - 现代缓存策略和离线支持
// 提升博客的加载性能和用户体验

const CACHE_NAME = 'mytechblog-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// 需要预缓存的关键资源
const PRECACHE_URLS = [
  '/',
  '/css/app.css',
  '/js/app.js',
  '/about/',
  '/offline.html' // 离线页面
];

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 静态资源：缓存优先
  static: [
    /\.(?:css|js|woff2?|ttf|eot)$/,
    /\/css\//,
    /\/js\//,
    /\/fonts\//
  ],
  
  // 图片：缓存优先，过期时间长
  images: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\/images\//,
    /unsplash\.com/,
    /sinaimg\.cn/
  ],
  
  // HTML 页面：网络优先，缓存备用
  pages: [
    /\.html$/,
    /\/$/,
    /\/[^.]*$/
  ]
};

// 安装事件 - 预缓存关键资源
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching static resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// 获取事件 - 实现缓存策略
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(handleRequest(request));
});

// 请求处理函数
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 静态资源：缓存优先策略
    if (matchesPattern(url.pathname, CACHE_STRATEGIES.static)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // 图片资源：缓存优先策略
    if (matchesPattern(url.pathname, CACHE_STRATEGIES.images)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }
    
    // HTML 页面：网络优先策略
    if (matchesPattern(url.pathname, CACHE_STRATEGIES.pages)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // 其他资源：网络优先
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    
    // 如果是页面请求失败，返回离线页面
    if (request.destination === 'document') {
      return await caches.match('/offline.html') || 
             new Response('页面暂时无法访问', { 
               status: 503, 
               statusText: 'Service Unavailable' 
             });
    }
    
    // 其他资源失败，返回网络错误
    return new Response('Network Error', { 
      status: 408, 
      statusText: 'Request Timeout' 
    });
  }
}

// 缓存优先策略
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // 后台更新缓存
    updateCache(request, cacheName);
    return cachedResponse;
  }
  
  // 缓存未命中，从网络获取
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// 网络优先策略
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 后台更新缓存
async function updateCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // 静默失败，不影响用户体验
    console.log('[SW] Background cache update failed:', error);
  }
}

// 模式匹配函数
function matchesPattern(pathname, patterns) {
  return patterns.some(pattern => pattern.test(pathname));
}

// 消息处理 - 支持手动缓存清理
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
