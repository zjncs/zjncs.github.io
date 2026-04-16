---
title: About
date: 2025-11-22 10:00:00
type: "about"
top_img: false
aside: false
comments: false
---
{% raw %}
<link rel="stylesheet" href="/css/about-luka.css">

<div class="luka-about-page">
  <aside class="luka-sidebar">
    <div class="luka-profile-card">
      <div class="luka-profile-actions">
        <a class="luka-home-link" href="/">Home</a>
        <button id="lukaThemeToggle" class="luka-theme-toggle" type="button" aria-label="切换主题">
          <i class="fa-solid fa-moon"></i>
        </button>
      </div>

      <div class="luka-avatar">
        <img src="/img/avatar.png" alt="赵嘉宁">
      </div>

      <h1 class="luka-name">赵嘉宁</h1>
      <p class="luka-subtitle">Johnny Zhao</p>
      <p class="luka-email">
        <a href="mailto:zhaojianing@tju.edu.cn">zhaojianing@tju.edu.cn</a>
      </p>

      <div class="luka-social-icons">
        <a href="mailto:zhaojianing@tju.edu.cn" title="Email" aria-label="Email">
          <i class="fa-solid fa-envelope"></i>
        </a>
        <a href="https://github.com/zjncs" title="GitHub" aria-label="GitHub" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i>
        </a>
        <a href="/" title="Blog" aria-label="Blog">
          <i class="fa-solid fa-house"></i>
        </a>
        <a href="/archives/" title="Archives" aria-label="Archives">
          <i class="fa-solid fa-book-open"></i>
        </a>
      </div>

      <div class="luka-focus-card">
        <div class="luka-focus-title">Current Focus</div>
        <ul class="luka-focus-list">
          <li>Agent 与 GUI 自动化</li>
          <li>vLLM 推理优化与多模态适配</li>
          <li>RAG / Memory 系统与 AI 应用工程</li>
        </ul>
      </div>
    </div>
  </aside>

  <div class="luka-content">
    <section class="luka-section">
      <h2 class="luka-section-title">About Me</h2>
      <p>你好，我是赵嘉宁，目前在天津大学攻读信息管理与信息系统本科（2023.08 - 2027.06），加权成绩 90.07 / 100。我的兴趣主要集中在能真正落地到业务场景里的 AI 系统工程，尤其关注 Agent、GUI 自动化、推理服务优化以及长期记忆系统。</p>
      <p>相比只做一个能跑的 demo，我更在意模型能力怎样接入真实业务流程。我以 Python 为主，做过 GUI Agent、vLLM 推理服务优化、RAG / Memory 系统开发，也有 Vue + TypeScript、Java 与 Android 的工程经验。</p>
      <p>如果你想交流技术、项目、实习或开源协作，邮件和 GitHub 都可以直接联系我。</p>

      <div class="luka-chip-list">
        <span class="luka-chip">Python</span>
        <span class="luka-chip">GUI Agent</span>
        <span class="luka-chip">vLLM</span>
        <span class="luka-chip">RAG / Memory</span>
        <span class="luka-chip">Vue + TypeScript</span>
        <span class="luka-chip">Business AI Systems</span>
      </div>

      <div class="luka-link-row">
        <a href="https://github.com/zjncs" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i>
          GitHub
        </a>
        <a href="mailto:zhaojianing@tju.edu.cn">
          <i class="fa-solid fa-paper-plane"></i>
          Email Me
        </a>
        <a href="/archives/">
          <i class="fa-solid fa-rss"></i>
          Blog Archive
        </a>
      </div>
    </section>

    <section class="luka-section">
      <h2 class="luka-section-title">Education</h2>
      <div class="luka-card">
        <div class="luka-experience-item">
          <div class="luka-logo-badge">TJU</div>
          <div class="luka-experience-content">
            <p class="luka-exp-title"><strong>天津大学</strong></p>
            <p class="luka-exp-detail">信息管理与信息系统专业，本科在读</p>
            <p class="luka-exp-detail">加权成绩 90.07 / 100</p>
            <p class="luka-exp-period">2023.08 - 2027.06</p>
          </div>
        </div>
      </div>
    </section>

    <section class="luka-section">
      <h2 class="luka-section-title">Experience</h2>

      <div class="luka-card luka-timeline-item">
        <div class="luka-experience-item">
          <div class="luka-logo-badge">CM</div>
          <div class="luka-experience-content">
            <p class="luka-exp-title"><strong>中国移动杭州研发中心</strong></p>
            <p class="luka-exp-detail">医疗场景下的智能问诊 Agent 与长期记忆系统研究</p>
            <p class="luka-exp-detail">重点关注 Memory-Augmented LLM、长上下文、多轮对话与个性化追问能力</p>
            <p class="luka-exp-period">Medical Agent · Ongoing</p>
          </div>
        </div>
      </div>

      <div class="luka-card luka-timeline-item">
        <div class="luka-experience-item">
          <div class="luka-logo-badge">MS</div>
          <div class="luka-experience-content">
            <p class="luka-exp-title"><strong>华为 MindSpore × 上海人工智能实验室</strong></p>
            <p class="luka-exp-detail">参与 vLLM-MindSpore 推理插件研发</p>
            <p class="luka-exp-detail">负责多模态模型的适配、评测与性能优化</p>
            <p class="luka-exp-period">Inference System · Ongoing</p>
          </div>
        </div>
      </div>

      <div class="luka-card luka-timeline-item">
        <div class="luka-experience-item">
          <div class="luka-logo-badge">TII</div>
          <div class="luka-experience-content">
            <p class="luka-exp-title"><strong>清华大学智能产业研究院 AIoT 组</strong></p>
            <p class="luka-exp-detail">参与跨端 GUI Agent 系统研发</p>
            <p class="luka-exp-detail">关注 IDE、Client 与移动端之间的任务规划、脚本生成和自动执行</p>
            <p class="luka-exp-period">Cross-platform Agent · Ongoing</p>
          </div>
        </div>
      </div>
    </section>

    <section class="luka-section">
      <h2 class="luka-section-title">Projects</h2>
      <div class="luka-project-grid">
        <article class="luka-project-card">
          <h3>面向游戏开发者的 Agent 研究</h3>
          <p>关注程序化内容生成、交互叙事设计与大模型能力的结合，尝试把 Agent 能力接入游戏开发工作流。</p>
        </article>

        <article class="luka-project-card">
          <h3>开源协作与个人项目</h3>
          <p>在 Xiangshan、Kaiwu 等开源社区有过代码贡献，个人项目在 GitHub 获得过 100+ stars，持续关注工程质量与可复用性。</p>
          <div class="luka-link-row">
            <a class="luka-project-link" href="https://github.com/zjncs" target="_blank" rel="noopener">
              <i class="fa-brands fa-github"></i>
              View Profile
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="luka-section">
      <h2 class="luka-section-title">Selected Research</h2>
      <ol class="luka-research-list">
        <li>
          <div class="luka-research-title">车联网系统数据隐私保护与安全治理研究</div>
          <div class="luka-research-meta">SSCI 二区论文成果</div>
          <div class="luka-research-desc">完成数学建模、公式推导与论文整理，围绕车联网系统中的数据隐私保护与安全治理展开系统性研究。</div>
        </li>
        <li>
          <div class="luka-research-title">数据化餐饮服务系统下的消费者行为与运营管理策略研究</div>
          <div class="luka-research-meta">Data-Driven Operations Study</div>
          <div class="luka-research-desc">做多源数据整合与行为模式分析，为精细化运营、用户分层和服务策略优化提供支持。</div>
        </li>
        <li>
          <div class="luka-research-title">企业 ERP / CRM / 低代码流程场景中的 AI 应用探索</div>
          <div class="luka-research-meta">Applied AI Engineering</div>
          <div class="luka-research-desc">长期关注企业流程与数据驱动系统，更关心 AI 如何接上真实业务，而不是停留在展示层面的原型。</div>
        </li>
      </ol>
    </section>

    <section class="luka-section">
      <h2 class="luka-section-title">Awards</h2>
      <div class="luka-awards-grid">
        <div class="luka-award-item">
          <span class="luka-award-icon">🏆</span>
          <div class="luka-award-text"><strong>APMCM</strong> 亚太地区数学建模大赛一等奖</div>
        </div>
        <div class="luka-award-item">
          <span class="luka-award-icon">🥈</span>
          <div class="luka-award-text"><strong>MCM/ICM</strong> 美国大学生数学建模竞赛 H 奖</div>
        </div>
        <div class="luka-award-item">
          <span class="luka-award-icon">🤖</span>
          <div class="luka-award-text"><strong>Kaggle-NeurIPS 2024</strong> Lux AI Season 3 铜奖</div>
        </div>
        <div class="luka-award-item">
          <span class="luka-award-icon">⚛️</span>
          <div class="luka-award-text"><strong>量子信息技术与应用创新大赛</strong> 一等奖</div>
        </div>
      </div>
    </section>

    <div class="luka-credit">
      Inspired by <a href="https://github.com/wzsyyh/luka-homepage-template" target="_blank" rel="noopener">Luka Homepage Template</a> by <a href="https://wzsyyh.github.io/" target="_blank" rel="noopener">Yuheng Yang</a>.
    </div>
  </div>
</div>

<script src="/js/about-luka.js"></script>
{% endraw %}
