/* Minimal client-side loader for markdown blog posts.
   Frontmatter is a small YAML subset (key: value, key: [a, b]) — no library needed. */

const POSTS_DIR = '/content/blog/';
const MANIFEST_URL = POSTS_DIR + 'manifest.json';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, fmBlock, body] = match;
  const data = {};

  fmBlock.split('\n').forEach(line => {
    const lineMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!lineMatch) return;
    const [, key, rawValue] = lineMatch;
    let value = rawValue.trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }

    data[key] = value;
  });

  return { data, content: body.trim() };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function fetchManifest() {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error('Could not load blog manifest');
  return res.json();
}

async function fetchPost(filename) {
  const res = await fetch(POSTS_DIR + filename);
  if (!res.ok) throw new Error('Could not load post: ' + filename);
  const raw = await res.text();
  return parseFrontmatter(raw);
}

function tagsMarkup(tags) {
  if (!tags || !tags.length) return '';
  return `<div class="post-tags">${tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}</div>`;
}

async function renderPostList(container) {
  try {
    const manifest = await fetchManifest();
    const posts = await Promise.all(manifest.map(fetchPost));

    posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

    if (!posts.length) {
      container.innerHTML = '<p class="post-empty">No posts yet — check back soon.</p>';
      return;
    }

    container.innerHTML = posts.map(({ data }) => `
      <a class="post-card" href="/blog/post.html?slug=${encodeURIComponent(data.slug)}">
        <div class="post-card-meta">${formatDate(data.date)}</div>
        <h3 class="post-card-title">${data.title}</h3>
        <p class="post-card-excerpt">${data.excerpt || ''}</p>
        ${tagsMarkup(data.tags)}
      </a>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p class="post-empty">Couldn\'t load posts right now. Please try again shortly.</p>';
    console.error(err);
  }
}

async function renderPost(container) {
  const slug = new URLSearchParams(window.location.search).get('slug');

  if (!slug) {
    container.innerHTML = '<p class="post-empty">No post specified. <a href="/blog/">Back to blog</a>.</p>';
    return;
  }

  try {
    const { data, content } = await fetchPost(slug + '.md');

    document.title = `${data.title} — Faraz Saleem`;

    container.innerHTML = `
      <div class="post-header">
        <div class="post-card-meta">${formatDate(data.date)}</div>
        <h1 class="post-title">${data.title}</h1>
        ${tagsMarkup(data.tags)}
      </div>
      <div class="post-body">${marked.parse(content)}</div>
      <div class="post-footer-nav">
        <a class="btn" href="/blog/">&larr; All posts</a>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="post-empty">Post not found. <a href="/blog/">Back to blog</a>.</p>`;
    console.error(err);
  }
}
