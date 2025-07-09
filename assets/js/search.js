// Search functionality for Jekyll blog
class BlogSearch {
    constructor() {
        this.searchData = [];
        this.fuse = null;
        this.init();
    }

    async init() {
        await this.loadSearchData();
        await this.initializeFuse();
    }

    async loadSearchData() {
        try {
            const response = await fetch('/search.json');
            if (response.ok) {
                this.searchData = await response.json();
            }
        } catch (error) {
            console.warn('Could not load search data:', error);
        }
    }

    async initializeFuse() {
        // Load Fuse.js library if not already loaded
        if (typeof Fuse === 'undefined') {
            try {
                await this.loadFuseLibrary();
            } catch (error) {
                console.warn('Failed to load Fuse.js, falling back to simple search');
                return;
            }
        }

        // Configure Fuse.js options for intelligent search
        const fuseOptions = {
            keys: [
                {
                    name: 'title',
                    weight: 0.4  // Higher weight for title matches
                },
                {
                    name: 'excerpt',
                    weight: 0.3
                },
                {
                    name: 'content',
                    weight: 0.2
                },
                {
                    name: 'tags',
                    weight: 0.05
                },
                {
                    name: 'categories',
                    weight: 0.05
                }
            ],
            threshold: 0.4,  // Lower threshold = more strict matching
            distance: 100,   // Maximum distance for fuzzy matching
            minMatchCharLength: 2,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
            useExtendedSearch: true
        };

        this.fuse = new Fuse(this.searchData, fuseOptions);
    }

    async loadFuseLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    search(query, limit = 10) {
        if (!query || query.length < 2) {
            return [];
        }

        if (this.fuse) {
            // Use Fuse.js for intelligent fuzzy search
            const fuseResults = this.fuse.search(query, { limit });
            return fuseResults.map(result => ({
                ...result.item,
                score: result.score,
                matches: result.matches
            }));
        } else {
            // Fallback to simple search
            return this.simpleSearch(query, limit);
        }
    }

    simpleSearch(query, limit) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        
        return this.searchData
            .map(post => {
                let score = 0;
                const titleLower = post.title.toLowerCase();
                const contentLower = (post.content + ' ' + post.excerpt).toLowerCase();

                searchTerms.forEach(term => {
                    // Title matches get higher score
                    if (titleLower.includes(term)) {
                        score += titleLower === term ? 10 : 5;
                    }
                    
                    // Content matches
                    const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
                    score += contentMatches;
                    
                    // Tag/category exact matches
                    if (post.tags && post.tags.some(tag => tag.toLowerCase() === term)) {
                        score += 3;
                    }
                    if (post.categories && post.categories.some(cat => cat.toLowerCase() === term)) {
                        score += 3;
                    }
                });

                return { ...post, score };
            })
            .filter(post => post.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const searchTerms = query.split(' ').filter(term => term.length > 1);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="search-highlight">$1</mark>');
        });
        
        return highlightedText;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    renderResults(results, query) {
        if (results.length === 0) {
            return `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>没有找到包含 "${query}" 的文章</p>
                    <small>尝试使用不同的关键词或检查拼写</small>
                </div>
            `;
        }

        return results.map(post => `
            <article class="search-result">
                <div class="search-result-header">
                    <h3 class="search-result-title">
                        <a href="${post.url}">${this.highlightText(post.title, query)}</a>
                    </h3>
                    <div class="search-result-meta">
                        <time class="search-result-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(post.date)}
                        </time>
                        ${post.categories && post.categories.length > 0 ? `
                            <span class="search-result-category">
                                <i class="fas fa-folder"></i>
                                ${post.categories[0]}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <p class="search-result-excerpt">
                    ${this.highlightText(this.truncateText(post.excerpt || post.content), query)}
                </p>
                ${post.score ? `<div class="search-score">相关度: ${Math.round((1 - post.score) * 100)}%</div>` : ''}
                ${post.tags && post.tags.length > 0 ? `
                    <div class="search-result-tags">
                        ${post.tags.slice(0, 3).map(tag => `
                            <span class="search-result-tag">${tag}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </article>
        `).join('');
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const blogSearch = new BlogSearch();
    
    // Search input handling
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                const results = blogSearch.search(query);
                searchResults.innerHTML = blogSearch.renderResults(results, query);
                
                // Add click tracking for search results
                searchResults.querySelectorAll('.search-result a').forEach(link => {
                    link.addEventListener('click', () => {
                        // Track search result clicks if analytics is available
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'search_result_click', {
                                search_term: query,
                                result_url: link.href
                            });
                        }
                    });
                });
            }, 300);
        });
        
        // Search suggestions (optional)
        searchInput.addEventListener('focus', () => {
            if (!searchInput.value && blogSearch.searchData.length > 0) {
                // Show popular tags or recent posts as suggestions
                const suggestions = blogSearch.searchData
                    .slice(0, 5)
                    .map(post => `
                        <div class="search-suggestion">
                            <a href="${post.url}">
                                <i class="fas fa-clock"></i>
                                ${post.title}
                            </a>
                        </div>
                    `).join('');
                
                searchResults.innerHTML = `
                    <div class="search-suggestions">
                        <h4>最近文章</h4>
                        ${suggestions}
                    </div>
                `;
            }
        });
        
        // Keyboard navigation for search results
        searchInput.addEventListener('keydown', (e) => {
            const results = searchResults.querySelectorAll('.search-result a');
            let currentIndex = Array.from(results).findIndex(link => 
                link.classList.contains('keyboard-focus')
            );
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < results.length - 1) {
                        if (currentIndex >= 0) {
                            results[currentIndex].classList.remove('keyboard-focus');
                        }
                        results[currentIndex + 1].classList.add('keyboard-focus');
                        results[currentIndex + 1].focus();
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        results[currentIndex].classList.remove('keyboard-focus');
                        results[currentIndex - 1].classList.add('keyboard-focus');
                        results[currentIndex - 1].focus();
                    } else if (currentIndex === 0) {
                        results[0].classList.remove('keyboard-focus');
                        searchInput.focus();
                    }
                    break;
                    
                case 'Enter':
                    if (currentIndex >= 0) {
                        results[currentIndex].click();
                    }
                    break;
            }
        });
    }
});

// Add search styles
const searchStyles = `
<style>
.search-result {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}

.search-result:hover {
    background-color: var(--bg-secondary);
}

.search-result:last-child {
    border-bottom: none;
}

.search-result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 1rem;
}

.search-result-title {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.3;
}

.search-result-title a {
    color: var(--text-color);
    text-decoration: none;
}

.search-result-title a:hover {
    color: var(--primary-color);
}

.search-result-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    white-space: nowrap;
}

.search-result-date,
.search-result-category {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.search-result-category {
    background-color: var(--primary-color);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
}

.search-result-excerpt {
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.search-result-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.search-result-tag {
    background-color: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
}

.search-no-results {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
}

.search-no-results i {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: block;
}

.search-suggestions {
    padding: 1rem;
}

.search-suggestions h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.search-suggestion {
    margin-bottom: 0.5rem;
}

.search-suggestion a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.search-suggestion a:hover {
    background-color: var(--bg-secondary);
    color: var(--primary-color);
}

.keyboard-focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

mark {
    background-color: var(--accent-color);
    color: var(--text-color);
    padding: 0.1em 0.2em;
    border-radius: 2px;
}

@media (max-width: 768px) {
    .search-result-header {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .search-result-meta {
        justify-content: flex-start;
    }
}
</style>
`;

// Inject search styles
document.head.insertAdjacentHTML('beforeend', searchStyles);