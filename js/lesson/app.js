// Interactive bilingual lesson, presented like Prezi on every screen.
// All slides sit on one large plane. Moving between slides, the camera pulls back to show
// the path, then zooms into the next slide. Phones use tall frames, wide screens use wide frames.
import LESSON from "./data-don-dieu.js";
import { setGlossary, bi, enHTML, viHTML, renderMath, esc, meaningOf, toEnglish, glossFor, stressHTML, boiHTML } from "./words.js";
import { makeStats } from "./stats.js";
import { makeBoard, boardCaption } from "./board.js";
import { MONO } from "./pack-mono.js";
import { S, speakEn, RATES, setRate, showBoi, setBoi } from "./shim.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TEACHER = new URLSearchParams(location.search).has("gv");
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const stats = makeStats(LESSON.id);
setGlossary(LESSON.glossary);

const root = document.documentElement;
const N = LESSON.slides.length;
let lang = "both";
try { lang = localStorage.getItem("lesson-lang") || "both"; } catch (e) {}
let cur = 0, overview = false, shape = "", FR = { w: 1280, h: 720 }, POS = [], camNow = null, anim = null;

// Interface wording follows the language switch: English only in EN mode, otherwise Vietnamese.
const L = (vi, en) => (lang === "en" ? en : vi);
// Translation sheets follow the direction of translation, not the mode switch:
// English → Vietnamese sheets are fully Vietnamese, Vietnamese → English is fully English.
const VI = (vi) => vi, EN = (vi, en) => en;

/* ---------- icons ---------- */
const I = {
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/></svg>',
  tr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h8M8 4v2M6 6c0 4 3 7 6 8M10 6c0 3-2 6-6 8"/><path d="M13 20l4-9 4 9M14.5 17h5"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  speed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16a8 8 0 1116 0"/><path d="M12 16l4-5"/></svg>'
};

/* ---------- slide content ---------- */
function bbtSVG() {
  // Variation table of y = x^3 - 3x. Every label sits inside a clear cell, away from lines.
  const t = (x, y, s, cls) => '<text x="' + x + '" y="' + y + '" class="' + (cls || "") + '" text-anchor="middle" dominant-baseline="central">' + s + "</text>";
  const ar = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="ar" marker-end="url(#ah)"/>';
  return '<svg class="bbt" viewBox="0 0 640 214" role="img" aria-label="Bảng biến thiên của y = x³ − 3x">' +
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" class="ahd"/></marker></defs>' +
    '<rect x="1" y="1" width="638" height="212" rx="12" class="fr"/>' +
    '<line x1="90" y1="1" x2="90" y2="213" class="gl"/><line x1="1" y1="52" x2="639" y2="52" class="gl"/><line x1="1" y1="104" x2="639" y2="104" class="gl"/>' +
    t(45, 27, "x", "lb") + t(45, 78, "y′", "lb") + t(45, 158, "y", "lb") +
    t(130, 27, "−∞") + t(290, 27, "−1") + t(450, 27, "1") + t(596, 27, "+∞") +
    t(210, 78, "+", "pos") + t(290, 78, "0") + t(370, 78, "−", "neg") + t(450, 78, "0") + t(523, 78, "+", "pos") +
    t(130, 190, "−∞") + t(290, 122, "2") + t(450, 190, "−2") + t(596, 122, "+∞") +
    ar(150, 182, 270, 130) + ar(310, 130, 430, 182) + ar(470, 182, 576, 130) + "</svg>";
}
function titleArt() {
  // The lesson's own curve, drawn in when the title slide opens.
  let d = "";
  for (let k = 0; k <= 80; k++) { const x = -2.15 + 4.3 * k / 80, y = x * x * x - 3 * x; d += (k ? "L" : "M") + (300 + x * 125).toFixed(1) + " " + (200 - y * 52).toFixed(1); }
  return '<svg class="t-art" viewBox="0 0 600 400" aria-hidden="true"><line x1="20" y1="200" x2="580" y2="200" class="ax"/><line x1="300" y1="20" x2="300" y2="380" class="ax"/>' +
    '<path d="' + d + '" class="cv" pathLength="1"/><circle cx="175" cy="96" r="9" class="pt"/><circle cx="425" cy="304" r="9" class="pt"/></svg>';
}
function blockHTML(b, si, k) {
  const st = ' style="--k:' + k + '"';
  switch (b.type) {
    case "p": return '<p class="b-p"' + st + ">" + bi(b) + "</p>";
    case "hint": return '<p class="b-hint"' + st + ">" + bi(b) + "</p>";
    case "note": return '<div class="b-note"' + st + ">" + bi(b) + "</div>";
    case "list": return '<ul class="b-list"' + st + ">" + b.items.map((x) => "<li>" + bi(x) + "</li>").join("") + "</ul>";
    case "steps": return '<ol class="b-steps"' + st + ">" + b.items.map((x, i) => '<li style="--k:' + (k + i) + '"><span class="n">' + (i + 1) + "</span><div>" + bi(x) + "</div></li>").join("") + "</ol>";
    case "graph": return '<div class="b-graph"' + st + '><svg class="board" id="board-' + si + '" viewBox="0 0 380 256" role="img" aria-label="Đồ thị y = x³ − 3x"></svg><p class="cap" id="cap-' + si + '"></p></div>';
    case "bbt": return '<div class="b-bbt"' + st + ">" + bbtSVG() + "</div>";
    case "quiz":
      return '<div class="b-quiz"' + st + ' data-q="' + si + "-" + k + '"><p class="qq">' + bi(b.q) + '</p><div class="qo">' +
        b.options.map((o, i) => '<button type="button" class="opt" data-i="' + i + '"><span class="k">' + "ABC"[i] + '</span><span class="ot"><span class="en">' + enHTML(o.en) + '</span><span class="vi">' + viHTML(o.vi) + '</span></span><span class="ok">' + I.check + "</span></button>").join("") +
        '</div><div class="qe" hidden>' + bi(b.explain) + "</div></div>";
    case "say":
      return '<div class="b-say"' + st + ">" + '<div class="say-rate"></div>' + b.items.map((x) => '<div class="row"><button type="button" class="spk" data-say="' + esc(x.en) + '" aria-label="Nghe câu này">' + I.speak + "</button><div>" + bi(x) + "</div></div>").join("") + "</div>";
    case "mystats": return '<div class="b-mystats" id="mystats"' + st + "></div>";
  }
  return "";
}
function slideHTML(s, i) {
  const title = s.kind === "title";
  return '<section class="slide tone-' + (s.tone || "blue") + (s.kind ? " k-" + s.kind : "") + '" data-i="' + i + '" aria-label="' + esc(s.title.vi) + '">' +
    (title ? titleArt() : "") +
    '<header class="s-head"><span class="s-num">' + (title ? '<span class="en">' + esc(LESSON.grade.en) + '</span><span class="vi">' + esc(LESSON.grade.vi) + "</span>" : String(i).padStart(2, "0")) + "</span><h2>" + bi(s.title) + "</h2></header>" +
    '<div class="s-body">' + s.blocks.map((b, k) => blockHTML(b, i, k)).join("") + "</div></section>";
}

/* ---------- page shell ---------- */
function shell() {
  document.body.innerHTML =
    '<main id="stage"><div id="plane"><svg id="path" aria-hidden="true"></svg>' + LESSON.slides.map(slideHTML).join("") + "</div></main>" +
    '<header class="topbar"><a class="home" href="./" aria-label="Về trang chủ">Lớp học song ngữ</a>' +
    '<div class="seg" role="group" aria-label="Ngôn ngữ"><button type="button" data-l="en">EN</button><button type="button" data-l="both">EN + VI</button><button type="button" data-l="vi">VI</button></div>' +
    '<div class="tools">' + (TEACHER ? '<button type="button" class="ic" id="inviteBtn" aria-label="Mời học sinh">' + I.qr + "</button>" : "") +
    '<button type="button" class="ic rate" id="rateBtn" aria-label="Tốc độ đọc">' + I.speed + '<span id="rateTxt"></span></button>' +
    '<button type="button" class="ic" id="ovBtn" aria-label="Xem toàn bài">' + I.grid + "</button></div></header>" +
    '<nav class="bottombar"><button type="button" class="ic nav" id="prev" aria-label="Phần trước">' + I.prev + "</button>" +
    '<div class="dots" id="dots">' + LESSON.slides.map((s, i) => '<button type="button" data-i="' + i + '" aria-label="Phần ' + (i + 1) + '"></button>').join("") + "</div>" +
    '<button type="button" class="ic nav" id="next" aria-label="Phần sau">' + I.next + "</button>" +
    '<button type="button" class="trbtn" id="trBtn">' + I.tr + "<span>Việt → Anh</span></button></nav>" +
    '<button type="button" class="selbtn" id="selBtn" hidden>Dịch đoạn này</button>' +
    '<p class="toast" id="toast" hidden></p>' +
    '<div class="scrim" id="scrim" hidden></div><div class="sheet" id="sheet" role="dialog" aria-modal="true" hidden></div>';
}

/* ---------- plane layout ---------- */
function layout() {
  const portrait = window.innerWidth < window.innerHeight * 0.95;
  const sh = portrait ? "tall" : "wide";
  if (sh === shape) return false;
  shape = sh; root.dataset.shape = sh;
  FR = portrait ? { w: 720, h: 1180 } : { w: 1280, h: 720 };
  root.style.setProperty("--fw", FR.w + "px"); root.style.setProperty("--fh", FR.h + "px");
  const gx = FR.w + (portrait ? 220 : 300), amp = FR.h * (portrait ? 0.32 : 0.5);
  const rot = [0, -3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5, 0];
  POS = LESSON.slides.map((s, i) => ({ x: i * gx, y: Math.round(Math.sin(i * 1.15) * amp), r: rot[i % rot.length] }));
  $$(".slide").forEach((el, i) => { el.style.transform = "translate(" + (POS[i].x - FR.w / 2) + "px," + (POS[i].y - FR.h / 2) + "px) rotate(" + POS[i].r + "deg)"; });
  drawPath(); fitSlides();
  return true;
}
function drawPath() {
  // A dotted backdrop and a curved trail through the slide centres: the journey you see when the camera pulls back.
  const pad = 2400, xs = POS.map((p) => p.x), ys = POS.map((p) => p.y);
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.max(...xs) - Math.min(...xs) + pad * 2, h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  let d = "M" + (POS[0].x - x0) + " " + (POS[0].y - y0);
  for (let i = 1; i < POS.length; i++) {
    const a = POS[i - 1], b = POS[i], mx = (a.x + b.x) / 2;
    d += " C" + (mx - x0) + " " + (a.y - y0) + " " + (mx - x0) + " " + (b.y - y0) + " " + (b.x - x0) + " " + (b.y - y0);
  }
  const svg = $("#path");
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.style.cssText = "left:" + x0 + "px;top:" + y0 + "px;width:" + w + "px;height:" + h + "px";
  svg.innerHTML = '<defs><pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2.4" class="dt"/></pattern></defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#dots)"/><path d="' + d + '" class="trail"/>';
}
// Frames are fixed in size: shrink a slide's text until everything fits.
function fitSlides() {
  $$(".slide").forEach((el) => {
    let fs = el.classList.contains("k-title") ? 36 : 32;
    el.style.fontSize = fs + "px";
    while (el.scrollHeight > FR.h + 1 && fs > 18) { fs -= 1; el.style.fontSize = fs + "px"; }
  });
}

/* ---------- camera ---------- */
function view() {
  const W = window.innerWidth, H = window.innerHeight, top = 60, bot = 84;
  return { W, H, cx: W / 2, cy: top + (H - top - bot) / 2, aw: W - 24, ah: H - top - bot - 12 };
}
function camFor(i) {
  const v = view(), p = POS[i];
  return { x: p.x, y: p.y, r: p.r, s: Math.min(v.aw / FR.w, v.ah / FR.h) };
}
function camAll() {
  const v = view(), xs = POS.map((p) => p.x), ys = POS.map((p) => p.y);
  const w = Math.max(...xs) - Math.min(...xs) + FR.w * 1.2, h = Math.max(...ys) - Math.min(...ys) + FR.h * 1.2;
  return { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2, r: 0, s: Math.min(v.aw / w, v.ah / h) };
}
function T(c) { const v = view(); return "translate(" + v.cx + "px," + v.cy + "px) scale(" + c.s + ") rotate(" + -c.r + "deg) translate(" + -c.x + "px," + -c.y + "px)"; }
function moveCam(to, how) {
  const plane = $("#plane");
  if (anim) { anim.cancel(); anim = null; }
  const from = camNow || to;
  camNow = to;
  plane.style.transform = T(to);
  if (how === "jump" || REDUCED || !plane.animate) return;
  let frames;
  if (how === "hop") {
    // Pull back far enough to see both slides, then dive into the new one.
    const v = view(), dx = Math.abs(to.x - from.x) + FR.w * 1.25, dy = Math.abs(to.y - from.y) + FR.h * 1.25;
    const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2, r: (from.r + to.r) / 2, s: Math.min(v.aw / dx, v.ah / dy, from.s * 0.62) };
    frames = [{ transform: T(from) }, { transform: T(mid), offset: 0.48 }, { transform: T(to) }];
  } else frames = [{ transform: T(from) }, { transform: T(to) }];
  anim = plane.animate(frames, { duration: how === "hop" ? 1250 : 900, easing: "cubic-bezier(.62,0,.24,1)" });
  anim.onfinish = () => { anim = null; };
}

/* ---------- navigation ---------- */
function go(i, how) {
  const n = Math.max(0, Math.min(N - 1, i));
  if (n === cur && !overview && how !== "jump") return;
  cur = n; overview = false; root.classList.remove("ov");
  moveCam(camFor(cur), how || "hop");
  update();
}
function update() {
  $$(".slide").forEach((el, i) => el.classList.toggle("on", i === cur && !overview));
  $$("#dots button").forEach((b, i) => b.classList.toggle("on", i === cur));
  $("#prev").disabled = cur === 0; $("#next").disabled = cur === N - 1;
  if (LESSON.slides[cur].kind === "summary") renderMyStats();
  clearSel();
}
function toggleOverview() {
  overview = !overview; root.classList.toggle("ov", overview);
  moveCam(overview ? camAll() : camFor(cur), "glide");
  update();
}

/* ---------- language ---------- */
function setLang(l) {
  lang = l; root.dataset.lang = l;
  try { localStorage.setItem("lesson-lang", l); } catch (e) {}
  $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === l)));
  S.lang = l === "en" ? "en" : "vi";
  $$(".cap").forEach((c) => { if (c.dataset.fresh) c.textContent = capHint(); });
  $$(".say-rate").forEach((r) => { r.innerHTML = rateRow(); bindRateRow(r); });
  showRate();
  fitSlides();
}

/* ---------- sheet ---------- */
let sheetFor = null;
function openSheet(html, anchor, t = L) {
  const sh = $("#sheet");
  sh.innerHTML = '<button type="button" class="ic close" id="shClose" aria-label="' + t("Đóng", "Close") + '">' + I.close + "</button>" + html;
  sh.hidden = false; $("#scrim").hidden = false;
  const pop = !!anchor && window.innerWidth >= 860;
  sh.classList.toggle("pop", pop);
  if (pop) {
    const r = anchor.getBoundingClientRect(), w = 380;
    const left = Math.min(window.innerWidth - w - 16, Math.max(16, r.left + r.width / 2 - w / 2));
    let top = r.bottom + 12; if (top + 300 > window.innerHeight) top = Math.max(70, r.top - 312);
    sh.style.left = left + "px"; sh.style.top = top + "px";
  } else { sh.style.left = ""; sh.style.top = ""; }
  $("#shClose").onclick = closeSheet;
  bindRateRow(sh);
  renderMath(sh);
}
function closeSheet() { $("#sheet").hidden = true; $("#scrim").hidden = true; $$(".w.act").forEach((w) => w.classList.remove("act")); sheetFor = null; }
// Stress, phonetics and the approximate Vietnamese reading of a glossary term.
function pronHTML(g, t = VI) {
  if (!g || !g.st) return "";
  let h = '<div class="pron"><div class="pr-row"><span class="lbl">' + t("Trọng âm", "Stress") + '</span><span class="st">' + stressHTML(g.st) + "</span></div>" +
    '<div class="pr-row"><span class="lbl">' + t("Phiên âm", "IPA") + '</span><span class="ipa">' + esc(g.ipa || "") + "</span></div>";
  if (g.boi && showBoi()) {
    h += '<div class="pr-row boi"><span class="lbl">' + t("Đọc gần đúng", "Approx.") + '</span><span class="bo">' + boiHTML(g.boi) + "</span></div>";
    if (g.tip) h += '<p class="tip">' + esc(g.tip) + "</p>";
    h += '<p class="note-s">' + t("Cách đọc gần đúng chỉ để bắt đầu: nghe giọng mẫu để đọc cho chuẩn, nhớ giữ âm cuối viết nhỏ.", "The approximate reading is only a start: listen to the model and keep the small final sounds.") + "</p>";
  }
  h += '<div class="pr-acts"><button type="button" class="link" id="slowBtn">' + t("Đọc chậm", "Say slowly") + "</button>" +
    (g.boi ? '<button type="button" class="link" id="boiBtn">' + (showBoi() ? t("Ẩn cách đọc gần đúng", "Hide approximate reading") : t("Hiện cách đọc gần đúng", "Show approximate reading")) + "</button>" : "") + "</div></div>";
  return h;
}
function bindPron(g, word, rerender) {
  const sb = $("#slowBtn"); if (sb) sb.onclick = () => speakEn(word, 0.5);
  const bb = $("#boiBtn"); if (bb) bb.onclick = () => { setBoi(!showBoi()); rerender(); };
}
const SRC = (s, t = VI) => '<span class="src">' + (s === "gloss" ? t("Theo bảng thuật ngữ của bài", "From the lesson glossary") : t("Dịch máy, có thể chưa chuẩn", "Machine translation, may not be exact")) + "</span>";

// The lesson's own Vietnamese for the sentence a word or selection belongs to.
function pairOf(node) {
  const en = node.closest && node.closest(".en");
  if (!en) return null;
  const vi = en.parentElement && en.parentElement.querySelector(":scope > .vi");
  return vi ? { en, vi } : null;
}
function wholeSentenceHTML(pair) {
  return '<div class="whole"><span class="lbl">Cả câu trong bài</span><p class="w-en">' + pair.en.innerHTML + '</p><p class="w-vi">' + pair.vi.innerHTML + "</p></div>";
}

async function showWord(el) {
  const word = el.dataset.w, pair = pairOf(el);
  $$(".w.act").forEach((w) => w.classList.remove("act")); el.classList.add("act");
  sheetFor = word;
  openSheet('<div class="wd"><div class="wd-top"><span class="wd-w">' + esc(word) + '</span><button type="button" class="spk" id="wdSpk" aria-label="Nghe">' + I.speak + "</button></div>" +
    '<p class="wd-vi" id="wdVi">Đang tra…</p>' + (pair ? '<button type="button" class="link" id="wholeBtn">Xem cả câu</button><div id="wholeBox"></div>' : "") + rateRow(VI) + "</div>", el, VI);
  $("#wdSpk").onclick = () => speakEn(word);
  if (pair) $("#wholeBtn").onclick = () => { $("#wholeBox").innerHTML = wholeSentenceHTML(pair); $("#wholeBtn").remove(); };
  const m = await meaningOf(word);
  if (sheetFor !== word) return;
  const box = $("#wdVi");
  if (!m.vi) { box.textContent = "Chưa tra được nghĩa. Kiểm tra mạng rồi thử lại."; return; }
  box.innerHTML = esc(m.vi) + (m.ex ? '<span class="ex">' + esc(m.ex) + "</span>" : "") + SRC(m.source);
  if (m.g && m.g.st) {
    const holder = document.createElement("div"); holder.id = "pronBox"; box.after(holder);
    const draw = () => { holder.innerHTML = pronHTML(m.g, VI); bindPron(m.g, word, draw); };
    draw();
  }
  stats.lookup(m.key, word, m.vi);
}

/* ---------- translate a dragged selection ----------
   The app does its own selection (hold a word, then drag across words) so the phone's
   copy menu and its built-in translator never open over the lesson. */
let selWords = [], selEn = null;
function wordsOf(en) { return $$(".w", en); }
function markRange(a, b) {
  const arr = wordsOf(selEn), i = arr.indexOf(a), j = arr.indexOf(b);
  if (i < 0 || j < 0) return;
  const lo = Math.min(i, j), hi = Math.max(i, j);
  $$(".w.sel").forEach((w) => w.classList.remove("sel"));
  selWords = arr.slice(lo, hi + 1);
  selWords.forEach((w) => w.classList.add("sel"));
}
function clearSel() { $$(".w.sel").forEach((w) => w.classList.remove("sel")); selWords = []; selEn = null; hideSel(); }
function selectionText() {
  const r = document.createRange();
  r.setStartBefore(selWords[0]); r.setEndAfter(selWords[selWords.length - 1]);
  const frag = r.cloneContents();
  frag.querySelectorAll(".katex-mathml").forEach((n) => n.remove());
  return frag.textContent.replace(/\s+/g, " ").trim();
}
function showSelBtn() {
  // Fixed just above the bottom bar, so it never covers the lesson text.
  const b = $("#selBtn");
  b.textContent = L("Dịch đoạn này (" + selWords.length + " từ)", "Translate selection (" + selWords.length + " words)");
  b.hidden = false;
}
function hideSel() { const b = $("#selBtn"); if (b) b.hidden = true; }
async function showSelection() {
  if (!selWords.length) return;
  const text = selectionText(), pair = pairOf(selWords[0]), anchor = $("#selBtn");
  const coverage = selWords.length / Math.max(1, wordsOf(selEn).length);
  const uniq = LESSON.glossary.filter((g) => (g.forms || [g.en]).concat([g.en]).some((f) =>
    new RegExp("(^|[^A-Za-z])" + f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^A-Za-z]|$)", "i").test(text)));
  const useLesson = pair && coverage >= 0.7;
  openSheet('<div class="wd"><span class="lbl">Đoạn đã chọn</span><div class="wd-top"><span class="sel-en">' + esc(text) + '</span><button type="button" class="spk" id="selSpk" aria-label="Nghe">' + I.speak + "</button></div>" +
    (useLesson ? '<p class="wd-vi">' + pair.vi.innerHTML + '<span class="src">Bản tiếng Việt đã duyệt trong bài</span></p>' : '<p class="wd-vi" id="selVi">Đang dịch…</p>') +
    (uniq.length ? '<div class="terms"><span class="lbl">Thuật ngữ trong đoạn</span>' + uniq.map((g) => "<span><b>" + esc(g.en) + "</b> " + esc(g.vi) + "</span>").join("") + "</div>" : "") +
    (pair && !useLesson ? wholeSentenceHTML(pair) : "") + rateRow(VI) + "</div>", anchor, VI);
  clearSel();
  $("#selSpk").onclick = () => speakEn(text);
  if (useLesson) { stats.lookup(text.toLowerCase(), text, pair.vi.textContent.trim()); return; }
  const g = glossFor(text);
  const m = g ? { vi: g.vi, source: "gloss" } : await meaningOf(text);
  const box = $("#selVi"); if (!box) return;
  if (!m.vi) { box.textContent = "Chưa dịch được. Kiểm tra mạng rồi thử lại."; return; }
  box.innerHTML = esc(m.vi) + SRC(m.source);
  stats.lookup(text.toLowerCase(), text, m.vi);
}

/* ---------- Vietnamese → English ---------- */
function showTranslate() {
  const recent = stats.translations().slice(0, 5);
  openSheet('<div class="trs"><h3>Vietnamese → English</h3>' +
    '<textarea id="trIn" rows="2" placeholder="Type Vietnamese, e.g. đạo hàm bằng 0"></textarea>' +
    '<button type="button" class="primary" id="trGo">Translate</button><div id="trOut" class="tr-out" hidden></div>' + rateRow(EN) +
    (recent.length ? '<div class="tr-recent"><span class="lbl">Recent</span>' + recent.map((r) => '<button type="button" class="rc" data-vi="' + esc(r.vi) + '"><span>' + esc(r.vi) + "</span><b>" + esc(r.en) + "</b></button>").join("") + "</div>" : "") + "</div>", null, EN);
  const inp = $("#trIn"), out = $("#trOut");
  const run = async () => {
    const v = inp.value.trim();
    out.hidden = false;
    if (!v) { out.innerHTML = '<p class="err">Type a Vietnamese sentence first.</p>'; return; }
    out.innerHTML = '<p class="muted">Translating…</p>';
    const r = await toEnglish(v);
    if (!r.en) { out.innerHTML = '<p class="err">Could not translate. Check the connection and try again.</p>'; return; }
    out.innerHTML = '<div class="tr-res"><span>' + esc(r.en) + '</span><button type="button" class="spk" id="trSpk" aria-label="Listen">' + I.speak + "</button></div>" + SRC(r.source, EN);
    $("#trSpk").onclick = () => speakEn(r.en);
    stats.translated(v, r.en);
  };
  $("#trGo").onclick = run;
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(); } });
  inp.oninput = () => { if (out.querySelector(".err")) out.hidden = true; };
  $$(".rc").forEach((b) => { b.onclick = () => { inp.value = b.dataset.vi; run(); }; });
  setTimeout(() => inp.focus(), 60);
}
function showInvite() {
  const url = location.origin + location.pathname + "?bai=" + LESSON.id;
  openSheet('<div class="inv"><h3>Học sinh quét mã để vào bài</h3><div id="qr" class="qr"></div><p class="inv-url">' + esc(url) + "</p></div>");
  if (window.QRCode) new window.QRCode($("#qr"), { text: url, width: 220, height: 220, correctLevel: window.QRCode.CorrectLevel.M });
  else $("#qr").textContent = "Không tải được mã QR, học sinh gõ địa chỉ bên dưới.";
}

/* ---------- quiz, speaking, board ---------- */
function bindQuiz() {
  $$(".b-quiz").forEach((q) => {
    const [si, bk] = q.dataset.q.split("-").map(Number);
    const B = LESSON.slides[si].blocks[bk];
    $$(".opt", q).forEach((o) => {
      o.onclick = () => {
        const ok = +o.dataset.i === B.answer;
        stats.quiz(LESSON.slides[si].id, ok);
        o.classList.remove("wrong"); void o.offsetWidth;
        o.classList.add(ok ? "right" : "wrong");
        if (ok) { $$(".opt", q).forEach((x) => (x.disabled = true)); $(".qe", q).hidden = false; fitSlides(); }
      };
    });
  });
  $$(".b-say .spk").forEach((b) => { b.onclick = () => speakEn(b.dataset.say); });
}
function bindBoards() {
  LESSON.slides.forEach((s, i) => s.blocks.forEach((b) => {
    if (b.type !== "graph") return;
    const svg = $("#board-" + i), cap = $("#cap-" + i);
    cap.dataset.fresh = "1"; cap.textContent = capHint();
    makeBoard(svg, MONO, (ev) => { cap.dataset.fresh = ""; cap.textContent = boardCaption(ev, MONO); });
  }));
}

function capHint() { return L("Lướt ngón tay theo đồ thị, hoặc kéo nhãn đặt lên đồ thị.", "Trace the curve with your finger, or drag a label onto it."); }

/* ---------- reading speed ---------- */
const RATE_NAMES = { 0.6: ["Chậm", "Slow"], 0.8: ["Vừa", "Medium"], 1: ["Bình thường", "Normal"] };
function showRate() { const t = $("#rateTxt"); if (t) t.textContent = String(S.rate).replace(".", lang === "en" ? "." : ",") + "×"; }
function rateRow(t = L) {
  const en = t("", "x") === "x";
  return '<div class="rate-row"><span class="lbl">' + t("Tốc độ đọc", "Reading speed") + "</span>" +
    RATES.map((r) => '<button type="button" data-r="' + r + '" aria-pressed="' + (r === S.rate) + '">' + RATE_NAMES[r][en ? 1 : 0] + "</button>").join("") + "</div>";
}
function bindRateRow(root) {
  $$(".rate-row button", root).forEach((b) => { b.onclick = () => {
    setRate(+b.dataset.r); showRate();
    $$(".rate-row button", root).forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.r === S.rate)));
  }; });
}

/* ---------- summary ---------- */
function renderMyStats() {
  const box = $("#mystats"); if (!box) return;
  const ws = stats.words(), tr = stats.translations(), qz = stats.quizzes();
  const qs = LESSON.slides.filter((s) => s.blocks.some((b) => b.type === "quiz"));
  const done = qs.filter((s) => qz[s.id]).length, firstOk = qs.filter((s) => qz[s.id] && qz[s.id].first).length;
  let h = '<div class="tiles"><div class="tile"><b>' + ws.length + "</b><span>" + L("từ, cụm từ đã tra nghĩa", "words and phrases looked up") + "</span></div>" +
    '<div class="tile"><b>' + tr.length + "</b><span>" + L("câu đã dịch Việt → Anh", "sentences translated into English") + "</span></div>" +
    '<div class="tile"><b>' + (done ? firstOk + "/" + qs.length : "–") + "</b><span>" + (done ? L("câu hỏi đúng ngay lần đầu", "questions right first time") : L("chưa làm câu hỏi nào", "no questions answered yet")) + "</span></div></div>";
  if (ws.length) h += '<p class="mh">' + L("Từ cần ôn", "Words to review") + " <span>" + L("chạm để xem nghĩa", "tap to see the meaning") + '</span></p><div class="cards">' +
    ws.slice(0, 18).map((w) => '<button type="button" class="fc"><span class="fc-en">' + esc(w.word) + '</span><span class="fc-vi">' + esc(w.vi || "") + '</span><span class="fc-n">' + L("tra " + w.n + " lần", "looked up " + w.n + (w.n > 1 ? " times" : " time")) + "</span></button>").join("") + "</div>";
  if (tr.length) h += '<p class="mh">' + L("Câu em đã dịch", "Your translations") + '</p><ul class="trl">' + tr.slice(0, 6).map((r) => "<li><span>" + esc(r.vi) + "</span><b>" + esc(r.en) + "</b></li>").join("") + "</ul>";
  if (!ws.length && !tr.length) h += '<p class="muted">' + L("Em chưa tra từ nào. Chạm vào từ tiếng Anh, hoặc nhấn giữ rồi kéo để chọn một đoạn ở các phần trước.", "You haven't looked up any words yet. Tap an English word, or hold and drag to select a phrase on the earlier slides.") + "</p>";
  h += '<button type="button" class="ghost" id="clearStats">' + L("Xóa thống kê và học lại", "Clear and start again") + "</button>";
  box.innerHTML = h;
  $$(".fc", box).forEach((c) => { c.onclick = () => c.classList.toggle("open"); });
  $("#clearStats").onclick = () => { stats.clear(); renderMyStats(); };
  fitSlides();
}

/* ---------- gestures ----------
   Quick tap on a word: its meaning. Hold a word (or drag with a mouse) then move: select words.
   Quick horizontal swipe anywhere else: next or previous slide. */
let suppressClick = false;
function bindGestures() {
  const stage = $("#stage");
  let sx = 0, sy = 0, st = 0, track = false, downW = null, holding = false, holdT = null;
  stage.addEventListener("pointerdown", (e) => {
    if (!e.isPrimary || overview) return;
    sx = e.clientX; sy = e.clientY; st = Date.now();
    track = !e.target.closest(".board,.opt,.spk,button,textarea");
    downW = e.target.closest(".slide .w");
    holding = false; clearTimeout(holdT);
    if (selWords.length && !e.target.closest(".w.sel")) clearSel();
    if (downW) {
      holdT = setTimeout(() => {
        holding = true; selEn = downW.closest(".en"); markRange(downW, downW);
        try { navigator.vibrate && navigator.vibrate(12); } catch (x) {}
      }, 320);
    }
  });
  stage.addEventListener("pointermove", (e) => {
    if (!downW) return;
    const moved = Math.hypot(e.clientX - sx, e.clientY - sy);
    if (!holding) {
      if (e.pointerType === "mouse" && moved > 6) { holding = true; clearTimeout(holdT); selEn = downW.closest(".en"); markRange(downW, downW); }
      else if (moved > 10) { clearTimeout(holdT); downW = null; return; }
      else return;
    }
    track = false;
    const el = document.elementFromPoint(e.clientX, e.clientY), w2 = el && el.closest(".w");
    if (w2 && w2.closest(".en") === selEn) markRange(downW, w2);
  });
  const end = (e) => {
    clearTimeout(holdT);
    if (holding && downW) {
      suppressClick = true; setTimeout(() => { suppressClick = false; }, 400);
      if (selWords.length > 1) showSelBtn();
      else { const w = downW; clearSel(); showWord(w); }
      holding = false; downW = null; return;
    }
    downW = null;
    if (!track) return; track = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 700) go(cur + (dx < 0 ? 1 : -1));
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", () => { clearTimeout(holdT); holding = false; downW = null; track = false; });
  stage.addEventListener("contextmenu", (e) => { if (e.target.closest(".slide")) e.preventDefault(); });
}

/* ---------- start ---------- */
function toast(msg, ms) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, ms || 3600); }
function start() {
  document.title = LESSON.title.vi + " · Lớp học song ngữ";
  shell();
  if (TEACHER) root.classList.add("teacher");
  setLang(lang);
  renderMath(document.body);
  bindQuiz(); bindBoards(); bindGestures();
  layout();
  camNow = camFor(0); moveCam(camNow, "jump"); update();

  $$(".seg button").forEach((b) => { b.onclick = () => { setLang(b.dataset.l); if (LESSON.slides[cur].kind === "summary") renderMyStats(); }; });
  $("#prev").onclick = () => go(cur - 1);
  $("#next").onclick = () => go(cur + 1);
  $$("#dots button").forEach((b) => { b.onclick = () => go(+b.dataset.i); });
  $("#trBtn").onclick = showTranslate;
  $("#scrim").onclick = closeSheet;
  $("#selBtn").onclick = showSelection;
  if ($("#inviteBtn")) $("#inviteBtn").onclick = showInvite;
  $("#ovBtn").onclick = toggleOverview;
  $("#rateBtn").onclick = () => {
    const i = RATES.indexOf(S.rate); setRate(RATES[(i + 1) % RATES.length]); showRate();
    $$(".rate-row button").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.r === S.rate)));
    speakEn("Speed " + String(S.rate));
  };
  $$(".slide").forEach((el, i) => el.addEventListener("click", (e) => { if (overview) { e.stopPropagation(); e.preventDefault(); go(i, "glide"); } }, true));

  document.addEventListener("click", (e) => {
    const w = e.target.closest(".slide .w"); if (!w || overview || suppressClick) return;
    if (selWords.length) { clearSel(); return; }
    e.stopPropagation(); showWord(w);
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("textarea,input")) return;
    if (e.key === "Escape") { if (!$("#sheet").hidden) closeSheet(); else if (overview) toggleOverview(); return; }
    const w = e.target.closest && e.target.closest(".w");
    if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showWord(w); return; }
    if (!$("#sheet").hidden) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(cur + 1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") go(cur - 1);
  });
  let rt = null;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { layout(); moveCam(overview ? camAll() : camFor(cur), "jump"); }, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitSlides());
  if (window.innerWidth < 860) setTimeout(() => toast(L("Vuốt sang trái để sang phần tiếp. Chạm một từ, hoặc nhấn giữ rồi kéo để chọn một đoạn và xem nghĩa.", "Swipe left for the next slide. Tap a word, or hold and drag to select a phrase and see its meaning.")), 1000);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
