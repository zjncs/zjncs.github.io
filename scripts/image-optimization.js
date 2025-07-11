// 图片优化和懒加载脚本
// 为博客添加现代图片格式支持和懒加载功能

hexo.extend.filter.register('after_render:html', function(str, data) {
  // 只在生产环境下执行优化
  if (process.env.NODE_ENV !== 'production' && !hexo.config.neat_enable) {
    return str;
  }

  // 1. 为所有图片添加懒加载
  str = str.replace(/<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi, function(match, before, src, after) {
    // 跳过已经有 loading 属性的图片
    if (match.includes('loading=')) {
      return match;
    }
    
    // 跳过 SVG 和 base64 图片
    if (src.includes('.svg') || src.startsWith('data:')) {
      return match;
    }
    
    // 添加懒加载属性
    return `<img${before}src="${src}"${after} loading="lazy" decoding="async">`;
  });

  // 2. 为重要图片添加预加载提示
  str = str.replace(/<img([^>]*?)class="[^"]*hero[^"]*"([^>]*?)>/gi, function(match) {
    // 为 hero 图片移除懒加载，因为它们是首屏内容
    return match.replace(' loading="lazy"', '');
  });

  // 3. 添加现代图片格式支持（WebP）
  str = str.replace(/<img([^>]*?)src="([^"]*?\.(jpg|jpeg|png))"([^>]*?)>/gi, function(match, before, src, ext, after) {
    // 跳过已经是 WebP 的图片
    if (src.includes('.webp')) {
      return match;
    }
    
    // 生成 WebP 版本的路径
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // 创建 picture 元素以支持现代图片格式
    const alt = match.match(/alt="([^"]*?)"/);
    const altText = alt ? alt[1] : '';
    const loading = match.includes('loading="lazy"') ? ' loading="lazy"' : '';
    const decoding = match.includes('decoding="async"') ? ' decoding="async"' : '';
    
    return `<picture>
      <source srcset="${webpSrc}" type="image/webp">
      <img${before}src="${src}"${after}${loading}${decoding}>
    </picture>`;
  });

  return str;
});

// 添加关键资源预加载
hexo.extend.filter.register('after_render:html', function(str, data) {
  // 只在首页添加关键资源预加载
  if (data.path !== 'index.html') {
    return str;
  }

  // 在 head 中添加关键资源预加载
  const preloadLinks = `
    <!-- 关键资源预加载 -->
    <link rel="preload" href="/css/app.css" as="style">
    <link rel="preload" href="/js/app.js" as="script">
    <!-- 预连接到外部资源 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://images.unsplash.com">
  `;

  str = str.replace('</head>', preloadLinks + '</head>');
  
  return str;
});

// 添加 Critical CSS 内联
hexo.extend.filter.register('after_render:html', function(str, data) {
  // 只在首页内联关键 CSS
  if (data.path !== 'index.html') {
    return str;
  }

  // 关键 CSS（首屏渲染必需的样式）
  const criticalCSS = `
    <style>
      /* Critical CSS - 首屏渲染必需样式 */
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0; 
        padding: 0; 
        background-color: #ffffff;
      }
      .navbar { 
        position: fixed; 
        top: 0; 
        width: 100%; 
        z-index: 1000; 
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
      }
      .hero-banner { 
        height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        position: relative;
      }
      .hero-banner::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(123, 104, 238, 0.1));
        z-index: 1;
      }
      .hero-text {
        position: relative;
        z-index: 2;
        text-align: center;
        color: #333;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    </style>
  `;

  str = str.replace('</head>', criticalCSS + '</head>');
  
  return str;
});

console.log('图片优化和性能增强脚本已加载');
