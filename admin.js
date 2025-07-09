import { marked } from 'marked';

// 博客数据存储
let blogData = {
    posts: [],
    settings: {
        title: '我的技术博客',
        description: '专业技术分享与开发经验',
        author: 'Your Name',
        email: 'your.email@example.com',
        github: '',
        twitter: ''
    },
    theme: {
        primaryColor: '#3498db',
        accentColor: '#e74c3c',
        fontFamily: 'system',
        customCSS: ''
    }
};

let currentEditingPost = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadBlogData();
    setupEventListeners();
    updatePostsList();
    updateStats();
    
    // 设置默认发布时间
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('post-date').value = now.toISOString().slice(0, 16);
});

// 设置事件监听器
function setupEventListeners() {
    // 文章表单提交
    document.getElementById('post-form').addEventListener('submit', handlePostSubmit);
    
    // 设置表单提交
    document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);
    
    // 主题表单提交
    document.getElementById('theme-form').addEventListener('submit', handleThemeSubmit);
    
    // Markdown 实时预览
    document.getElementById('post-content').addEventListener('input', updateMarkdownPreview);
    
    // 标题自动生成 slug
    document.getElementById('post-title').addEventListener('input', generateSlug);
    
    // 文件拖拽上传
    setupFileUpload();
}

// 显示指定部分
function showSection(sectionName) {
    // 隐藏所有部分
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有按钮的激活状态
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示指定部分
    document.getElementById(sectionName + '-section').classList.add('active');
    document.getElementById(sectionName + '-tab').classList.add('active');
}

// 处理文章提交
function handlePostSubmit(e) {
    e.preventDefault();
    
    const postData = {
        id: currentEditingPost ? currentEditingPost.id : Date.now().toString(),
        title: document.getElementById('post-title').value,
        slug: document.getElementById('post-slug').value || generateSlugFromTitle(document.getElementById('post-title').value),
        content: document.getElementById('post-content').value,
        excerpt: document.getElementById('post-excerpt').value,
        category: document.getElementById('post-category').value,
        tags: getTags(),
        date: document.getElementById('post-date').value,
        updated: new Date().toISOString()
    };
    
    if (currentEditingPost) {
        // 更新现有文章
        const index = blogData.posts.findIndex(p => p.id === currentEditingPost.id);
        blogData.posts[index] = postData;
        showNotification('文章更新成功！', 'success');
    } else {
        // 添加新文章
        blogData.posts.unshift(postData);
        showNotification('文章发布成功！', 'success');
    }
    
    saveBlogData();
    updatePostsList();
    updateStats();
    clearForm();
    currentEditingPost = null;
    document.getElementById('post-form-title').textContent = '新建文章';
}

// 处理设置提交
function handleSettingsSubmit(e) {
    e.preventDefault();
    
    blogData.settings = {
        title: document.getElementById('site-title').value,
        description: document.getElementById('site-description').value,
        author: document.getElementById('site-author').value,
        email: document.getElementById('site-email').value,
        github: document.getElementById('github-username').value,
        twitter: document.getElementById('twitter-username').value,
        about: document.getElementById('about-content').value
    };
    
    saveBlogData();
    showNotification('设置保存成功！', 'success');
}

// 处理主题提交
function handleThemeSubmit(e) {
    e.preventDefault();
    
    blogData.theme = {
        primaryColor: document.getElementById('primary-color').value,
        accentColor: document.getElementById('accent-color').value,
        fontFamily: document.getElementById('font-family').value,
        customCSS: document.getElementById('custom-css').value
    };
    
    saveBlogData();
    applyTheme();
    showNotification('主题应用成功！', 'success');
}

// 更新文章列表
function updatePostsList() {
    const postsList = document.getElementById('posts-list');
    
    if (blogData.posts.length === 0) {
        postsList.innerHTML = '<p>还没有文章，<a href="#" onclick="showSection(\'new-post\')">写第一篇文章</a>吧！</p>';
        return;
    }
    
    postsList.innerHTML = blogData.posts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <h4>${post.title}</h4>
                <div class="post-meta">
                    ${formatDate(post.date)} | ${post.category || '未分类'} | ${post.tags.length} 个标签
                </div>
            </div>
            <div class="post-actions">
                <button class="btn" onclick="editPost('${post.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-danger" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 编辑文章
function editPost(postId) {
    const post = blogData.posts.find(p => p.id === postId);
    if (!post) return;
    
    currentEditingPost = post;
    
    // 填充表单
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-slug').value = post.slug;
    document.getElementById('post-content').value = post.content;
    document.getElementById('post-excerpt').value = post.excerpt || '';
    document.getElementById('post-category').value = post.category || '';
    document.getElementById('post-date').value = post.date;
    
    // 设置标签
    clearTags();
    post.tags.forEach(tag => addTagToInput(tag));
    
    // 更新预览
    updateMarkdownPreview();
    
    // 切换到编辑界面
    document.getElementById('post-form-title').textContent = '编辑文章';
    showSection('new-post');
}

// 删除文章
function deletePost(postId) {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    blogData.posts = blogData.posts.filter(p => p.id !== postId);
    saveBlogData();
    updatePostsList();
    updateStats();
    showNotification('文章删除成功！', 'success');
}

// 清空表单
function clearForm() {
    document.getElementById('post-form').reset();
    clearTags();
    document.getElementById('markdown-preview').innerHTML = '<p>在左侧编辑器中输入内容，这里会显示预览效果...</p>';
    
    // 重置发布时间
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('post-date').value = now.toISOString().slice(0, 16);
}

// 标签管理
function addTag(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const tag = input.value.trim();
        
        if (tag && !getTags().includes(tag)) {
            addTagToInput(tag);
            input.value = '';
        }
    }
}

function addTagToInput(tagText) {
    const tagInput = document.getElementById('tag-input');
    const input = tagInput.querySelector('input');
    
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${tagText} <span class="remove" onclick="removeTag(this)">×</span>`;
    
    tagInput.insertBefore(tag, input);
}

function removeTag(element) {
    element.parentElement.remove();
}

function getTags() {
    const tags = [];
    document.querySelectorAll('#tag-input .tag').forEach(tag => {
        tags.push(tag.textContent.replace('×', '').trim());
    });
    return tags;
}

function clearTags() {
    document.querySelectorAll('#tag-input .tag').forEach(tag => tag.remove());
}

// 生成 URL 别名
function generateSlug() {
    const title = document.getElementById('post-title').value;
    const slug = generateSlugFromTitle(title);
    document.getElementById('post-slug').value = slug;
}

function generateSlugFromTitle(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Markdown 预览
function updateMarkdownPreview() {
    const content = document.getElementById('post-content').value;
    const preview = document.getElementById('markdown-preview');
    
    if (content.trim()) {
        preview.innerHTML = marked(content);
    } else {
        preview.innerHTML = '<p>在左侧编辑器中输入内容，这里会显示预览效果...</p>';
    }
}

// 文件上传
function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('file-upload');
    
    // 点击上传
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 文件选择
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.display = 'block';
        uploadArea.classList.add('dragover');
    });
    
    document.addEventListener('dragleave', (e) => {
        if (!document.contains(e.relatedTarget)) {
            uploadArea.classList.remove('dragover');
            uploadArea.style.display = 'none';
        }
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        uploadArea.style.display = 'none';
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

function handleFiles(files) {
    files.forEach(file => {
        if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                parseMarkdownFile(e.target.result, file.name);
            };
            reader.readAsText(file);
        }
    });
}

function parseMarkdownFile(content, filename) {
    // 解析 Front Matter
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    let frontMatter = {};
    let markdownContent = content;
    
    if (match) {
        try {
            // 简单的 YAML 解析
            const yamlContent = match[1];
            const lines = yamlContent.split('\n');
            lines.forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                    frontMatter[key.trim()] = value;
                }
            });
            markdownContent = match[2];
        } catch (error) {
            console.error('解析 Front Matter 失败:', error);
        }
    }
    
    // 填充表单
    document.getElementById('post-title').value = frontMatter.title || filename.replace('.md', '');
    document.getElementById('post-content').value = markdownContent;
    document.getElementById('post-category').value = frontMatter.category || '';
    document.getElementById('post-excerpt').value = frontMatter.excerpt || '';
    
    if (frontMatter.date) {
        const date = new Date(frontMatter.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        document.getElementById('post-date').value = date.toISOString().slice(0, 16);
    }
    
    // 设置标签
    clearTags();
    if (frontMatter.tags) {
        const tags = frontMatter.tags.split(',').map(tag => tag.trim());
        tags.forEach(tag => addTagToInput(tag));
    }
    
    generateSlug();
    updateMarkdownPreview();
    showSection('new-post');
    showNotification('文件导入成功！', 'success');
}

// 导出博客
function exportBlog() {
    const dataStr = JSON.stringify(blogData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'blog-backup.json';
    link.click();
    
    showNotification('博客数据导出成功！', 'success');
}

// 导入博客
function importBlog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
                    blogData = importedData;
                    saveBlogData();
                    loadBlogData();
                    updatePostsList();
                    updateStats();
                    showNotification('博客数据导入成功！', 'success');
                }
            } catch (error) {
                showNotification('导入失败：文件格式错误', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// 数据持久化
function saveBlogData() {
    localStorage.setItem('blogData', JSON.stringify(blogData));
}

function loadBlogData() {
    const saved = localStorage.getItem('blogData');
    if (saved) {
        try {
            blogData = JSON.parse(saved);
        } catch (error) {
            console.error('加载博客数据失败:', error);
        }
    }
    
    // 加载设置到表单
    if (blogData.settings) {
        document.getElementById('site-title').value = blogData.settings.title || '';
        document.getElementById('site-description').value = blogData.settings.description || '';
        document.getElementById('site-author').value = blogData.settings.author || '';
        document.getElementById('site-email').value = blogData.settings.email || '';
        document.getElementById('github-username').value = blogData.settings.github || '';
        document.getElementById('twitter-username').value = blogData.settings.twitter || '';
        document.getElementById('about-content').value = blogData.settings.about || '';
    }
    
    // 加载主题设置
    if (blogData.theme) {
        document.getElementById('primary-color').value = blogData.theme.primaryColor || '#3498db';
        document.getElementById('accent-color').value = blogData.theme.accentColor || '#e74c3c';
        document.getElementById('font-family').value = blogData.theme.fontFamily || 'system';
        document.getElementById('custom-css').value = blogData.theme.customCSS || '';
        applyTheme();
    }
}

// 应用主题
function applyTheme() {
    const theme = blogData.theme;
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    // 应用自定义 CSS
    let customStyle = document.getElementById('custom-theme-style');
    if (!customStyle) {
        customStyle = document.createElement('style');
        customStyle.id = 'custom-theme-style';
        document.head.appendChild(customStyle);
    }
    customStyle.textContent = theme.customCSS;
}

// 更新统计信息
function updateStats() {
    document.getElementById('total-posts').textContent = blogData.posts.length;
    
    const categories = new Set(blogData.posts.map(p => p.category).filter(Boolean));
    document.getElementById('total-categories').textContent = categories.size;
    
    const tags = new Set(blogData.posts.flatMap(p => p.tags));
    document.getElementById('total-tags').textContent = tags.size;
}

// 工具函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 预览文章
function previewPost() {
    const postData = {
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        excerpt: document.getElementById('post-excerpt').value,
        category: document.getElementById('post-category').value,
        tags: getTags(),
        date: document.getElementById('post-date').value
    };
    
    // 在新窗口中预览
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${postData.title}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
                h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
                code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
                pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                blockquote { border-left: 4px solid #3498db; margin: 0; padding-left: 20px; color: #666; }
            </style>
        </head>
        <body>
            <h1>${postData.title}</h1>
            <p><strong>分类:</strong> ${postData.category || '未分类'} | <strong>标签:</strong> ${postData.tags.join(', ')}</p>
            <hr>
            ${marked(postData.content)}
        </body>
        </html>
    `);
}

// 全局函数导出
window.showSection = showSection;
window.editPost = editPost;
window.deletePost = deletePost;
window.clearForm = clearForm;
window.addTag = addTag;
window.removeTag = removeTag;
window.exportBlog = exportBlog;
window.importBlog = importBlog;
window.previewPost = previewPost;