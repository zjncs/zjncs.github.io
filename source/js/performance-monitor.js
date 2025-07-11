// 性能监控脚本
// 监控 Core Web Vitals 和其他关键性能指标

(function() {
  'use strict';

  // 检查浏览器支持
  if (!('PerformanceObserver' in window)) {
    console.warn('Performance monitoring not supported in this browser');
    return;
  }

  // 性能指标收集器
  const performanceMetrics = {
    FCP: null,  // First Contentful Paint
    LCP: null,  // Largest Contentful Paint
    FID: null,  // First Input Delay
    CLS: null,  // Cumulative Layout Shift
    TTFB: null  // Time to First Byte
  };

  // 发送性能数据到控制台（生产环境可以发送到分析服务）
  function reportMetric(name, value, rating) {
    console.log(`[Performance] ${name}: ${value}ms (${rating})`);
    
    // 在开发环境显示性能提示
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      showPerformanceHint(name, value, rating);
    }
  }

  // 显示性能提示
  function showPerformanceHint(name, value, rating) {
    if (rating === 'poor') {
      console.warn(`⚠️ ${name} 性能较差 (${value}ms)，建议优化`);
    } else if (rating === 'good') {
      console.log(`✅ ${name} 性能良好 (${value}ms)`);
    }
  }

  // 获取性能评级
  function getPerformanceRating(name, value) {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // 监控 First Contentful Paint
  function observeFCP() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const value = Math.round(entry.startTime);
          const rating = getPerformanceRating('FCP', value);
          performanceMetrics.FCP = value;
          reportMetric('First Contentful Paint', value, rating);
        }
      }
    }).observe({ entryTypes: ['paint'] });
  }

  // 监控 Largest Contentful Paint
  function observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const value = Math.round(lastEntry.startTime);
      const rating = getPerformanceRating('LCP', value);
      performanceMetrics.LCP = value;
      reportMetric('Largest Contentful Paint', value, rating);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // 监控 First Input Delay
  function observeFID() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const value = Math.round(entry.processingStart - entry.startTime);
        const rating = getPerformanceRating('FID', value);
        performanceMetrics.FID = value;
        reportMetric('First Input Delay', value, rating);
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  // 监控 Cumulative Layout Shift
  function observeCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      const rating = getPerformanceRating('CLS', clsValue);
      performanceMetrics.CLS = clsValue;
      reportMetric('Cumulative Layout Shift', clsValue.toFixed(3), rating);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // 监控 Time to First Byte
  function observeTTFB() {
    new PerformanceObserver((entryList) => {
      const [pageNav] = entryList.getEntries();
      const value = Math.round(pageNav.responseStart - pageNav.requestStart);
      const rating = getPerformanceRating('TTFB', value);
      performanceMetrics.TTFB = value;
      reportMetric('Time to First Byte', value, rating);
    }).observe({ entryTypes: ['navigation'] });
  }

  // 监控资源加载性能
  function observeResourceTiming() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // 监控大型资源
        if (entry.transferSize > 100000) { // 大于 100KB
          console.warn(`⚠️ 大型资源: ${entry.name} (${Math.round(entry.transferSize / 1024)}KB)`);
        }
        
        // 监控慢速资源
        if (entry.duration > 1000) { // 超过 1 秒
          console.warn(`⚠️ 慢速资源: ${entry.name} (${Math.round(entry.duration)}ms)`);
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  // 创建性能仪表板（仅在开发环境）
  function createPerformanceDashboard() {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return;
    }

    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
    `;
    
    dashboard.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">性能监控</div>
      <div id="perf-metrics"></div>
      <button onclick="this.parentElement.style.display='none'" style="margin-top: 5px; background: #666; color: white; border: none; padding: 2px 5px; border-radius: 3px; cursor: pointer;">关闭</button>
    `;
    
    document.body.appendChild(dashboard);

    // 定期更新仪表板
    setInterval(() => {
      const metricsDiv = document.getElementById('perf-metrics');
      if (metricsDiv) {
        metricsDiv.innerHTML = Object.entries(performanceMetrics)
          .filter(([_, value]) => value !== null)
          .map(([name, value]) => `${name}: ${typeof value === 'number' ? Math.round(value) : value}`)
          .join('<br>');
      }
    }, 1000);
  }

  // 初始化性能监控
  function initPerformanceMonitoring() {
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();
    observeResourceTiming();
    
    // 在开发环境创建仪表板
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      createPerformanceDashboard();
    }

    // 页面卸载时报告最终指标
    window.addEventListener('beforeunload', () => {
      console.log('Final Performance Metrics:', performanceMetrics);
    });
  }

  // 等待 DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
  } else {
    initPerformanceMonitoring();
  }

})();
