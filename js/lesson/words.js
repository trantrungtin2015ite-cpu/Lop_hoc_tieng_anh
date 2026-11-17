// Bilingual text, tappable English words, word meanings and Vietnamese → English translation.

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- glossary index ---------- */
let GL = [], byForm = new Map(), byVi = new Map(), phraseRe = null;
export function setGlossary(list) {
  GL = list; byForm = new Map(); byVi = new Map();
  const forms = [];
  list.forEach((g) => {
    (g.forms || [g.en]).concat([g.en]).forEach((f) => { byForm.set(f.toLowerCase(), g); forms.push(f); });
    g.vi.split(/[,(]/).forEach((v) => { const k = v.replace(/\)/g, "").trim().toLowerCase(); if (k) byVi.set(k, g); });
  });
  forms.sort((a, b) => b.length - a.length);
  const alt = [...new Set(forms)].map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")).join("|");
  phraseRe = new RegExp("(?<![A-Za-z])(" + alt + ")(?![A-Za-z])", "gi");
}
export function glossFor(word) { return byForm.get(word.toLowerCase().replace(/\s+/g, " ")) || null; }

/* ---------- rendering ---------- */
// Split "text $math$ text" into parts.
function parts(s) {
  const out = [], re = /\$([^$]+)\$/g; let last = 0, m;
  while ((m = re.exec(s))) { if (m.index > last) out.push({ t: s.slice(last, m.index) }); out.push({ m: m[1] }); last = re.lastIndex; }
  if (last < s.length) out.push({ t: s.slice(last) });
  return out;
}
function mathSpan(tex) { return '<span class="m" data-tex="' + esc(tex) + '"></span>'; }

// Wrap glossary phrases and every other English word in tappable spans.
function tapText(t) {
  let html = "", last = 0;
  const wrapPlain = (s) => esc(s).replace(/[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g,
    (w) => '<span class="w" role="button" tabindex="0" data-w="' + w + '">' + w + "</span>");
  if (phraseRe) {
    phraseRe.lastIndex = 0; let m;
    while ((m = phraseRe.exec(t))) {
      html += wrapPlain(t.slice(last, m.index));
      const g = glossFor(m[1]);
      html += '<span class="w g" role="button" tabindex="0" data-w="' + esc(m[1]) + '" data-k="' + esc(g ? g.en : m[1]) + '">' + esc(m[1]) + "</span>";
      last = phraseRe.lastIndex;
    }
  }
  return html + wrapPlain(t.slice(last));
}
export function enHTML(s) { return parts(s).map((p) => (p.m != null ? mathSpan(p.m) : tapText(p.t))).join(""); }
export function viHTML(s) { return parts(s).map((p) => (p.m != null ? mathSpan(p.m) : esc(p.t))).join(""); }
// Both languages; CSS shows English, Vietnamese or both.
export function bi(o) { return '<span class="en">' + enHTML(o.en) + '</span><span class="vi">' + viHTML(o.vi) + "</span>"; }

export function renderMath(root) {
  if (!window.katex) { root.querySelectorAll(".m:not([data-done])").forEach((el) => { el.textContent = el.dataset.tex; }); return; }
  root.querySelectorAll(".m:not([data-done])").forEach((el) => {
    try { window.katex.render(el.dataset.tex, el, { throwOnError: false }); } catch (e) { el.textContent = el.dataset.tex; }
    el.dataset.done = "1";
  });
}
export function plain(s) { return s.replace(/\$[^$]*\$/g, " ").replace(/\s+/g, " ").trim(); }

/* ---------- machine translation (only when the glossary has no answer) ---------- */
const CACHE_KEY = "tr-cache-v1";
let cache = {};
try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (e) { cache = {}; }
function saveCache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {} }

async function machine(text, pair) {
  const key = pair + "|" + text.toLowerCase();
  if (cache[key]) return cache[key];
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + pair;
  const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    const j = await r.json();
    const out = j && j.responseData && j.responseData.translatedText;
    if (!out || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) return null;
    const clean = out.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    cache[key] = clean; saveCache();
    return clean;
  } catch (e) { return null; } finally { clearTimeout(tm); }
}

// English word or phrase → Vietnamese.
export async function meaningOf(word) {
  const g = glossFor(word);
  if (g) return { vi: g.vi, ex: g.ex, key: g.en, source: "gloss" };
  const vi = await machine(word, "en|vi");
  return { vi, ex: null, key: word.toLowerCase(), source: vi ? "machine" : "none" };
}

// Vietnamese → English. Exact glossary terms first, then the translation service.
export async function toEnglish(text) {
  const t = text.trim();
  const g = byVi.get(t.toLowerCase());
  if (g) return { en: g.en, source: "gloss" };
  const en = await machine(t, "vi|en");
  return { en, source: en ? "machine" : "none" };
}
