import { marked } from 'marked';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// Configure marked
marked.setOptions({
  highlight: function(code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    }
    return code;
  }
});

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Posts data (same as in main.js - in a real app, this would be shared)
const posts = [
  {
    id: 'welcome-to-my-blog',
    title: '欢迎来到我的技术博客',
    date: '2024-01-15',
    categories: ['公告', '介绍'],
    tags: ['博客', '技术', '分享'],
    featured: true,
    excerpt: '欢迎来到我的技术分享博客！在这里，我将分享前端开发、编程技巧和技术见解。',
    content: `# 欢迎来到我的技术博客

欢迎来到我的技术分享博客！我是一名热爱技术的开发者，专注于前端开发和现代Web技术。

## 博客内容

在这个博客中，你将看到：

- **前端开发技巧**：React、Vue、JavaScript等
- **编程最佳实践**：代码质量、性能优化等
- **技术趋势分析**：新技术、新框架的深度解析
- **项目经验分享**：实际项目中的问题和解决方案

## 关于我

我有多年的前端开发经验，参与过多个大型项目的开发。我相信技术分享能够帮助更多的开发者成长。

感谢你的访问，希望这个博客能对你有所帮助！

\`\`\`javascript
console.log('欢迎来到我的博客！');
\`\`\`
`
  },
  {
    id: 'javascript-best-practices',
    title: 'JavaScript 最佳实践指南',
    date: '2024-01-20',
    categories: ['JavaScript', '最佳实践'],
    tags: ['JavaScript', '代码质量', '性能'],
    featured: true,
    excerpt: '掌握JavaScript最佳实践，写出更优雅、更高效的代码。',
    content: `# JavaScript 最佳实践指南

JavaScript是一门灵活的语言，但这种灵活性也可能导致代码质量问题。本文将介绍一些JavaScript最佳实践。

## 1. 使用严格模式

\`\`\`javascript
'use strict';

function myFunction() {
    // 严格模式下的代码
}
\`\`\`

## 2. 避免全局变量

\`\`\`javascript
// 不好的做法
var globalVar = 'I am global';

// 好的做法
(function() {
    var localVar = 'I am local';
})();
\`\`\`

## 3. 使用const和let

\`\`\`javascript
// 使用const声明常量
const API_URL = 'https://api.example.com';

// 使用let声明变量
let counter = 0;
\`\`\`

## 4. 函数式编程

\`\`\`javascript
// 使用map、filter、reduce等函数式方法
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
\`\`\`

遵循这些最佳实践，你的JavaScript代码将更加健壮和可维护。
`
  },
  {
    id: 'react-hooks-guide',
    title: 'React Hooks 完全指南',
    date: '2024-01-25',
    categories: ['React', '前端开发'],
    tags: ['React', 'Hooks', '状态管理'],
    featured: false,
    excerpt: '深入理解React Hooks，掌握现代React开发的核心概念。',
    content: `# React Hooks 完全指南

React Hooks是React 16.8引入的新特性，它让我们可以在函数组件中使用状态和其他React特性。

## useState Hook

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
\`\`\`

## useEffect Hook

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = \`You clicked \${count} times\`;
    });
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
\`\`\`

## 自定义Hook

\`\`\`jsx
function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(initialValue);
    
    return { count, increment, decrement, reset };
}
\`\`\`

Hooks让React开发变得更加简洁和强大！
`
  },
  {
    id: 'css-grid-layout',
    title: 'CSS Grid 布局完全指南',
    date: '2024-01-30',
    categories: ['CSS', '布局'],
    tags: ['CSS', 'Grid', '响应式设计'],
    featured: false,
    excerpt: '学习CSS Grid布局，创建复杂而灵活的网页布局。',
    content: `# CSS Grid 布局完全指南

CSS Grid是一个强大的二维布局系统，可以帮助我们创建复杂的网页布局。

## 基本概念

\`\`\`css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 100px 200px;
    gap: 20px;
}
\`\`\`

## 网格项目定位

\`\`\`css
.item1 {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
}

.item2 {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
}
\`\`\`

## 响应式网格

\`\`\`css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
\`\`\`

## 网格区域

\`\`\`css
.container {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

CSS Grid让布局变得前所未有的简单和强大！
`
  }
];

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Load and render post
function loadPost() {
  if (!postId) {
    document.getElementById('post-body').innerHTML = '<p>未找到文章ID</p>';
    return;
  }
  
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    document.getElementById('post-body').innerHTML = '<p>文章不存在</p>';
    return;
  }
  
  // Update page title
  document.title = `${post.title} - 技术分享博客`;
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-title-display').textContent = post.title;
  
  // Update meta information
  const formattedDate = format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN });
  document.getElementById('post-date').textContent = formattedDate;
  document.getElementById('post-date').setAttribute('datetime', post.date);
  
  // Update categories
  const categoriesContainer = document.getElementById('post-categories');
  categoriesContainer.innerHTML = post.categories.map(cat => 
    `<span class="category">${cat}</span>`
  ).join('');
  
  // Update tags
  const tagsContainer = document.getElementById('post-tags');
  tagsContainer.innerHTML = post.tags.map(tag => 
    `<span class="tag">#${tag}</span>`
  ).join('');
  
  // Render content
  const contentHtml = marked(post.content);
  document.getElementById('post-body').innerHTML = contentHtml;
  
  // Highlight code blocks
  Prism.highlightAll();
  
  // Setup navigation
  setupPostNavigation(post);
}

function setupPostNavigation(currentPost) {
  const currentIndex = posts.findIndex(p => p.id === currentPost.id);
  const prevPost = posts[currentIndex + 1];
  const nextPost = posts[currentIndex - 1];
  
  const prevContainer = document.getElementById('prev-post');
  const nextContainer = document.getElementById('next-post');
  
  if (prevPost) {
    prevContainer.innerHTML = `
      <a href="/post.html?id=${prevPost.id}">
        <span class="nav-label">← 上一篇</span>
        <span class="nav-title">${prevPost.title}</span>
      </a>
    `;
  }
  
  if (nextPost) {
    nextContainer.innerHTML = `
      <a href="/post.html?id=${nextPost.id}">
        <span class="nav-label">下一篇 →</span>
        <span class="nav-title">${nextPost.title}</span>
      </a>
    `;
  }
}

// Event listeners
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Initialize
initTheme();
loadPost();