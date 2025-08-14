/*! ========================================================
 *  custom.js — Hexo Butterfly Enhanced Scripts
 *  Author: ChatGPT
 *  License: MIT
 *  Features:
 *    - Reading progress bar
 *    - Like button (permalink + LocalStorage)
 *    - Share buttons
 *    - PJAX compatibility (re-init on navigation)
 * ======================================================== */
(function () {
  'use strict';

  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded', fn)} }

  function onPjax(fn){
    document.addEventListener('pjax:complete', fn);
    document.addEventListener('pjax:success', fn);
    document.addEventListener('pjax:end', fn);
  }

  /* -------- Reading Progress -------- */
  function initReadingProgress(){
    const barId = 'reading-progress';
    let bar = document.getElementById(barId);
    if(!bar){
      bar = document.createElement('div');
      bar.id = barId;
      document.body.appendChild(bar);
    }
    const target = document.querySelector('.post-content, article.post-content, .post-content-wrap, .post');
    function calc(){
      if(!target){ bar.style.width = '0%'; return; }
      const rect = target.getBoundingClientRect();
      const docEl = document.documentElement;
      const top = rect.top + window.scrollY;
      const height = target.offsetHeight;
      const winH = window.innerHeight || docEl.clientHeight;
      const max = Math.max(1, height - winH);
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / max));
      bar.style.width = (progress*100).toFixed(2) + '%';
    }
    calc();
    window.removeEventListener('scroll', initReadingProgress.__handler || (()=>{}));
    const handler = ()=> requestAnimationFrame(calc);
    initReadingProgress.__handler = handler;
    window.addEventListener('scroll', handler, {passive:true});
    window.addEventListener('resize', handler);
  }

  /* -------- Like Button -------- */
  function initLikeButton(){
    const container = document.querySelector('.post-copyright, .post-meta, .post-footer, .post-tools');
    if(!container || container.querySelector('.post-like-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'post-like-btn';
    btn.innerHTML = '<i class="fas fa-heart"></i><span class="like-text">点赞</span><span class="like-count">0</span>';
    const key = 'like:' + (location.pathname || location.href);
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    const liked = localStorage.getItem(key+':liked') === '1';
    btn.querySelector('.like-count').textContent = String(count);
    if(liked) btn.classList.add('liked');
    btn.addEventListener('click', function(){
      let c = parseInt(localStorage.getItem(key) || '0', 10);
      const likedNow = localStorage.getItem(key+':liked') === '1';
      if(likedNow){
        // toggle off
        c = Math.max(0, c-1);
        localStorage.setItem(key+':liked','0');
        btn.classList.remove('liked');
      }else{
        c = c+1;
        localStorage.setItem(key+':liked','1');
        btn.classList.add('liked');
      }
      localStorage.setItem(key, String(c));
      btn.querySelector('.like-count').textContent = String(c);
    });
    container.appendChild(btn);
  }

  /* -------- Share Buttons -------- */
  function initShare(){
    const container = document.querySelector('.post-copyright, .post-meta, .post-footer, .post-tools');
    if(!container || container.querySelector('.share-group')) return;
    const url = encodeURIComponent(location.href);
    const title = encodeURIComponent(document.title);
    const group = document.createElement('div');
    group.className = 'share-group';
    const items = [
      {name:'Weibo', url:`https://service.weibo.com/share/share.php?title=${title}&url=${url}`},
      {name:'Twitter', url:`https://twitter.com/intent/tweet?text=${title}&url=${url}`},
      {name:'Facebook', url:`https://www.facebook.com/sharer/sharer.php?u=${url}`},
      {name:'LinkedIn', url:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`},
      {name:'QQ', url:`https://connect.qq.com/widget/shareqq/index.html?title=${title}&url=${url}`},
      {name:'Telegram', url:`https://t.me/share/url?url=${url}&text=${title}`}
    ];
    items.forEach(it=>{
      const a = document.createElement('a');
      a.className = 'share-btn';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.href = it.url;
      a.textContent = it.name;
      group.appendChild(a);
    });
    container.appendChild(group);
  }

  function boot(){
    initReadingProgress();
    initLikeButton();
    initShare();
  }

  ready(boot);
  onPjax(boot);
})();