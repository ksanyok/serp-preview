import { textWidth, truncateToWidth } from './width.js';
import { metaMap, text, strip, first } from './html.js';

export { textWidth, truncateToWidth, charUnits } from './width.js';

/** Layout limits used by the preview (approximations of Google's current result layout). */
export const LIMITS = {
  desktop: { titlePx: 600, titleFont: 20, descPx: 990, descFont: 14 },
  mobile: { titlePx: 760, titleFont: 18, descPx: 1300, descFont: 14 },
};

/** Breadcrumb-style URL as shown above the title. */
export function displayUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    return [`${u.protocol}//${u.hostname.replace(/^www\./, '')}`, ...parts].join(' › ');
  } catch { return url; }
}

/**
 * Build a search result preview and length checks.
 * @param {{title: string, description?: string, url?: string}} input
 * @param {'desktop'|'mobile'} [device]
 */
export function serpPreview({ title, description = '', url = '' }, device = 'desktop') {
  const L = LIMITS[device];
  const t = truncateToWidth(title || '', L.titlePx, L.titleFont);
  const d = truncateToWidth(description || '', L.descPx, L.descFont);
  const issues = [];
  const add = (level, code, message) => issues.push({ level, code, message });
  const tw = Math.round(textWidth(title || '', L.titleFont));
  if (!title) add('error', 'title-missing', 'Title is empty.');
  else if (t.truncated) add('warning', 'title-truncated', `Title is ~${tw}px wide (limit ~${L.titlePx}px on ${device}) and will be cut.`);
  else if (tw < L.titlePx * 0.45) add('info', 'title-short', `Title uses only ~${tw}px of ~${L.titlePx}px; there is room for a benefit or brand.`);
  if (!description) add('warning', 'description-missing', 'Description is empty; Google will choose text from the page.');
  else if (d.truncated) add('warning', 'description-truncated', `Description is ~${Math.round(textWidth(description, L.descFont))}px (about ${description.length} characters) and will be cut.`);
  else if (description.length < 70) add('info', 'description-short', `Description is ${description.length} characters; 120–160 uses the space you get.`);
  if (title && /^(home|untitled|index|new page)$/i.test(title.trim())) add('warning', 'title-generic', `"${title}" is a generic title.`);
  if (title && title === title.toUpperCase() && /[A-Z]{4}/.test(title)) add('info', 'title-caps', 'All-caps titles are often rewritten by Google.');
  return { device, url: displayUrl(url), title: t.text, titleTruncated: t.truncated, titleWidth: tw, description: d.text, descriptionTruncated: d.truncated, issues };
}

/** Fetch a page and preview its title and meta description. */
export async function previewUrl(url, options = {}) {
  const doFetch = options.fetch || globalThis.fetch;
  const start = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).toString();
  const res = await doFetch(start, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; serp-preview; +https://github.com/ksanyok/serp-preview)' } });
  const html = strip(await res.text());
  const head = /<head\b[\s\S]*?<\/head>/i.exec(html)?.[0] || html;
  const finalUrl = res.url || start;
  return serpPreview({ title: text(head, 'title') || '', description: first(metaMap(head).description) || '', url: finalUrl }, options.device);
}

/** Render a standalone HTML file with a Google-like result card. */
export function renderHtml(p) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const w = p.device === 'mobile' ? 360 : 600;
  return `<!doctype html><meta charset="utf-8"><title>SERP preview</title>
<body style="margin:40px;font-family:Arial,sans-serif;background:#fff">
<div style="max-width:${w}px"><div style="font-size:14px;color:#202124">${esc(p.url)}</div>
<div style="font-size:${LIMITS[p.device].titleFont}px;color:#1a0dab;line-height:1.3;margin:4px 0">${esc(p.title)}</div>
<div style="font-size:14px;color:#4d5156;line-height:1.58">${esc(p.description)}</div></div></body>`;
}
