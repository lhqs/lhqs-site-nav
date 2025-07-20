// SEO增强功能
(function() {
    'use strict';

    // 页面加载性能监控
    function trackPagePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        // 发送性能数据到Google Analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'page_load_time', {
                                event_category: 'Performance',
                                event_label: 'Load Time',
                                value: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
                            });
                        }
                    }
                }, 0);
            });
        }
    }

    // 动态生成面包屑导航
    function generateBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbContainer = document.querySelector('[data-breadcrumb]');
        
        if (!breadcrumbContainer) return;

        const pathSegments = path.split('/').filter(segment => segment);
        let breadcrumbHTML = '<nav aria-label="面包屑导航" class="text-sm text-gray-600 mb-4">';
        breadcrumbHTML += '<a href="/" class="hover:text-blue-600">首页</a>';

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += '/' + segment;
            const isLast = index === pathSegments.length - 1;
            const segmentName = getSegmentName(segment);
            
            if (isLast) {
                breadcrumbHTML += ` <span class="mx-2">></span> <span class="text-gray-800">${segmentName}</span>`;
            } else {
                breadcrumbHTML += ` <span class="mx-2">></span> <a href="${currentPath}" class="hover:text-blue-600">${segmentName}</a>`;
            }
        });

        breadcrumbHTML += '</nav>';
        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    function getSegmentName(segment) {
        const segmentMap = {
            'search': '聚合搜索',
            'random': '任意门',
            'about': '关于',
            'page': '页面'
        };
        return segmentMap[segment] || segment;
    }

    // 自动生成页面描述（如果没有的话）
    function generateMetaDescription() {
        const existingDescription = document.querySelector('meta[name="description"]');
        if (existingDescription && existingDescription.content) return;

        const title = document.title;
        const firstParagraph = document.querySelector('p');
        let description = '';

        if (firstParagraph) {
            description = firstParagraph.textContent.substring(0, 160);
        } else {
            description = `${title} - 乱红如雨的个人导航站点，提供优质网址收藏和聚合搜索功能。`;
        }

        if (!existingDescription) {
            const metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            metaDesc.content = description;
            document.head.appendChild(metaDesc);
        } else {
            existingDescription.content = description;
        }
    }

    // 图片懒加载和SEO优化
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 添加loading="lazy"属性
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // 确保所有图片都有alt属性
            if (!img.hasAttribute('alt')) {
                const title = img.getAttribute('title') || img.getAttribute('data-title') || '图片';
                img.setAttribute('alt', title);
            }
        });
    }

    // 外部链接SEO优化
    function optimizeExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(link => {
            // 添加rel="noopener"属性（如果还没有的话）
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener');
            } else if (!link.getAttribute('rel').includes('noopener')) {
                link.setAttribute('rel', link.getAttribute('rel') + ' noopener');
            }
            
            // 添加target="_blank"（如果还没有的话）
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
    }

    // 结构化数据验证和增强
    function enhanceStructuredData() {
        // 为网站链接添加更多结构化数据
        const siteLinks = document.querySelectorAll('[itemtype="http://schema.org/WebSite"]');
        
        siteLinks.forEach(link => {
            const url = link.querySelector('[itemprop="url"]');
            const name = link.querySelector('[itemprop="name"]');
            
            if (url && name && !link.querySelector('[itemprop="description"]')) {
                const description = document.createElement('meta');
                description.setAttribute('itemprop', 'description');
                description.content = `访问${name.textContent} - 优质网站推荐`;
                link.appendChild(description);
            }
        });
    }

    // 页面标题动态优化
    function optimizePageTitle() {
        const currentTag = document.getElementById('tagActive');
        if (currentTag && currentTag.textContent) {
            const tag = currentTag.textContent.replace('#', '');
            if (tag && tag !== '高频访问') {
                document.title = `${tag}标签 - 乱红如雨 | 个人导航与聚合搜索`;
            }
        }
    }

    // 监听标签变化
    function observeTagChanges() {
        const tagActive = document.getElementById('tagActive');
        if (tagActive) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        optimizePageTitle();
                    }
                });
            });
            
            observer.observe(tagActive, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    // 添加JSON-LD结构化数据到页面
    function addDynamicStructuredData() {
        const currentTag = document.getElementById('tagActive');
        if (currentTag && currentTag.textContent) {
            const tag = currentTag.textContent.replace('#', '');
            
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": `${tag}标签 - 乱红如雨导航`,
                "description": `${tag}相关的优质网站收藏，精心筛选的网址导航`,
                "url": `${window.location.origin}/?${tag}`,
                "isPartOf": {
                    "@type": "WebSite",
                    "name": "乱红如雨 | 个人导航与聚合搜索",
                    "url": window.location.origin
                }
            };

            // 移除旧的动态结构化数据
            const oldScript = document.querySelector('script[data-dynamic-ld]');
            if (oldScript) {
                oldScript.remove();
            }

            // 添加新的结构化数据
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-dynamic-ld', 'true');
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    }

    // 初始化所有SEO增强功能
    function initSEOEnhancements() {
        // 页面加载完成后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initSEOEnhancements, 100);
            });
            return;
        }

        trackPagePerformance();
        generateBreadcrumbs();
        generateMetaDescription();
        optimizeImages();
        optimizeExternalLinks();
        enhanceStructuredData();
        observeTagChanges();
        
        // 延迟执行一些功能
        setTimeout(function() {
            addDynamicStructuredData();
        }, 1000);
    }

    // 启动SEO增强功能
    initSEOEnhancements();

})();