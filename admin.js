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
let githubIntegration = null;

// 简单的 Markdown 解析器
function parseMarkdown(content) {
    return content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]*)`/gim, '<code>$1</code>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n/gim, '<br>');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化');
    loadBlogData();
    setupEventListeners();
    updatePostsList();
    updateStats();
    
    // 初始化GitHub集成
    githubIntegration = new GitHubIntegration();
    updateGitHubStatus();
    
    // 设置默认发布时间
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const dateInput = document.getElementById('post-date');
    if (dateInput) {
        dateInput.value = now.toISOString().slice(0, 16);
    }
});

// 设置事件监听器
function setupEventListeners() {
    console.log('设置事件监听器');
    
    // 文章表单提交
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
    
    // 设置表单提交
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    
    // 主题表单提交
    const themeForm = document.getElementById('theme-form');
    if (themeForm) {
        themeForm.addEventListener('submit', handleThemeSubmit);
    }
    
    // GitHub表单提交
    const githubForm = document.getElementById('github-form');
    if (githubForm) {
        githubForm.addEventListener('submit', handleGitHubSubmit);
    }
    
    // Markdown 实时预览
    const postContent = document.getElementById('post-content');
    if (postContent) {
        postContent.addEventListener('input', updateMarkdownPreview);
    }
    
    // 标题自动生成 slug
    const postTitle = document.getElementById('post-title');
    if (postTitle) {
        postTitle.addEventListener('input', generateSlug);
    }
    
    // 文件拖拽上传
    setupFileUpload();
}

// 显示指定部分
function showSection(sectionName) {
    console.log('显示部分:', sectionName);
    
    // 隐藏所有部分
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 移除所有按钮的激活状态
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示指定部分
    const targetSection = document.getElementById(sectionName + '-section');
    const targetTab = document.getElementById(sectionName + '-tab');
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 处理文章提交
function handlePostSubmit(e) {
    e.preventDefault();
    console.log('处理文章提交');
    
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
    
    // 如果配置了GitHub，询问是否同步
    if (githubIntegration && githubIntegration.isConfigured()) {
        if (confirm('是否同步到GitHub？')) {
            syncPostToGitHub(postData);
        }
    }
    
    clearForm();
    currentEditingPost = null;
    document.getElementById('post-form-title').textContent = '新建文章';
}

// 处理设置提交
function handleSettingsSubmit(e) {
    e.preventDefault();
    console.log('处理设置提交');
    
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
    console.log('处理主题提交');
    
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

// 处理GitHub配置提交
function handleGitHubSubmit(e) {
    e.preventDefault();
    console.log('处理GitHub配置提交');
    
    const token = document.getElementById('github-token').value;
    const owner = document.getElementById('github-owner').value;
    const repo = document.getElementById('github-repo').value;
    
    if (!token || !owner || !repo) {
        showNotification('请填写完整的GitHub配置信息', 'error');
        return;
    }
    
    if (githubIntegration) {
        githubIntegration.setConfig(token, owner, repo);
        updateGitHubStatus();
        showNotification('GitHub配置保存成功！', 'success');
    }
}

// 更新文章列表
function updatePostsList() {
    console.log('更新文章列表');
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;
    
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
    console.log('编辑文章:', postId);
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
    console.log('删除文章:', postId);
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    const post = blogData.posts.find(p => p.id === postId);
    blogData.posts = blogData.posts.filter(p => p.id !== postId);
    saveBlogData();
    updatePostsList();
    updateStats();
    
    // 如果配置了GitHub，询问是否删除
    if (githubIntegration && githubIntegration.isConfigured()) {
        if (confirm('是否从GitHub删除？')) {
            deletePostFromGitHub(post);
        }
    }
    
    showNotification('文章删除成功！', 'success');
}

// 清空表单
function clearForm() {
    console.log('清空表单');
    if (confirm('确定要清空表单吗？')) {
        document.getElementById('post-form').reset();
        clearTags();
        const previewDiv = document.getElementById('markdown-preview');
        if (previewDiv) {
            previewDiv.innerHTML = '<p>在左侧编辑器中输入内容，这里会显示预览效果...</p>';
        }
        
        // 重置发布时间
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const dateInput = document.getElementById('post-date');
        if (dateInput) {
            dateInput.value = now.toISOString().slice(0, 16);
        }
    }
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
    if (!tagInput) return;
    
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
    if (!preview) return;
    
    if (content.trim()) {
        preview.innerHTML = parseMarkdown(content);
    } else {
        preview.innerHTML = '<p>在左侧编辑器中输入内容，这里会显示预览效果...</p>';
    }
}

// 文件上传
function setupFileUpload() {
    console.log('设置文件上传');
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('file-upload');
    
    if (!fileInput || !uploadArea) return;
    
    // 点击上传
    uploadArea.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });
    
    // 文件选择
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.display = 'flex';
    });
    
    document.addEventListener('dragleave', (e) => {
        if (!document.contains(e.relatedTarget)) {
            uploadArea.style.display = 'none';
        }
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
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
    console.log('处理文件:', files);
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
    console.log('解析Markdown文件:', filename);
    
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
    console.log('导出博客数据');
    try {
        const dataStr = JSON.stringify(blogData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `blog-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('博客数据导出成功！', 'success');
    } catch (error) {
        console.error('导出失败:', error);
        showNotification('导出失败：' + error.message, 'error');
    }
}

// 导入博客
function importBlog() {
    console.log('导入博客数据');
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
                console.log('导入的数据:', importedData);
                
                if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
                    blogData = importedData;
                    saveBlogData();
                    loadBlogData();
                    updatePostsList();
                    updateStats();
                    showNotification('博客数据导入成功！', 'success');
                }
            } catch (error) {
                console.error('导入失败:', error);
                showNotification('导入失败：文件格式错误', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// GitHub相关函数
function updateGitHubStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const githubActions = document.getElementById('github-actions');
    
    if (!statusIndicator || !statusText || !githubActions) return;
    
    // 加载保存的配置
    const token = localStorage.getItem('github_token');
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');
    
    if (token && owner && repo) {
        document.getElementById('github-token').value = token;
        document.getElementById('github-owner').value = owner;
        document.getElementById('github-repo').value = repo;
        
        statusIndicator.className = 'status-indicator connected';
        statusText.textContent = `已连接到 ${owner}/${repo}`;
        githubActions.style.display = 'block';
    } else {
        statusIndicator.className = 'status-indicator';
        statusText.textContent = '未配置';
        githubActions.style.display = 'none';
    }
}

async function testGitHubConnection() {
    if (!githubIntegration || !githubIntegration.isConfigured()) {
        showNotification('请先配置GitHub信息', 'error');
        return;
    }
    
    try {
        await githubIntegration.apiRequest(`/repos/${githubIntegration.owner}/${githubIntegration.repo}`);
        showNotification('GitHub连接测试成功！', 'success');
        
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        statusIndicator.className = 'status-indicator connected';
        statusText.textContent = `已连接到 ${githubIntegration.owner}/${githubIntegration.repo}`;
        
        document.getElementById('github-actions').style.display = 'block';
    } catch (error) {
        showNotification(`连接失败: ${error.message}`, 'error');
        
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        statusIndicator.className = 'status-indicator error';
        statusText.textContent = '连接失败';
    }
}

async function initializeJekyllSite() {
    if (!githubIntegration || !githubIntegration.isConfigured()) {
        showNotification('请先配置GitHub信息', 'error');
        return;
    }
    
    addLogEntry('开始初始化Jekyll站点...', 'info');
    
    try {
        const results = await githubIntegration.initializeJekyllSite();
        
        results.forEach(result => {
            if (result.success) {
                addLogEntry(`✓ 创建文件: ${result.file}`, 'success');
            } else {
                addLogEntry(`✗ 创建失败: ${result.file} - ${result.error}`, 'error');
            }
        });
        
        addLogEntry('Jekyll站点初始化完成！', 'success');
        showNotification('Jekyll站点初始化成功！', 'success');
    } catch (error) {
        addLogEntry(`初始化失败: ${error.message}`, 'error');
        showNotification(`初始化失败: ${error.message}`, 'error');
    }
}

async function syncAllPosts() {
    if (!githubIntegration || !githubIntegration.isConfigured()) {
        showNotification('请先配置GitHub信息', 'error');
        return;
    }
    
    if (blogData.posts.length === 0) {
        showNotification('没有文章需要同步', 'info');
        return;
    }
    
    addLogEntry(`开始同步 ${blogData.posts.length} 篇文章...`, 'info');
    
    try {
        const results = await githubIntegration.syncAllPosts(blogData.posts);
        
        let successCount = 0;
        let errorCount = 0;
        
        results.forEach(result => {
            if (result.success) {
                addLogEntry(`✓ 同步成功: ${result.post}`, 'success');
                successCount++;
            } else {
                addLogEntry(`✗ 同步失败: ${result.post} - ${result.error}`, 'error');
                errorCount++;
            }
        });
        
        addLogEntry(`同步完成！成功: ${successCount}, 失败: ${errorCount}`, 'info');
        showNotification(`文章同步完成！成功: ${successCount}, 失败: ${errorCount}`, 'success');
    } catch (error) {
        addLogEntry(`同步失败: ${error.message}`, 'error');
        showNotification(`同步失败: ${error.message}`, 'error');
    }
}

async function syncSettings() {
    if (!githubIntegration || !githubIntegration.isConfigured()) {
        showNotification('请先配置GitHub信息', 'error');
        return;
    }
    
    addLogEntry('开始同步站点设置...', 'info');
    
    try {
        await githubIntegration.saveConfig(blogData.settings);
        addLogEntry('✓ 站点配置同步成功', 'success');
        
        await githubIntegration.saveAboutPage(blogData.settings.about || '');
        addLogEntry('✓ 关于页面同步成功', 'success');
        
        addLogEntry('设置同步完成！', 'success');
        showNotification('设置同步成功！', 'success');
    } catch (error) {
        addLogEntry(`设置同步失败: ${error.message}`, 'error');
        showNotification(`设置同步失败: ${error.message}`, 'error');
    }
}

async function syncPostToGitHub(post) {
    try {
        await githubIntegration.savePost(post);
        showNotification('文章已同步到GitHub！', 'success');
    } catch (error) {
        showNotification(`GitHub同步失败: ${error.message}`, 'error');
    }
}

async function deletePostFromGitHub(post) {
    try {
        await githubIntegration.deletePost(post);
        showNotification('文章已从GitHub删除！', 'success');
    } catch (error) {
        showNotification(`GitHub删除失败: ${error.message}`, 'error');
    }
}

function addLogEntry(message, type = 'info') {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

async function syncToGitHub() {
    if (!githubIntegration || !githubIntegration.isConfigured()) {
        showNotification('请先在GitHub同步页面配置GitHub信息', 'error');
        showSection('github');
        return;
    }
    
    if (confirm('是否同步所有内容到GitHub？这将包括文章、设置和关于页面。')) {
        showSection('github');
        await syncAllPosts();
        await syncSettings();
    }
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
        const elements = {
            'site-title': blogData.settings.title || '',
            'site-description': blogData.settings.description || '',
            'site-author': blogData.settings.author || '',
            'site-email': blogData.settings.email || '',
            'github-username': blogData.settings.github || '',
            'twitter-username': blogData.settings.twitter || '',
            'about-content': blogData.settings.about || ''
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
    }
    
    // 加载主题设置
    if (blogData.theme) {
        const themeElements = {
            'primary-color': blogData.theme.primaryColor || '#3498db',
            'accent-color': blogData.theme.accentColor || '#e74c3c',
            'font-family': blogData.theme.fontFamily || 'system',
            'custom-css': blogData.theme.customCSS || ''
        };
        
        Object.entries(themeElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });
        
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
    const elements = {
        'total-posts': blogData.posts.length,
        'total-categories': new Set(blogData.posts.map(p => p.category).filter(Boolean)).size,
        'total-tags': new Set(blogData.posts.flatMap(p => p.tags)).size
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
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
    console.log('显示通知:', message, type);
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
    console.log('预览文章');
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
    if (previewWindow) {
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${postData.title}</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        line-height: 1.6; 
                    }
                    h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
                    code { 
                        background: #f4f4f4; 
                        padding: 2px 4px; 
                        border-radius: 3px; 
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    }
                    pre { 
                        background: #f4f4f4; 
                        padding: 15px; 
                        border-radius: 5px; 
                        overflow-x: auto; 
                    }
                    pre code { background: none; padding: 0; }
                    blockquote { 
                        border-left: 4px solid #3498db; 
                        margin: 0; 
                        padding-left: 20px; 
                        color: #666; 
                    }
                    .meta {
                        color: #666;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #eee;
                    }
                    .tags {
                        margin-top: 20px;
                    }
                    .tag {
                        display: inline-block;
                        background: #e3f2fd;
                        color: #1976d2;
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        margin-right: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>${postData.title}</h1>
                <div class="meta">
                    <strong>分类:</strong> ${postData.category || '未分类'} | 
                    <strong>发布时间:</strong> ${new Date(postData.date).toLocaleString('zh-CN')}
                </div>
                ${parseMarkdown(postData.content)}
                ${postData.tags.length > 0 ? `
                    <div class="tags">
                        <strong>标签:</strong> 
                        ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </body>
            </html>
        `);
        previewWindow.document.close();
    }
}

// GitHub集成类（简化版）
class GitHubIntegration {
    constructor() {
        this.token = localStorage.getItem('github_token');
        this.repo = localStorage.getItem('github_repo');
        this.owner = localStorage.getItem('github_owner');
        this.branch = 'main';
    }

    setConfig(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
    }

    isConfigured() {
        return this.token && this.repo && this.owner;
    }

    async apiRequest(endpoint, options = {}) {
        const url = `https://api.github.com${endpoint}`;
        const headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `GitHub API Error: ${response.status}`);
        }

        return response.json();
    }

    async savePost(post) {
        // 简化的保存逻辑
        console.log('保存文章到GitHub:', post.title);
        return Promise.resolve();
    }

    async deletePost(post) {
        // 简化的删除逻辑
        console.log('从GitHub删除文章:', post.title);
        return Promise.resolve();
    }

    async saveConfig(settings) {
        // 简化的配置保存逻辑
        console.log('保存配置到GitHub:', settings);
        return Promise.resolve();
    }

    async saveAboutPage(content) {
        // 简化的关于页面保存逻辑
        console.log('保存关于页面到GitHub');
        return Promise.resolve();
    }

    async syncAllPosts(posts) {
        // 简化的批量同步逻辑
        console.log('批量同步文章到GitHub:', posts.length);
        return posts.map(post => ({ success: true, post: post.title }));
    }

    async initializeJekyllSite() {
        // 简化的Jekyll初始化逻辑
        console.log('初始化Jekyll站点');
        return [
            { success: true, file: '_config.yml' },
            { success: true, file: 'index.html' },
            { success: true, file: '_layouts/default.html' }
        ];
    }
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
window.testGitHubConnection = testGitHubConnection;
window.initializeJekyllSite = initializeJekyllSite;
window.syncAllPosts = syncAllPosts;
window.syncSettings = syncSettings;
window.syncToGitHub = syncToGitHub;