// =========================================
// WENAMY CMS CONTENT LOADER
// Fetches markdown files from /content/*
// Parses YAML frontmatter into JSON
// Exports: getBlogPosts(), getProperties(), getOffPlanProjects()
// =========================================

// ---- FRONTMATTER PARSER ----
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  const raw = match[1];
  const body = match[2].trim();
  const data = {};

  // Parse simple YAML key: value pairs (flat, no nested objects needed for our schema)
  raw.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays: ["a", "b"] or [a, b]
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        data[key] = JSON.parse(value.replace(/'/g, '"'));
      } catch (e) {
        data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      return;
    }

    // Parse numbers
    if (!isNaN(value) && value !== '') {
      data[key] = Number(value);
      return;
    }

    data[key] = value;
  });

  return { data, content: body };
}

// ---- FETCH MARKDOWN FROM GITHUB RAW (bypasses CDN cache with timestamp) ----
async function fetchMarkdownFile(path) {
  const url = `${path}?_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.text();
}

// ---- INDEX FILE FETCHER ----
// Decap CMS doesn't create an index, so we try a manifest or GitHub API
async function fetchContentIndex(folder) {
  // Try a static manifest file first: /content/{folder}/index.json
  try {
    const res = await fetch(`/content/${folder}/index.json?_=${Date.now()}`);
    if (res.ok) {
      const json = await res.json();
      return json; // Expected: ["file1.md", "file2.md", ...]
    }
  } catch (e) { /* ignore */ }

  // Fallback: try GitHub API (works when deployed, not blocked by CORS)
  try {
    const apiUrl = `https://api.github.com/repos/saintkarimm/WENAMY-3/contents/content/${folder}`;
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const files = await res.json();
      return files
        .filter(f => f.name.endsWith('.md') && f.name !== '.gitkeep')
        .map(f => f.name);
    }
  } catch (e) { /* ignore */ }

  return [];
}

// ---- LOAD ALL MARKDOWN FILES FROM A FOLDER ----
async function loadContentFolder(folder) {
  const fileNames = await fetchContentIndex(folder);
  if (!fileNames.length) return [];

  const results = await Promise.allSettled(
    fileNames.map(async (name) => {
      const text = await fetchMarkdownFile(`/content/${folder}/${name}`);
      const { data, content } = parseFrontmatter(text);
      // Add slug derived from filename (strip date prefix + .md)
      const slug = name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      return { ...data, slug, body: content };
    })
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

// ---- PUBLIC API ----

/**
 * Returns array of blog post objects from /content/blog/
 * Each object: { title, date, image, summary, body, tags, slug }
 */
async function getBlogPosts() {
  const posts = await loadContentFolder('blog');
  // Sort by date descending
  return posts.sort((a, b) => {
    const da = a.date ? new Date(a.date) : 0;
    const db = b.date ? new Date(b.date) : 0;
    return db - da;
  });
}

/**
 * Returns array of property objects from /content/properties/
 * Each object: { title, status, location, type, price, bedrooms, bathrooms, area, image, gallery, description, slug }
 */
async function getProperties() {
  return loadContentFolder('properties');
}

/**
 * Returns array of off-plan project objects from /content/offplan/
 * Each object: { title, location, developer, price_from, completion_date, category, image, gallery, description, slug }
 */
async function getOffPlanProjects() {
  return loadContentFolder('offplan');
}

// Expose globally for use by non-module scripts
window.CMS = window.CMS || {};
window.CMS.getBlogPosts = getBlogPosts;
window.CMS.getProperties = getProperties;
window.CMS.getOffPlanProjects = getOffPlanProjects;
