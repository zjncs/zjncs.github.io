// Coding Time 页面渲染器
// 负责渲染编程统计、GitHub数据和活动图表

class CodingTimeRenderer {
    constructor() {
        this.stats = new CodingTimeStats();
    }

    // 渲染完整的Coding Time页面
    async renderCodingTimePage() {
        try {
            const data = await this.stats.generateCodingStats();
            
            return `
                <div class="coding-time-page">
                    ${this.renderPageHeader()}
                    ${this.renderStatsOverview(data)}
                    ${this.renderGitHubProfile(data.profile)}
                    ${this.renderLanguageChart(data.languageChart)}
                    ${this.renderSkillTags(data.skillTags)}
                    ${this.renderRecentRepos(data.repoStats.recentRepos)}
                    ${this.renderActivityHeatmap(data.activityData)}
                    ${this.renderCodingJourney(data)}
                </div>
            `;
        } catch (error) {
            console.error('渲染Coding Time页面失败:', error);
            return this.renderErrorPage();
        }
    }

    // 渲染页面头部
    renderPageHeader() {
        return `
            <div class="blog-header">
                <div class="blog-header-content">
                    <h1><i class="fas fa-code"></i> 编程时间</h1>
                    <p class="blog-description">记录我的编程历程与技术成长</p>
                    <nav class="breadcrumb">
                        <a href="#" onclick="blog.showPage('home')"><i class="fas fa-home"></i> 首页</a>
                        <span class="separator"><i class="fas fa-chevron-right"></i></span>
                        <span class="current">编程时间</span>
                    </nav>
                </div>
            </div>
        `;
    }

    // 渲染统计概览
    renderStatsOverview(data) {
        return `
            <div class="stats-overview">
                <div class="stats-grid">
                    <div class="stat-card animate-on-scroll">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${data.codingYears}</div>
                            <div class="stat-label">编程年数</div>
                        </div>
                    </div>
                    
                    <div class="stat-card animate-on-scroll">
                        <div class="stat-icon">
                            <i class="fab fa-github"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${data.repoStats.totalRepos}</div>
                            <div class="stat-label">代码仓库</div>
                        </div>
                    </div>
                    
                    <div class="stat-card animate-on-scroll">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${data.repoStats.totalStars}</div>
                            <div class="stat-label">获得星标</div>
                        </div>
                    </div>
                    
                    <div class="stat-card animate-on-scroll">
                        <div class="stat-icon">
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${data.totalCommits}</div>
                            <div class="stat-label">总提交数</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染GitHub个人资料
    renderGitHubProfile(profile) {
        return `
            <div class="github-profile-section">
                <h2><i class="fab fa-github"></i> GitHub 个人资料</h2>
                <div class="github-profile-card">
                    <div class="profile-avatar">
                        <img src="${profile.avatar_url}" alt="${profile.name}" />
                        <div class="profile-badges">
                            <span class="badge github-badge">
                                <i class="fab fa-github"></i> GitHub
                            </span>
                            <span class="badge orcid-badge">
                                <i class="ai ai-orcid"></i> ORCID
                            </span>
                        </div>
                    </div>
                    <div class="profile-info">
                        <h3>${profile.name || profile.login}</h3>
                        <p class="profile-bio">${profile.bio || '热爱编程，持续学习中...'}</p>
                        <div class="profile-stats">
                            <div class="profile-stat">
                                <span class="stat-value">${profile.public_repos}</span>
                                <span class="stat-label">公开仓库</span>
                            </div>
                            <div class="profile-stat">
                                <span class="stat-value">${profile.followers}</span>
                                <span class="stat-label">关注者</span>
                            </div>
                            <div class="profile-stat">
                                <span class="stat-value">${profile.following}</span>
                                <span class="stat-label">关注中</span>
                            </div>
                        </div>
                        <div class="profile-links">
                            <a href="https://github.com/${profile.login}" target="_blank" class="profile-link">
                                <i class="fab fa-github"></i> 访问GitHub
                            </a>
                            <a href="https://orcid.org/0009-0005-0821-6046" target="_blank" class="profile-link">
                                <i class="ai ai-orcid"></i> ORCID资料
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染编程语言图表
    renderLanguageChart(languageData) {
        const chartHTML = languageData.map(lang => `
            <div class="language-item">
                <div class="language-info">
                    <span class="language-name" style="color: ${lang.color}">
                        <i class="fas fa-circle"></i> ${lang.language}
                    </span>
                    <span class="language-percentage">${lang.percentage}%</span>
                </div>
                <div class="language-bar">
                    <div class="language-progress" 
                         style="width: ${lang.percentage}%; background-color: ${lang.color}">
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="language-chart-section">
                <h2><i class="fas fa-chart-pie"></i> 编程语言分布</h2>
                <div class="language-chart">
                    ${chartHTML}
                </div>
            </div>
        `;
    }

    // 渲染技能标签
    renderSkillTags(skills) {
        const skillsHTML = skills.map(skill => `
            <div class="skill-tag" style="--skill-color: ${skill.color}">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">
                    <div class="skill-progress" style="width: ${skill.level}%"></div>
                </div>
                <div class="skill-percentage">${skill.level}%</div>
            </div>
        `).join('');

        return `
            <div class="skills-section">
                <h2><i class="fas fa-tools"></i> 技能掌握</h2>
                <div class="skills-grid">
                    ${skillsHTML}
                </div>
            </div>
        `;
    }

    // 渲染最近仓库
    renderRecentRepos(repos) {
        const reposHTML = repos.map(repo => `
            <div class="repo-card">
                <div class="repo-header">
                    <h4 class="repo-name">
                        <i class="fas fa-folder"></i> ${repo.name}
                    </h4>
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <i class="fas fa-star"></i> ${repo.stars}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-branch"></i> ${repo.forks}
                        </span>
                    </div>
                </div>
                <p class="repo-description">${repo.description || '暂无描述'}</p>
                <div class="repo-footer">
                    <span class="repo-language" style="color: var(--primary-color)">
                        <i class="fas fa-circle"></i> ${repo.language || 'Unknown'}
                    </span>
                    <span class="repo-updated">
                        更新于 ${this.formatDate(repo.updated)}
                    </span>
                </div>
                <a href="${repo.url}" target="_blank" class="repo-link">
                    <i class="fas fa-external-link-alt"></i> 查看仓库
                </a>
            </div>
        `).join('');

        return `
            <div class="recent-repos-section">
                <h2><i class="fas fa-folder-open"></i> 最近项目</h2>
                <div class="repos-grid">
                    ${reposHTML}
                </div>
            </div>
        `;
    }

    // 渲染活动热力图
    renderActivityHeatmap(activityData) {
        // 简化版热力图，显示最近几个月的活动
        const recentData = activityData.slice(-90); // 最近90天
        const heatmapHTML = recentData.map(day => `
            <div class="activity-day level-${day.level}" 
                 title="${day.date}: ${day.count} 次提交">
            </div>
        `).join('');

        return `
            <div class="activity-section">
                <h2><i class="fas fa-chart-line"></i> 代码活动</h2>
                <div class="activity-heatmap">
                    <div class="heatmap-grid">
                        ${heatmapHTML}
                    </div>
                    <div class="heatmap-legend">
                        <span>少</span>
                        <div class="legend-scale">
                            <div class="legend-day level-0"></div>
                            <div class="legend-day level-1"></div>
                            <div class="legend-day level-2"></div>
                            <div class="legend-day level-3"></div>
                            <div class="legend-day level-4"></div>
                        </div>
                        <span>多</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染编程历程
    renderCodingJourney(data) {
        return `
            <div class="coding-journey-section">
                <h2><i class="fas fa-route"></i> 编程历程</h2>
                <div class="journey-timeline">
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>开始编程之旅</h4>
                            <p>2020年开始学习编程，从基础的HTML/CSS开始</p>
                            <span class="timeline-date">2020年3月</span>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>深入JavaScript</h4>
                            <p>掌握JavaScript基础，开始构建动态网页</p>
                            <span class="timeline-date">2020年8月</span>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>学习后端开发</h4>
                            <p>开始学习Node.js和Python，涉足全栈开发</p>
                            <span class="timeline-date">2021年6月</span>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>数据分析与AI</h4>
                            <p>专注于数据分析和人工智能领域的学习</p>
                            <span class="timeline-date">2022年9月</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染错误页面
    renderErrorPage() {
        return `
            <div class="error-page">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>加载失败</h2>
                    <p>无法加载编程统计数据，请稍后重试。</p>
                    <button onclick="blog.showPage('coding')" class="retry-btn">
                        <i class="fas fa-redo"></i> 重试
                    </button>
                </div>
            </div>
        `;
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays}天前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
        return `${Math.floor(diffDays / 365)}年前`;
    }
}

// 导出类
window.CodingTimeRenderer = CodingTimeRenderer;
