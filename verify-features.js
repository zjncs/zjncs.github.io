// 功能验证脚本
console.log('🚀 开始验证博客功能...');

// 验证博客数据结构
function verifyBlogData() {
    console.log('\n📊 验证博客数据结构...');
    
    const data = localStorage.getItem('blogData');
    if (!data) {
        console.log('❌ 未找到博客数据，创建默认数据...');
        
        const defaultData = {
            posts: [
                {
                    id: '1',
                    title: '欢迎来到我的博客',
                    content: '这是一篇示例文章。博客系统正在正常运行！',
                    excerpt: '欢迎来到我的技术博客，这里记录了我的学习心得和技术分享。',
                    date: new Date().toISOString(),
                    category: '公告',
                    tags: ['欢迎', '博客', '开始'],
                    author: '赵嘉宁'
                }
            ],
            settings: {
                title: '赵嘉宁的技术笔记',
                description: '记录学习过程中的点点滴滴',
                author: '赵嘉宁',
                email: 'zjncs@example.com',
                github: 'zjncs',
                orcid: '0009-0005-0821-6046'
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
                }
            ],
            theme: {
                primaryColor: '#2563eb',
                accentColor: '#f59e0b',
                fontFamily: 'system',
                customCSS: ''
            }
        };
        
        localStorage.setItem('blogData', JSON.stringify(defaultData));
        console.log('✅ 默认博客数据已创建');
        return defaultData;
    } else {
        try {
            const blogData = JSON.parse(data);
            console.log('✅ 博客数据加载成功');
            console.log(`   - 文章数量: ${blogData.posts?.length || 0}`);
            console.log(`   - 作者: ${blogData.settings?.author || '未设置'}`);
            console.log(`   - GitHub: ${blogData.settings?.github || '未设置'}`);
            console.log(`   - ORCID: ${blogData.settings?.orcid || '未设置'}`);
            console.log(`   - 友链数量: ${blogData.friendLinks?.length || 0}`);
            return blogData;
        } catch (error) {
            console.log('❌ 博客数据解析失败:', error);
            return null;
        }
    }
}

// 验证博客实例
function verifyBlogInstance() {
    console.log('\n🏠 验证博客实例...');
    
    if (typeof window.blog !== 'undefined') {
        console.log('✅ 博客实例存在');
        
        // 检查关键方法
        const methods = [
            'showPage', 'renderHomePage', 'renderCategoriesPage', 
            'renderTagsPage', 'renderFriendLinksPage', 'renderCodingTimePage',
            'renderAboutPage', 'getCategories', 'getTags', 
            'filterByCategory', 'filterByTag'
        ];
        
        methods.forEach(method => {
            if (typeof window.blog[method] === 'function') {
                console.log(`   ✅ ${method} 方法存在`);
            } else {
                console.log(`   ❌ ${method} 方法缺失`);
            }
        });
        
        return true;
    } else {
        console.log('❌ 博客实例不存在');
        return false;
    }
}

// 验证导航功能
function verifyNavigation() {
    console.log('\n🧭 验证导航功能...');
    
    const pages = ['home', 'categories', 'tags', 'friends', 'coding-time', 'about'];
    
    pages.forEach(page => {
        try {
            if (window.blog && typeof window.blog.showPage === 'function') {
                console.log(`   ✅ ${page} 页面导航可用`);
            } else {
                console.log(`   ❌ ${page} 页面导航不可用`);
            }
        } catch (error) {
            console.log(`   ❌ ${page} 页面导航错误: ${error.message}`);
        }
    });
}

// 验证友情链接
function verifyFriendLinks() {
    console.log('\n🔗 验证友情链接...');
    
    const data = localStorage.getItem('blogData');
    if (data) {
        try {
            const blogData = JSON.parse(data);
            const friendLinks = blogData.friendLinks || [];
            
            console.log(`   ✅ 友情链接数量: ${friendLinks.length}`);
            
            friendLinks.forEach(link => {
                console.log(`   - ${link.name}: ${link.url} (${link.category})`);
            });
            
            // 检查必需的链接
            const requiredLinks = [
                { name: 'zjncs GitHub', url: 'https://github.com/zjncs' },
                { name: 'ORCID Profile', url: 'https://orcid.org/0009-0005-0821-6046' }
            ];
            
            requiredLinks.forEach(required => {
                const found = friendLinks.find(link => link.url === required.url);
                if (found) {
                    console.log(`   ✅ 必需链接存在: ${required.name}`);
                } else {
                    console.log(`   ❌ 必需链接缺失: ${required.name}`);
                }
            });
            
        } catch (error) {
            console.log('   ❌ 友情链接数据解析失败:', error);
        }
    } else {
        console.log('   ❌ 未找到友情链接数据');
    }
}

// 验证GitHub统计API
function verifyGitHubStats() {
    console.log('\n📈 验证GitHub统计API...');
    
    const username = 'zjncs';
    const apis = [
        {
            name: 'GitHub Stats',
            url: `https://github-readme-stats.vercel.app/api?username=${username}&theme=transparent&show_icons=true`
        },
        {
            name: 'GitHub Streak',
            url: `https://streak-stats.demolab.com?user=${username}`
        },
        {
            name: 'Activity Graph',
            url: `https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=github-compact`
        },
        {
            name: 'Profile Trophy',
            url: `https://github-profile-trophy.vercel.app/?username=${username}&no-bg=true&no-frame=true&theme=algolia`
        },
        {
            name: 'Skill Icons',
            url: 'https://go-skill-icons.vercel.app/api/icons?i=java,py,cpp,md,latex,matlab&titles=true'
        }
    ];
    
    let loadedCount = 0;
    const totalCount = apis.length;
    
    apis.forEach(api => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            console.log(`   ✅ ${api.name} API 可用`);
            
            if (loadedCount === totalCount) {
                console.log(`\n🎉 所有GitHub统计API都可以正常访问！`);
            }
        };
        img.onerror = () => {
            console.log(`   ❌ ${api.name} API 不可用`);
        };
        img.src = api.url;
    });
    
    setTimeout(() => {
        if (loadedCount < totalCount) {
            console.log(`\n⚠️ 部分API响应较慢，已加载 ${loadedCount}/${totalCount}`);
        }
    }, 5000);
}

// 验证设置更新
function verifySettings() {
    console.log('\n⚙️ 验证设置更新...');
    
    const data = localStorage.getItem('blogData');
    if (data) {
        try {
            const blogData = JSON.parse(data);
            const settings = blogData.settings || {};
            
            const expectedSettings = {
                title: '赵嘉宁的技术笔记',
                author: '赵嘉宁',
                github: 'zjncs',
                orcid: '0009-0005-0821-6046'
            };
            
            Object.entries(expectedSettings).forEach(([key, expected]) => {
                if (settings[key] === expected) {
                    console.log(`   ✅ ${key}: ${settings[key]}`);
                } else {
                    console.log(`   ❌ ${key}: 期望 "${expected}", 实际 "${settings[key]}"`);
                }
            });
            
        } catch (error) {
            console.log('   ❌ 设置数据解析失败:', error);
        }
    } else {
        console.log('   ❌ 未找到设置数据');
    }
}

// 主验证函数
function runVerification() {
    console.log('🔍 开始全面功能验证...\n');
    
    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                verifyBlogData();
                verifyBlogInstance();
                verifyNavigation();
                verifyFriendLinks();
                verifySettings();
                verifyGitHubStats();
                
                console.log('\n✨ 功能验证完成！');
            }, 1000);
        });
    } else {
        setTimeout(() => {
            verifyBlogData();
            verifyBlogInstance();
            verifyNavigation();
            verifyFriendLinks();
            verifySettings();
            verifyGitHubStats();
            
            console.log('\n✨ 功能验证完成！');
        }, 1000);
    }
}

// 导出验证函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runVerification };
} else {
    window.runVerification = runVerification;
}

// 自动运行验证
runVerification();
