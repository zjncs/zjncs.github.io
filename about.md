---
layout: default
title: "关于我"
permalink: "/about/"
---

<div class="about-page">
    <header class="page-header">
        <h1 class="page-title">关于我</h1>
        <p class="page-subtitle">了解更多关于我的技术背景和经验</p>
    </header>

    <div class="about-content">
        <div class="about-main">
            <div class="profile-section">
                <div class="profile-avatar">
                    <img src="/assets/images/avatar.jpg" alt="头像" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="avatar-placeholder" style="display: none;">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                <div class="profile-info">
                    <h2>{{ site.author }}</h2>
                    <p class="profile-title">全栈开发工程师</p>
                    <div class="profile-links">
                        {% if site.github_username %}
                        <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i>
                            GitHub
                        </a>
                        {% endif %}
                        {% if site.linkedin_username %}
                        <a href="https://linkedin.com/in/{{ site.linkedin_username }}" target="_blank" rel="noopener">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </a>
                        {% endif %}
                        {% if site.email %}
                        <a href="mailto:{{ site.email }}">
                            <i class="fas fa-envelope"></i>
                            邮箱
                        </a>
                        {% endif %}
                    </div>
                </div>
            </div>

            <div class="bio-section">
                <h3>个人简介</h3>
                <p>
                    我是一名热爱技术的全栈开发工程师，专注于现代Web开发技术。拥有5年的软件开发经验，
                    精通前端和后端技术栈，对新技术有浓厚兴趣并善于将其应用到实际项目中。
                </p>
                <p>
                    我擅长解决复杂问题，具有良好的团队协作能力和项目管理经验。通过这个博客，我希望能够分享我在开发过程中的经验、学习心得以及对技术趋势的思考。如果你对我的文章有任何问题或建议，欢迎通过邮件或社交媒体与我联系。
                </p>
            </div>

            <div class="skills-section">
                <h3>技术栈</h3>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h4>前端开发</h4>
                        <div class="skill-tags">
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">TypeScript</span>
                            <span class="skill-tag">React/React Native</span>
                            <span class="skill-tag">Vue.js</span>
                            <span class="skill-tag">HTML5</span>
                            <span class="skill-tag">CSS3</span>
                            <span class="skill-tag">Sass/SCSS</span>
                            <span class="skill-tag">Webpack</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>后端开发</h4>
                        <div class="skill-tags">
                            <span class="skill-tag">Node.js</span>
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">Java</span>
                            <span class="skill-tag">Express</span>
                            <span class="skill-tag">Nest.js</span>
                            <span class="skill-tag">Spring</span>
                            <span class="skill-tag">RESTful API</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>数据库</h4>
                        <div class="skill-tags">
                            <span class="skill-tag">MySQL</span>
                            <span class="skill-tag">PostgreSQL</span>
                            <span class="skill-tag">MongoDB</span>
                            <span class="skill-tag">Redis</span>
                            <span class="skill-tag">Elasticsearch</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>工具与平台</h4>
                        <div class="skill-tags">
                            <span class="skill-tag">Git</span>
                            <span class="skill-tag">Docker</span>
                            <span class="skill-tag">AWS</span>
                            <span class="skill-tag">Azure</span>
                            <span class="skill-tag">Linux</span>
                            <span class="skill-tag">Webpack</span>
                            <span class="skill-tag">Vite</span>
                            <span class="skill-tag">CI/CD</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="experience-section">
                <h3>工作经验</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>高级前端工程师</h4>
                            <p class="company">某科技公司</p>
                            <p class="duration">2022年1月 - 至今</p>
                            <ul class="experience-list">
                                <li>负责公司核心产品的前端架构设计和开发，优化用户体验和性能</li>
                                <li>带领5人前端团队完成多个重要项目的技术攻关，按时交付高质量代码</li>
                                <li>推动前端工程化和自动化流程的建设，提高团队开发效率30%</li>
                                <li>设计并实现组件库，提升团队协作效率和产品一致性</li>
                            </ul>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>全栈开发工程师</h4>
                            <p class="company">某互联网公司</p>
                            <p class="duration">2020年3月 - 2021年12月</p>
                            <ul class="experience-list">
                                <li>参与多个Web应用的全栈开发，使用React和Node.js技术栈</li>
                                <li>负责RESTful API设计和数据库优化，提升系统响应速度40%</li>
                                <li>协助团队进行技术选型和架构决策，引入TypeScript提高代码质量</li>
                                <li>实现微服务架构转型，提高系统可扩展性和可维护性</li>
                            </ul>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4>前端开发工程师</h4>
                            <p class="company">某创业公司</p>
                            <p class="duration">2018年7月 - 2020年2月</p>
                            <ul class="experience-list">
                                <li>负责公司产品的前端开发和维护，使用Vue.js框架</li>
                                <li>与UI/UX设计师紧密合作，实现响应式设计和交互效果</li>
                                <li>优化前端性能，减少首屏加载时间50%</li>
                                <li>参与代码评审，指导初级开发人员提高技术能力</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="about-sidebar">
            <div class="stats-card">
                <h4>博客统计</h4>
                <div class="stats-grid about-stats">
                    <div class="stat-item">
                        <span class="stat-number">{{ site.posts.size }}</span>
                        <span class="stat-label">篇文章</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ site.categories.size }}</span>
                        <span class="stat-label">个分类</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ site.tags.size }}</span>
                        <span class="stat-label">个标签</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">5</span>
                        <span class="stat-label">年经验</span>
                    </div>
                </div>
            </div>

            <div class="contact-card">
                <h4>联系方式</h4>
                <div class="contact-info">
                    {% if site.email %}
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:{{ site.email }}">{{ site.email }}</a>
                    </div>
                <div class="profile-links about-links">
                    {% if site.github_username %}
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">
                            {{ site.github_username }}
                        </a>
                    </div>
                    {% endif %}
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>中国，深圳</span>
                    </div>
                </div>
            </div>

            <div class="recent-posts-card">
                <h4>最新文章</h4>
                <div class="recent-posts-list">
                    {% for post in site.posts limit:5 %}
                    <div class="recent-post-item">
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        <time>{{ post.date | date: "%m-%d" }}</time>
                    </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.about-links a {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    margin-right: 8px;
    margin-bottom: 8px;
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.2s ease;
}

.about-links a:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

.experience-list li {
    margin-bottom: 8px;
    position: relative;
    padding-left: 20px;
}

.experience-list li:before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--primary-color);
}

.about-stats .stat-item {
    background-color: var(--bg-secondary);
    padding: 12px;
    border-radius: var(--border-radius);
    transition: all 0.2s ease;
}

.about-stats .stat-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-color) 0px 5px 15px;
}
</style>