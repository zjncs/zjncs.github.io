// Coding Time 统计和GitHub集成模块
// 展示编程时间、GitHub统计、活动图表等

class CodingTimeStats {
    constructor() {
        this.githubUsername = 'zjncs';
        this.orcidId = '0009-0005-0821-6046';
        this.cache = new Map();
        this.cacheExpiry = 10 * 60 * 1000; // 10分钟缓存
    }

    // 获取GitHub用户信息
    async getGitHubProfile() {
        const cacheKey = 'github-profile';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`https://api.github.com/users/${this.githubUsername}`);
            if (!response.ok) throw new Error('GitHub API请求失败');
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('获取GitHub资料失败:', error);
            return this.getMockGitHubProfile();
        }
    }

    // 获取GitHub仓库统计
    async getGitHubRepos() {
        const cacheKey = 'github-repos';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`https://api.github.com/users/${this.githubUsername}/repos?sort=updated&per_page=100`);
            if (!response.ok) throw new Error('GitHub仓库API请求失败');
            
            const repos = await response.json();
            const stats = this.analyzeRepos(repos);
            this.setCache(cacheKey, stats);
            return stats;
        } catch (error) {
            console.error('获取GitHub仓库失败:', error);
            return this.getMockRepoStats();
        }
    }

    // 分析仓库数据
    analyzeRepos(repos) {
        const languages = {};
        let totalStars = 0;
        let totalForks = 0;
        const recentRepos = [];

        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            
            if (recentRepos.length < 6) {
                recentRepos.push({
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    url: repo.html_url,
                    updated: repo.updated_at
                });
            }
        });

        return {
            totalRepos: repos.length,
            totalStars,
            totalForks,
            languages,
            recentRepos,
            publicRepos: repos.filter(r => !r.private).length
        };
    }

    // 生成编程语言统计图表
    generateLanguageChart(languages) {
        const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
        const sortedLangs = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        const colors = [
            '#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#89e051',
            '#f34b7d', '#00d4aa', '#ff6b6b', '#4ecdc4', '#45b7d1'
        ];

        return sortedLangs.map(([lang, count], index) => ({
            language: lang,
            count,
            percentage: ((count / total) * 100).toFixed(1),
            color: colors[index % colors.length]
        }));
    }

    // 生成GitHub活动热力图数据（模拟）
    generateActivityHeatmap() {
        const data = [];
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const date = new Date(d);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // 模拟活动强度（工作日更活跃）
            const baseActivity = isWeekend ? 0.3 : 0.7;
            const randomFactor = Math.random();
            const activity = Math.floor(baseActivity * randomFactor * 4);

            data.push({
                date: date.toISOString().split('T')[0],
                count: activity,
                level: activity
            });
        }

        return data;
    }

    // 缓存管理
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Mock数据（当API不可用时）
    getMockGitHubProfile() {
        return {
            login: this.githubUsername,
            name: '赵嘉宁',
            bio: '天津大学信息管理与信息系统专业学生，专注于数据分析、AI和后端开发',
            public_repos: 25,
            followers: 42,
            following: 38,
            created_at: '2020-03-15T00:00:00Z',
            avatar_url: `https://github.com/${this.githubUsername}.png`
        };
    }

    getMockRepoStats() {
        return {
            totalRepos: 25,
            totalStars: 156,
            totalForks: 23,
            publicRepos: 22,
            languages: {
                'JavaScript': 8,
                'Python': 6,
                'TypeScript': 4,
                'Java': 3,
                'HTML': 2,
                'CSS': 2
            },
            recentRepos: [
                {
                    name: 'zjncs.github.io',
                    description: '个人技术博客网站',
                    language: 'JavaScript',
                    stars: 12,
                    forks: 3,
                    url: `https://github.com/${this.githubUsername}/zjncs.github.io`,
                    updated: new Date().toISOString()
                },
                {
                    name: 'data-analysis-toolkit',
                    description: '数据分析工具集',
                    language: 'Python',
                    stars: 28,
                    forks: 7,
                    url: `https://github.com/${this.githubUsername}/data-analysis-toolkit`,
                    updated: new Date(Date.now() - 86400000).toISOString()
                }
            ]
        };
    }

    // 计算编程经验年数
    calculateCodingYears() {
        const startDate = new Date('2020-03-15'); // 假设的开始编程日期
        const now = new Date();
        const years = (now - startDate) / (1000 * 60 * 60 * 24 * 365.25);
        return Math.floor(years * 10) / 10; // 保留一位小数
    }

    // 生成技能标签
    getSkillTags() {
        return [
            { name: 'JavaScript', level: 85, color: '#f1e05a' },
            { name: 'Python', level: 80, color: '#3572A5' },
            { name: 'TypeScript', level: 75, color: '#3178c6' },
            { name: 'React', level: 70, color: '#61dafb' },
            { name: 'Node.js', level: 75, color: '#339933' },
            { name: 'Vue.js', level: 65, color: '#4FC08D' },
            { name: 'Java', level: 60, color: '#ED8B00' },
            { name: 'SQL', level: 70, color: '#336791' },
            { name: 'Git', level: 80, color: '#F05032' },
            { name: 'Docker', level: 55, color: '#2496ED' }
        ];
    }

    // 生成编程统计摘要
    async generateCodingStats() {
        const profile = await this.getGitHubProfile();
        const repoStats = await this.getGitHubRepos();
        const languageChart = this.generateLanguageChart(repoStats.languages);
        const activityData = this.generateActivityHeatmap();
        const skillTags = this.getSkillTags();
        const codingYears = this.calculateCodingYears();

        return {
            profile,
            repoStats,
            languageChart,
            activityData,
            skillTags,
            codingYears,
            totalCommits: this.estimateTotalCommits(activityData),
            averageCommitsPerDay: this.calculateAverageCommits(activityData)
        };
    }

    // 估算总提交数
    estimateTotalCommits(activityData) {
        return activityData.reduce((total, day) => total + day.count, 0);
    }

    // 计算平均每日提交数
    calculateAverageCommits(activityData) {
        const totalCommits = this.estimateTotalCommits(activityData);
        return (totalCommits / activityData.length).toFixed(1);
    }
}

// 导出类
window.CodingTimeStats = CodingTimeStats;
