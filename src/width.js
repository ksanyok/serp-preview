// Advance widths of Arial glyphs in 1/1000 em (from the standard Arial metrics), ASCII 32-126.
const ASCII = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015,
  667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611,
  278, 278, 278, 469, 556, 333,
  556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500,
  334, 260, 334, 584];

/** Approximate width of one character in 1/1000 em. */
export function charUnits(ch) {
  const code = ch.codePointAt(0);
  if (code >= 32 && code <= 126) return ASCII[code - 32];
  if (/[̀-ͯ​-‏️]/.test(ch)) return 0;
  if (/[ᄀ-ᇿ⺀-꓏가-힯豈-﫿＀-｠\u{1f300}-\u{1faff}]/u.test(ch)) return 1000;
  if (/[–—]/.test(ch)) return ch === '—' ? 1000 : 556;
  if (/[‘’‚]/.test(ch)) return 222;
  if (/[“”„«»]/.test(ch)) return 333;
  if (ch === '…') return 1000;
  if (ch === ' ') return 278;
  if (/[ШЩЖМЮЫшщжмюы]/.test(ch)) return ch === ch.toUpperCase() ? 900 : 760;
  if (/[iіїlI]/.test(ch)) return 222;
  return ch !== ch.toLowerCase() ? 690 : 540;
}

/** Width of a string in pixels at a given font size (Arial). */
export const textWidth = (text, fontPx) => [...String(text)].reduce((w, ch) => w + charUnits(ch), 0) * fontPx / 1000;

/**
 * Truncate text to fit a pixel width the way search results do: cut at a word
 * boundary and add an ellipsis.
 */
export function truncateToWidth(text, maxPx, fontPx) {
  const s = String(text).replace(/\s+/g, ' ').trim();
  if (textWidth(s, fontPx) <= maxPx) return { text: s, truncated: false, width: Math.round(textWidth(s, fontPx)) };
  const ell = textWidth(' …', fontPx);
  let out = '';
  for (const ch of s) {
    if (textWidth(out + ch, fontPx) + ell > maxPx) break;
    out += ch;
  }
  const cut = out.lastIndexOf(' ') > out.length * 0.6 ? out.slice(0, out.lastIndexOf(' ')) : out;
  const result = `${cut.replace(/[\s,;:.\-–—|]+$/, '')} …`;
  return { text: result, truncated: true, width: Math.round(textWidth(result, fontPx)) };
}
