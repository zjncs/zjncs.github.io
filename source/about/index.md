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

<div class="luka-about-shell">
  <div class="luka-topbar">
    <a class="luka-home-link" href="/">Home</a>
    <button id="lukaThemeToggle" class="luka-theme-toggle" type="button" aria-label="切换主题">
      <i class="fa-solid fa-moon"></i>
    </button>
  </div>

  <div class="luka-about-page">
    <aside class="luka-sidebar">
      <div class="luka-profile">
        <div class="luka-avatar">
          <img src="/img/about-avatar.jpg" alt="赵嘉宁">
        </div>

        <h1 class="luka-name">赵嘉宁</h1>
        <p class="luka-subtitle">Tianjin University Undergraduate</p>
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
          <a href="/" title="Homepage" aria-label="Homepage">
            <i class="fa-solid fa-house"></i>
          </a>
          <a href="/archives/" title="Archives" aria-label="Archives">
            <i class="fa-solid fa-book-open"></i>
          </a>
          <a href="/atom.xml" title="RSS" aria-label="RSS">
            <i class="fa-solid fa-rss"></i>
          </a>
        </div>

        <div class="luka-quick-facts">
          <p>Information Management and Information System</p>
          <p>Agent Systems · Inference · Product &amp; Open Source</p>
          <p>关注能真正接入业务流程的 AI 系统工程，而不只是能跑的 demo。</p>
        </div>
      </div>
    </aside>

    <main class="luka-content">
      <section class="luka-section">
        <h2 class="luka-section-title">Education</h2>
        <article class="luka-plain-entry">
          <div class="luka-entry-badge">TJU</div>
          <div class="luka-entry-main">
            <h3>天津大学</h3>
            <p class="luka-entry-role">信息管理与信息系统 · 本科在读</p>
            <p class="luka-entry-desc">主线兴趣是 Agent、推理系统与数据驱动 AI 应用工程，课程与实践长期围绕系统实现、模型落地和业务场景展开。</p>
            <p class="luka-entry-date">2023.08 - 2027.06 · GPA 90.07 / 100</p>
          </div>
        </article>
      </section>

      <section class="luka-section">
        <h2 class="luka-section-title">Research</h2>
        <div class="luka-timeline">
          <article class="luka-timeline-item">
            <div class="luka-entry-badge">AIR</div>
            <div class="luka-entry-main">
              <h3>清华大学智能产业研究院 AIoT 组</h3>
              <p class="luka-entry-role">科研经历 · 长期实习</p>
              <p class="luka-entry-desc">参与 <a href="https://openruyi.github.io/" target="_blank" rel="noopener">RuyiX</a> 跨端 GUI Agent 系统研发，负责任务编排、IDE 到端侧执行链路与 WebSocket 流式交互，打通桌面与移动端的自动执行闭环。</p>
              <p class="luka-entry-note">RuyiX · MobileClaw · Workflow Planning</p>
            </div>
          </article>

          <article class="luka-timeline-item">
            <div class="luka-entry-badge">PI</div>
            <div class="luka-entry-main">
              <h3>清华大学人机交互与普适计算实验室（PI lab）</h3>
              <p class="luka-entry-role">科研经历 · 长期实习</p>
              <p class="luka-entry-desc">面向游戏开发者实现叙事生成 Agent，整合知识检索、任务规划与工具调用，基于叙事拓扑和因果矩阵协同生成剧情节点、任务结构与关卡布局。</p>
              <p class="luka-entry-note">Narrative Agent · ACM CHI 2027 (planned)</p>
            </div>
          </article>
        </div>
      </section>

      <section class="luka-section">
        <h2 class="luka-section-title">Internships</h2>
        <div class="luka-timeline">
          <article class="luka-timeline-item">
            <div class="luka-entry-badge">CM</div>
            <div class="luka-entry-main">
              <h3>中国移动杭州研发中心</h3>
              <p class="luka-entry-role">研发实习生</p>
              <p class="luka-entry-desc">围绕医疗问诊与慢病管理场景构建 Agent 长期记忆模块，完成症状、用药和指标等医疗事实抽取与结构化存储，并优化长对话检索与问答流程。</p>
              <p class="luka-entry-date">2026.01 - 2026.03</p>
            </div>
          </article>

          <article class="luka-timeline-item">
            <div class="luka-entry-badge">MS</div>
            <div class="luka-entry-main">
              <h3>华为 MindSpore &amp; 上海人工智能实验室</h3>
              <p class="luka-entry-role">开源实习</p>
              <p class="luka-entry-desc">参与 vLLM-MindSpore 推理插件研发，完成 LLaVA-Next 的多模态适配与推理接口对齐，并接入 VLMEvalKit 构建国产推理链路评测流程。</p>
              <p class="luka-entry-date">2025.11 - 2026.06</p>
            </div>
          </article>

          <article class="luka-timeline-item">
            <div class="luka-entry-badge">YY</div>
            <div class="luka-entry-main">
              <h3>用友网络科技股份有限公司</h3>
              <p class="luka-entry-role">B 端实施工程师</p>
              <p class="luka-entry-desc">参与制造业 ERP 实施，梳理生产计划与库存流转流程，协同完成系统参数配置、低代码开发与问题复现，推动停滞项目重新上线。</p>
              <p class="luka-entry-date">2025.06 - 2025.08</p>
            </div>
          </article>

          <article class="luka-timeline-item">
            <div class="luka-entry-badge">CRM</div>
            <div class="luka-entry-main">
              <h3>北京东部世界机器人科技有限公司</h3>
              <p class="luka-entry-role">软件开发实习生</p>
              <p class="luka-entry-desc">基于 Vue + TypeScript 参与 CRM 客户管理系统开发，负责客户信息、跟进记录、筛选表单等页面实现，并完成接口联调。</p>
              <p class="luka-entry-date">2024.07 - 2024.08</p>
            </div>
          </article>
        </div>
      </section>

      <section class="luka-section">
        <h2 class="luka-section-title">Projects</h2>
        <div class="luka-compact-list">
          <article class="luka-compact-item">
            <h3>车联网系统数据隐私保护与安全治理研究</h3>
            <p class="luka-entry-role">科研项目 · 2023.09 - 2024.06</p>
            <p class="luka-entry-desc">独立使用 Mathematica 完成博弈建模、公式推导与关键验证，相关论文发表于 SSCI 二区。</p>
            <p class="luka-entry-note"><a href="https://doi.org/10.1002/mde.4290" target="_blank" rel="noopener">DOI: 10.1002/mde.4290</a></p>
          </article>

          <article class="luka-compact-item">
            <h3>数智化餐饮服务系统下消费者行为与运营管理策略研究</h3>
            <p class="luka-entry-role">国家级大创 · 2024.04 - 2026.03</p>
            <p class="luka-entry-desc">主导消费者行为数据分析，处理 9073 条交易记录与约 100 家企业运营数据，提炼 5 类关键行为模式，为餐饮企业精细化运营提供支撑。</p>
          </article>

          <article class="luka-compact-item">
            <h3>灵犀健康 / OpenLinkage</h3>
            <p class="luka-entry-role">个人项目 · Open Source</p>
            <p class="luka-entry-desc">面向智能健康管理场景的开源多 Agent 框架，围绕个性化健康咨询、长期状态理解与可扩展工具链设计，GitHub 已获 100+ stars。</p>
            <p class="luka-entry-note"><a href="https://github.com/zjncs/OpenLinkage" target="_blank" rel="noopener">github.com/zjncs/OpenLinkage</a></p>
          </article>
        </div>
      </section>

      <section class="luka-section">
        <h2 class="luka-section-title">Awards</h2>
        <ul class="luka-awards-list">
          <li>APMCM 亚太地区数学建模大赛一等奖</li>
          <li>美国大学生数学建模竞赛 H 奖</li>
          <li>Kaggle-NeurIPS 2024 Lux AI Season 3 铜奖</li>
          <li>能源经济学术创意大赛国家级特等奖</li>
          <li>量子信息技术与应用创新大赛一等奖</li>
          <li>天津大学三好学生 / 优秀学生干部</li>
        </ul>
      </section>

      <div class="luka-credit">
        Inspired by <a href="https://github.com/wzsyyh/luka-homepage-template" target="_blank" rel="noopener">Luka Homepage Template</a>.
      </div>
    </main>
  </div>
</div>

<script src="/js/about-luka.js"></script>
{% endraw %}
