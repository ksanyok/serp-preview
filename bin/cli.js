#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { serpPreview, previewUrl, renderHtml } from '../src/index.js';

const HELP = `Usage: serp-preview <url> [options]
       serp-preview --title "Page title" --description "Meta description" [--url URL]

Shows how a title and meta description will look in Google search results,
measured in pixels (Arial) rather than characters, with the truncation point.

Options:
  --title <text>        Title to preview (instead of fetching a URL)
  --description <text>  Meta description to preview
  --url <url>           URL shown above the title
  --mobile              Use mobile limits
  --html <file>         Also write an HTML file with a visual preview
  --json                Print JSON
  --strict              Exit with code 1 on warnings too
  -h, --help            Show this help

Online version (no install): https://promopilot.link/en/tools/serp-preview.php?utm_source=github&utm_medium=cli&utm_campaign=tools&utm_content=serp-preview
`;

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const value = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
if (!args.length || flag('-h') || flag('--help')) { process.stdout.write(HELP); process.exit(args.length ? 0 : 2); }

const color = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const ICON = { error: c(31, '✖'), warning: c(33, '!'), info: c(36, 'i') };
const valued = new Set(['--title', '--description', '--url', '--html']);
const device = flag('--mobile') ? 'mobile' : 'desktop';

try {
  const target = args.find((a, i) => !a.startsWith('-') && !valued.has(args[i - 1]));
  const p = value('--title') !== undefined
    ? serpPreview({ title: value('--title'), description: value('--description') || '', url: value('--url') || '' }, device)
    : await previewUrl(target, { device });
  if (value('--html')) writeFileSync(value('--html'), renderHtml(p));
  if (flag('--json')) console.log(JSON.stringify(p, null, 2));
  else {
    console.log(c(2, `  ${device} preview`));
    console.log('');
    if (p.url) console.log(`  ${c(2, p.url)}`);
    console.log(`  ${c(34, p.title)}`);
    const words = p.description.split(' ');
    let line = '';
    for (const w of words) { if ((line + w).length > 80) { console.log(`  ${line.trimEnd()}`); line = ''; } line += `${w} `; }
    if (line.trim()) console.log(`  ${line.trimEnd()}`);
    console.log('');
    console.log(`  ${c(1, 'Title width:')} ~${p.titleWidth}px${p.titleTruncated ? c(33, '  (truncated)') : c(32, '  (fits)')}`);
    console.log('');
    if (!p.issues.length) console.log(c(32, '✔ Title and description fit'));
    for (const i of p.issues) console.log(`  ${ICON[i.level]} ${i.message}`);
  }
  const failing = p.issues.filter((i) => i.level === 'error' || (flag('--strict') && i.level === 'warning'));
  process.exit(failing.length ? 1 : 0);
} catch (err) {
  console.error(c(31, `Error: ${err.message}`));
  process.exit(2);
}
