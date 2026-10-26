import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textWidth, truncateToWidth, serpPreview, previewUrl, displayUrl, renderHtml, charUnits } from '../src/index.js';

const codes = (p) => p.issues.map((i) => i.code);

test('measures text with Arial metrics', () => {
  assert.equal(textWidth('i', 20), 4.44);
  assert.equal(textWidth('W', 20), 18.88);
  assert.ok(textWidth('WWWW', 20) > textWidth('iiii', 20) * 3);
  assert.equal(charUnits('中'), 1000);
  assert.ok(textWidth('Привет', 20) > 50);
});

test('truncates at a word boundary with an ellipsis', () => {
  const r = truncateToWidth('alpha beta gamma delta epsilon zeta eta theta', 150, 20);
  assert.equal(r.truncated, true);
  assert.ok(r.text.endsWith(' …'));
  assert.ok(r.width <= 150);
  assert.ok(!r.text.includes('the …'));
  assert.deepEqual(truncateToWidth('short', 600, 20), { text: 'short', truncated: false, width: 44 });
});

test('previews and flags long titles and descriptions', () => {
  const p = serpPreview({ title: 'The Complete Guide to Technical SEO Audits for Large E-commerce Websites', description: 'word '.repeat(60), url: 'https://www.example.com/blog/seo-audit' });
  assert.equal(p.url, 'https://example.com › blog › seo-audit');
  assert.ok(p.titleTruncated);
  assert.ok(codes(p).includes('title-truncated'));
  assert.ok(codes(p).includes('description-truncated'));
});

test('flags missing, short and generic snippets', () => {
  assert.ok(codes(serpPreview({ title: '' })).includes('title-missing'));
  const c = codes(serpPreview({ title: 'Home', description: 'Hi' }));
  for (const code of ['title-short', 'title-generic', 'description-short']) assert.ok(c.includes(code), code);
  assert.ok(codes(serpPreview({ title: 'BUY CHEAP SHOES NOW' })).includes('title-caps'));
  assert.ok(codes(serpPreview({ title: 'A fine title for a page' })).includes('description-missing'));
});

test('mobile allows longer titles', () => {
  const title = 'The Complete Guide to Technical SEO Audits for Large Online Shops';
  assert.equal(serpPreview({ title }, 'desktop').titleTruncated, true);
  assert.equal(serpPreview({ title }, 'mobile').titleTruncated, false);
});

test('fetches a page and renders HTML', async () => {
  const html = '<html><head><title>Widgets &amp; Gadgets</title><meta name="description" content="Everything about widgets."></head></html>';
  const p = await previewUrl('example.com/w', { fetch: async () => new Response(html) });
  assert.equal(p.title, 'Widgets & Gadgets');
  assert.equal(p.url, 'https://example.com › w');
  assert.match(renderHtml(p), /Widgets &amp; Gadgets/);
  assert.equal(displayUrl('not a url'), 'not a url');
});
