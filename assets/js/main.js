// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on links
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleScroll() {
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('.site-header');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
}

// Search Management
class SearchManager {
    constructor() {
        this.searchData = [];
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.bindEvents();
    }

    async loadSearchData() {
        try {
            const response = await fetch('/search.json');
            this.searchData = await response.json();
        } catch (error) {
            console.warn('Search data not available:', error);
        }
    }

    bindEvents() {
        const searchToggle = document.getElementById('search-toggle');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        if (searchToggle && searchOverlay) {
            searchToggle.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                searchInput.focus();
            });

            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });

            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                }
            });

            // Search functionality
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Keyboard navigation
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                }
            });
        }
    }

    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        
        if (!query.trim()) {
            searchResults.innerHTML = '';
            return;
        }

        const results = this.searchData.filter(post => {
            const searchText = `${post.title} ${post.content} ${post.tags.join(' ')} ${post.categories.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        }).slice(0, 10);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">没有找到相关文章</div>';
            return;
        }

        const resultsHTML = results.map(post => `
            <div class="search-result">
                <h4><a href="${post.url}">${this.highlightText(post.title, query)}</a></h4>
                <p>${this.highlightText(this.truncateText(post.content, 150), query)}</p>
                <div class="search-meta">
                    <time>${post.date}</time>
                    ${post.categories.length > 0 ? `<span class="category">${post.categories[0]}</span>` : ''}
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
}

// Back to Top Button
class BackToTopManager {
    constructor() {
        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
    }

    createButton() {
        const button = document.getElementById('back-to-top');
        if (button) {
            this.button = button;
        }
    }

    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            let ticking = false;
            const updateVisibility = () => {
                if (window.scrollY > 300) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateVisibility);
                    ticking = true;
                }
            });
        }
    }
}

// Table of Contents Generator
function generateTableOfContents() {
    const tocContent = document.getElementById('toc-content');
    const tocToggle = document.getElementById('toc-toggle');
    const postContent = document.querySelector('.post-content');
    
    if (!tocContent || !postContent) return;

    const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
        document.querySelector('.table-of-contents').style.display = 'none';
        return;
    }

    let tocHTML = '<ul class="toc-list">';
    let currentLevel = 0;

    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const id = `heading-${index}`;
        const text = heading.textContent;
        heading.id = id;

        if (level > currentLevel) {
            tocHTML += '<ul class="toc-sublist">'.repeat(level - currentLevel);
        } else if (level < currentLevel) {
            tocHTML += '</ul>'.repeat(currentLevel - level);
        }

        tocHTML += `<li class="toc-item toc-level-${level}">
            <a href="#${id}" class="toc-link" data-level="${level}">${text}</a>
        </li>`;
        currentLevel = level;
    });

    tocHTML += '</ul>'.repeat(currentLevel) + '</ul>';
    tocContent.innerHTML = tocHTML;

    // TOC toggle functionality
    if (tocToggle) {
        tocToggle.addEventListener('click', () => {
            const isCollapsed = tocContent.classList.contains('collapsed');
            tocContent.classList.toggle('collapsed', !isCollapsed);
            tocToggle.classList.toggle('collapsed');
        });
    }

    // Enhanced active section highlighting with smooth scrolling
    const tocLinks = tocContent.querySelectorAll('.toc-link');
    
    // Add smooth scroll behavior to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                tocLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for automatic highlighting
    const observerOptions = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-80px 0px -60% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        let mostVisibleEntry = null;
        let maxRatio = 0;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                mostVisibleEntry = entry;
                maxRatio = entry.intersectionRatio;
            }
        });
        
        if (mostVisibleEntry) {
            tocLinks.forEach(link => link.classList.remove('active'));
            const activeLink = tocContent.querySelector(`a[href="#${mostVisibleEntry.target.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                
                // Scroll TOC to show active item
                const tocContainer = tocContent.closest('.table-of-contents');
                if (tocContainer && tocContainer.scrollHeight > tocContainer.clientHeight) {
                    const linkTop = activeLink.offsetTop;
                    const containerTop = tocContainer.scrollTop;
                    const containerHeight = tocContainer.clientHeight;
                    
                    if (linkTop < containerTop || linkTop > containerTop + containerHeight - 40) {
                        tocContainer.scrollTo({
                            top: linkTop - containerHeight / 2,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
    
    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'toc-progress';
    progressBar.innerHTML = '<div class="toc-progress-bar"></div>';
    tocContent.parentNode.insertBefore(progressBar, tocContent);
    
    // Update progress on scroll
    let ticking = false;
    const updateProgress = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        const progressBarElement = progressBar.querySelector('.toc-progress-bar');
        progressBarElement.style.width = `${Math.min(progress, 100)}%`;
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    });
}

// Lazy Loading for Images
class LazyLoadManager {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }
}

// Animation on Scroll
class ScrollAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupAnimationObserver();
        }
    }

    setupAnimationObserver() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.post-card, .category-card, .featured-post, .timeline-item').forEach(el => {
            el.classList.add('animate-on-scroll');
            animationObserver.observe(el);
        });
    }
}

// Performance Monitoring
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        // Preload fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new SearchManager();
    new BackToTopManager();
    new LazyLoadManager();
    new ScrollAnimationManager();
    new PerformanceManager();

    // Add loading animation
    document.body.classList.add('loaded');
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Utility Functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }
};

// Export utils for global use
window.utils = utils;