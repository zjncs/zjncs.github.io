/**
 * Butterfly Wiki Board Tag Plugin (Robust Version)
 * Description: Generates a glassmorphism dashboard for Categories, Tags, and Archives manually.
 * Author: Johnny-Zhao (Architect)
 */

'use strict';

hexo.extend.tag.register('wiki_board', function(args) {
  const categories = hexo.locals.get('categories');
  const tags = hexo.locals.get('tags');
  const posts = hexo.locals.get('posts').sort('date', -1);
  
  // Helper to create links safely
  const url_for = hexo.extend.helper.get('url_for').bind(hexo);

  // ------------------------------------------------
  // 1. 构建分类列表 (Categories)
  // ------------------------------------------------
  let catHtml = '<div class="wiki-list-container">';
  if (categories && categories.length) {
    categories.sort('name').forEach(cat => {
      catHtml += `
        <a class="wiki-list-item" href="${url_for(cat.path)}">
          <span class="wiki-item-name">
            <i class="fas fa-folder" style="opacity:0.6; margin-right:8px;"></i>${cat.name}
          </span>
          <span class="wiki-item-count">${cat.length}</span>
        </a>`;
    });
  } else {
    catHtml += '<div class="wiki-empty">暂无分类数据</div>';
  }
  catHtml += '</div>';

  // ------------------------------------------------
  // 2. 构建标签云 (Tags)
  // ------------------------------------------------
  let tagHtml = '<div class="wiki-chips-container">';
  if (tags && tags.length) {
    tags.sort('name').forEach(tag => {
      // 随机生成一点透明度差异，增加质感
      const opacity = Math.max(0.6, Math.random()).toFixed(2);
      tagHtml += `
        <a href="${url_for(tag.path)}" class="wiki-chip" style="--chip-opacity: ${opacity}">
          <span class="hash">#</span>${tag.name}
        </a>`;
    });
  } else {
    tagHtml += '<div class="wiki-empty">暂无标签数据</div>';
  }
  tagHtml += '</div>';

  // ------------------------------------------------
  // 3. 构建归档时间轴 (Archives - Group by Month)
  // ------------------------------------------------
  let archiveMap = new Map();
  posts.forEach(post => {
    // Hexo date is a moment object
    const year = post.date.year();
    const month = post.date.month() + 1; // 0-11 to 1-12
    const key = `${year}/${month < 10 ? '0' + month : month}`;
    const label = `${year}年 ${month}月`;
    
    if (!archiveMap.has(key)) {
      archiveMap.set(key, { label: label, count: 0, link: `archives/${year}/${month < 10 ? '0' + month : month}` });
    }
    archiveMap.get(key).count++;
  });

  let archHtml = '<div class="wiki-list-container">';
  // Sort by date desc
  const sortedKeys = Array.from(archiveMap.keys()).sort().reverse();
  
  if (sortedKeys.length > 0) {
    sortedKeys.forEach(key => {
      const item = archiveMap.get(key);
      archHtml += `
        <a class="wiki-list-item" href="${url_for(item.link)}">
          <span class="wiki-item-name">
            <i class="fas fa-clock" style="opacity:0.6; margin-right:8px;"></i>${item.label}
          </span>
          <span class="wiki-item-count">${item.count}</span>
        </a>`;
    });
  } else {
    archHtml += '<div class="wiki-empty">暂无文章归档</div>';
  }
  archHtml += '</div>';

  // ------------------------------------------------
  // 4. 组装最终仪表盘
  // ------------------------------------------------
  return `
  <div class="wiki-dashboard">
    
    <div class="wiki-card category-card">
      <div class="wiki-card-header">
        <div class="wiki-card-title">Categories</div>
        <div class="wiki-card-subtitle">知识分类索引</div>
      </div>
      <div class="wiki-card-body">
        ${catHtml}
      </div>
    </div>

    <div class="wiki-card tag-card">
      <div class="wiki-card-header">
        <div class="wiki-card-title">Tags</div>
        <div class="wiki-card-subtitle">灵感碎片</div>
      </div>
      <div class="wiki-card-body">
        ${tagHtml}
      </div>
    </div>

    <div class="wiki-card archive-card">
      <div class="wiki-card-header">
        <div class="wiki-card-title">Timeline</div>
        <div class="wiki-card-subtitle">时光轨迹</div>
      </div>
      <div class="wiki-card-body">
        ${archHtml}
      </div>
    </div>

  </div>
  `;
});