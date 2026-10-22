'use strict';

// Keep dated announcements and paper metadata together in source/_data/about.yml.
const escapeHtml = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const link = (url, label, className = '') => {
  if (!/^https:\/\//.test(url)) throw new Error('About links must use HTTPS');
  return `<a href="${escapeHtml(url)}"${className ? ` class="${escapeHtml(className)}"` : ''} target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
};

hexo.extend.tag.register('about_updates', function () {
  const data = hexo.locals.get('data').about;
  if (!data || !Array.isArray(data.news) || !Array.isArray(data.publications)) {
    throw new Error('Missing About news or publications data');
  }
  const news = data.news.map(item => `
    <li class="luka-news-item">
      <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.label)}</time>
      <div><span class="luka-news-kind">${escapeHtml(item.kind)}</span><p>${escapeHtml(item.text)} ${link(item.url, item.link_text)}</p></div>
    </li>`).join('');
  const publications = data.publications.map(item => {
    const authors = item.authors.map(author => author.self
      ? `<strong>${escapeHtml(author.name)}</strong>` : escapeHtml(author.name)).join(', ');
    return `<article class="luka-publication">
      <h3>${link(item.links[0].url, item.title)}</h3>
      <p class="luka-paper-authors">${authors}</p>
      <p class="luka-entry-note">${escapeHtml(item.venue)} · <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date_label)}</time></p>
      <p class="luka-entry-desc">${escapeHtml(item.description)}</p>
      <div class="luka-paper-links">${item.links.map(item => link(item.url, item.label)).join('')}</div>
    </article>`;
  }).join('');
  return `<section class="luka-section" aria-labelledby="about-news">
    <h2 class="luka-section-title" id="about-news">News</h2>
    <ul class="luka-news-list">${news}</ul>
  </section>
  <section class="luka-section" aria-labelledby="about-publications">
    <h2 class="luka-section-title" id="about-publications">Publications</h2>
    <div class="luka-publication-list">${publications}</div>
  </section>`;
});
