// 博客数据初始化脚本
console.log('📊 博客数据初始化脚本启动');

// 默认博客数据
const defaultBlogData = {
    posts: [
        {
            id: '1',
            title: '欢迎来到我的博客',
            slug: 'welcome-to-my-blog',
            content: `# 欢迎来到我的博客

这是我的第一篇博客文章！在这里我会分享技术心得、学习笔记和项目经验。

## 博客功能

- ✅ Markdown 支持
- ✅ 文章分类和标签
- ✅ 响应式设计
- ✅ 实时预览
- ✅ 文件上传
- ✅ 主题自定义

## 开始写作

点击右上角的"管理后台"按钮开始创建你的第一篇文章吧！

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

期待与你分享更多精彩内容！`,
            excerpt: '欢迎来到我的技术博客！这里将分享编程技巧、项目经验和学习心得。',
            category: '博客',
            tags: ['欢迎', '介绍', '博客'],
            date: new Date().toISOString(),
            updated: new Date().toISOString(),
            author: '赵嘉宁'
        },
        {
            id: '2',
            title: 'JavaScript 最佳实践',
            slug: 'javascript-best-practices',
            content: `# JavaScript 最佳实践

在日常开发中，遵循一些最佳实践可以让我们的代码更加健壮和易维护。

## 变量声明

使用 \`const\` 和 \`let\` 替代 \`var\`：

\`\`\`javascript
// 好的做法
const API_URL = 'https://api.example.com';
let userCount = 0;

// 避免
var userName = 'John';
\`\`\`

## 函数式编程

优先使用纯函数和不可变数据：

\`\`\`javascript
// 纯函数示例
const add = (a, b) => a + b;

// 数组操作
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
\`\`\`

## 错误处理

始终处理可能的错误：

\`\`\`javascript
try {
    const data = await fetchData();
    processData(data);
} catch (error) {
    console.error('处理数据时出错:', error);
}
\`\`\`

这些实践可以帮助我们写出更好的JavaScript代码。`,
            excerpt: '分享一些JavaScript开发中的最佳实践，包括变量声明、函数式编程和错误处理等方面。',
            category: '前端开发',
            tags: ['JavaScript', '最佳实践', '编程'],
            date: new Date(Date.now() - 86400000).toISOString(), // 昨天
            updated: new Date(Date.now() - 86400000).toISOString(),
            author: '赵嘉宁'
        },
        {
            id: '3',
            title: 'React Hooks 使用指南',
            slug: 'react-hooks-guide',
            content: `# React Hooks 使用指南

React Hooks 是React 16.8引入的新特性，让我们可以在函数组件中使用状态和其他React特性。

## useState Hook

管理组件状态：

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
        </div>
    );
}
\`\`\`

## useEffect Hook

处理副作用：

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);
    
    return user ? <div>{user.name}</div> : <div>加载中...</div>;
}
\`\`\`

## 自定义Hook

创建可复用的逻辑：

\`\`\`jsx
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };
    
    return [storedValue, setValue];
}
\`\`\`

Hooks让React开发变得更加简洁和强大！`,
            excerpt: '详细介绍React Hooks的使用方法，包括useState、useEffect和自定义Hook的实践。',
            category: '前端开发',
            tags: ['React', 'Hooks', '前端'],
            date: new Date(Date.now() - 172800000).toISOString(), // 前天
            updated: new Date(Date.now() - 172800000).toISOString(),
            author: '赵嘉宁'
        }
    ],
    settings: {
        title: '赵嘉宁的技术笔记',
        description: '记录学习过程中的点点滴滴',
        author: '赵嘉宁',
        email: 'zjncs@example.com',
        github: 'zjncs',
        orcid: '0009-0005-0821-6046',
        about: `# 关于我

你好！我是赵嘉宁，天津大学信息管理与信息系统专业的学生。

## 技术兴趣

我对以下技术领域有浓厚的兴趣：

- 📊 数据分析与可视化
- 🤖 人工智能与机器学习
- 🔧 后端开发与系统设计
- 🌐 Web开发技术

## 学习经历

在学习过程中，我积累了多个技术栈的经验，包括JavaScript、Python、Java等编程语言，以及React、Vue.js、Node.js等框架。

## 联系方式

欢迎通过以下方式与我交流：

- 📧 邮箱：zjncs@example.com
- 🐙 GitHub：https://github.com/zjncs
- 🎓 ORCID：https://orcid.org/0009-0005-0821-6046

期待与大家一起学习和成长！`
    },
    friendLinks: [
        {
            id: '1',
            name: 'zjncs GitHub',
            url: 'https://github.com/zjncs',
            description: '我的GitHub主页，记录代码历程',
            avatar: 'https://github.com/zjncs.png',
            category: '个人主页'
        },
        {
            id: '2',
            name: 'ORCID Profile',
            url: 'https://orcid.org/0009-0005-0821-6046',
            description: '学术身份标识，记录学术成果',
            avatar: 'https://orcid.org/assets/vectors/orcid.logo.icon.svg',
            category: '学术平台'
        },
        {
            id: '3',
            name: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/',
            description: 'Web开发者的最佳资源',
            avatar: 'https://developer.mozilla.org/favicon-48x48.cbbd161b5e05.png',
            category: '学习资源'
        },
        {
            id: '4',
            name: 'React 官方文档',
            url: 'https://react.dev/',
            description: 'React框架官方文档',
            avatar: 'https://react.dev/favicon.ico',
            category: '学习资源'
        }
    ],
    theme: {
        primaryColor: '#2d5a87',
        accentColor: '#d4a574',
        fontFamily: 'system',
        customCSS: ''
    }
};

// 初始化博客数据
function initBlogData() {
    console.log('🔄 检查博客数据...');
    
    const existingData = localStorage.getItem('blogData');
    
    if (!existingData) {
        console.log('📝 未找到博客数据，创建默认数据');
        localStorage.setItem('blogData', JSON.stringify(defaultBlogData));
        console.log('✅ 默认博客数据已创建');
        return defaultBlogData;
    } else {
        try {
            const parsed = JSON.parse(existingData);
            console.log('✅ 博客数据已存在，文章数量:', parsed.posts?.length || 0);
            return parsed;
        } catch (error) {
            console.error('❌ 博客数据解析失败，重新创建:', error);
            localStorage.setItem('blogData', JSON.stringify(defaultBlogData));
            return defaultBlogData;
        }
    }
}

// 验证数据完整性
function validateBlogData(data) {
    console.log('🔍 验证博客数据完整性...');
    
    if (!data.posts || !Array.isArray(data.posts)) {
        console.warn('⚠️ 文章数据不完整，修复中...');
        data.posts = defaultBlogData.posts;
    }
    
    if (!data.settings) {
        console.warn('⚠️ 设置数据不完整，修复中...');
        data.settings = defaultBlogData.settings;
    }
    
    if (!data.friendLinks) {
        console.warn('⚠️ 友链数据不完整，修复中...');
        data.friendLinks = defaultBlogData.friendLinks;
    }
    
    if (!data.theme) {
        console.warn('⚠️ 主题数据不完整，修复中...');
        data.theme = defaultBlogData.theme;
    }
    
    console.log('✅ 数据验证完成');
    return data;
}

// 立即执行初始化
const blogData = initBlogData();
const validatedData = validateBlogData(blogData);

// 如果数据有修复，重新保存
if (JSON.stringify(blogData) !== JSON.stringify(validatedData)) {
    localStorage.setItem('blogData', JSON.stringify(validatedData));
    console.log('🔧 数据已修复并保存');
}

// 导出到全局
window.defaultBlogData = defaultBlogData;
window.initBlogData = initBlogData;

console.log('✅ 博客数据初始化完成');
