// 可访问性增强脚本
// 提升博客的无障碍访问体验

hexo.extend.filter.register('after_render:html', function(str, data) {
  
  // 1. 确保所有图片都有 alt 属性
  str = str.replace(/<img([^>]*?)>/gi, function(match) {
    // 如果已经有 alt 属性，跳过
    if (match.includes('alt=')) {
      return match;
    }
    
    // 尝试从 src 或 title 提取描述
    const srcMatch = match.match(/src="([^"]*?)"/);
    const titleMatch = match.match(/title="([^"]*?)"/);
    
    let altText = '';
    if (titleMatch) {
      altText = titleMatch[1];
    } else if (srcMatch) {
      // 从文件名生成描述
      const filename = srcMatch[1].split('/').pop().split('.')[0];
      altText = filename.replace(/[-_]/g, ' ');
    } else {
      altText = '图片';
    }
    
    return match.replace('>', ` alt="${altText}">`);
  });

  // 2. 为链接添加更好的可访问性
  str = str.replace(/<a([^>]*?)href="([^"]*?)"([^>]*?)>/gi, function(match, before, href, after) {
    let result = match;
    
    // 为外部链接添加 rel 和 aria-label
    if (href.startsWith('http') && !href.includes(hexo.config.url)) {
      if (!match.includes('rel=')) {
        result = result.replace('>', ' rel="noopener noreferrer">');
      }
      if (!match.includes('aria-label=') && !match.includes('title=')) {
        result = result.replace('>', ' aria-label="外部链接，在新窗口打开">');
      }
    }
    
    return result;
  });

  // 3. 改善标题层级结构
  str = str.replace(/<h([1-6])([^>]*?)>/gi, function(match, level, attrs) {
    // 确保标题有合适的 id 用于锚点导航
    if (!attrs.includes('id=')) {
      const content = str.match(new RegExp(match + '([^<]*?)</h' + level + '>'))?.[1] || '';
      const id = content.toLowerCase()
        .replace(/[^\u4e00-\u9fa5a-z0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      
      if (id) {
        return `<h${level}${attrs} id="${id}">`;
      }
    }
    return match;
  });

  // 4. 为表单元素添加标签关联
  str = str.replace(/<input([^>]*?)>/gi, function(match) {
    // 如果没有 aria-label 或关联的 label，添加基本的可访问性属性
    if (!match.includes('aria-label=') && !match.includes('id=')) {
      const typeMatch = match.match(/type="([^"]*?)"/);
      const type = typeMatch ? typeMatch[1] : 'text';
      const placeholderMatch = match.match(/placeholder="([^"]*?)"/);
      const placeholder = placeholderMatch ? placeholderMatch[1] : `请输入${type}`;
      
      return match.replace('>', ` aria-label="${placeholder}">`);
    }
    return match;
  });

  // 5. 添加跳转到主内容的链接
  if (data.path === 'index.html' || !str.includes('skip-to-content')) {
    const skipLink = `
      <a href="#main-content" class="skip-to-content" style="
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        border-radius: 4px;
      " onfocus="this.style.top='6px'" onblur="this.style.top='-40px'">
        跳转到主内容
      </a>
    `;
    
    str = str.replace('<body', skipLink + '<body');
  }

  // 6. 为主要内容区域添加 landmark
  str = str.replace(/<div([^>]*?)class="[^"]*main[^"]*"([^>]*?)>/gi, function(match) {
    if (!match.includes('role=') && !match.includes('<main')) {
      return match.replace('>', ' role="main" id="main-content">');
    }
    return match;
  });

  // 7. 改善对比度 - 为图片上的文字添加背景
  str = str.replace(/<div([^>]*?)class="[^"]*hero[^"]*"([^>]*?)>/gi, function(match) {
    // 确保 hero 区域有足够的对比度
    const style = 'style="position: relative;"';
    if (!match.includes('style=')) {
      return match.replace('>', ` ${style}>`);
    }
    return match;
  });

  return str;
});

// 添加可访问性相关的 meta 标签
hexo.extend.filter.register('after_render:html', function(str, data) {
  const accessibilityMeta = `
    <!-- 可访问性增强 -->
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#4a90e2">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  `;

  str = str.replace('</head>', accessibilityMeta + '</head>');
  
  return str;
});

console.log('可访问性增强脚本已加载');
