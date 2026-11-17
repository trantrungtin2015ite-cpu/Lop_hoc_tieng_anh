// Interactive bilingual lesson.
// Wide screens (projector, tablet sideways): slides sit on one big canvas and the view
// zooms and pans between them, like Prezi. Phones: one full-screen card per slide.
import LESSON from "./data-don-dieu.js";
import { setGlossary, bi, enHTML, viHTML, renderMath, esc, meaningOf, toEnglish, plain } from "./words.js";
import { makeStats } from "./stats.js";
import { makeBoard, boardCaption } from "./board.js";
import { MONO } from "./pack-mono.js";
import { S, speakEn } from "./shim.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const TEACHER = params.has("gv");
const stats = makeStats(LESSON.id);
setGlossary(LESSON.glossary);

const root = document.documentElement;
let lang = "both";
try { lang = localStorage.getItem("lesson-lang") || "both"; } catch (e) {}
let cur = 0, mode = "", overview = false;
const N = LESSON.slides.length;

/* ---------- icons (inline, no external set) ---------- */
const I = {
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/></svg>',
  tr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h8M8 4v2M6 6c0 4 3 7 6 8M10 6c0 3-2 6-6 8"/><path d="M13 20l4-9 4 9M14.5 17h5"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

/* ---------- slide content ---------- */
function bbtSVG() {
  // Variation table of y = x^3 - 3x. Labels sit in clear cells, never on a line.
  const t = (x, y, s, cls) => '<text x="' + x + '" y="' + y + '" class="' + (cls || "") + '" text-anchor="middle" dominant-baseline="central">' + s + "</text>";
  const ar = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="ar" marker-end="url(#ah)"/>';
  return '<svg class="bbt" viewBox="0 0 640 214" role="img" aria-label="Bảng biến thiên của y = x³ − 3x">' +
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" class="ahd"/></marker></defs>' +
    '<rect x="1" y="1" width="638" height="212" rx="10" class="fr"/>' +
    '<line x1="90" y1="1" x2="90" y2="213" class="gl"/><line x1="1" y1="52" x2="639" y2="52" class="gl"/><line x1="1" y1="104" x2="639" y2="104" class="gl"/>' +
    t(45, 27, "x", "lb") + t(45, 78, "y′", "lb") + t(45, 158, "y", "lb") +
    t(130, 27, "−∞") + t(290, 27, "−1") + t(450, 27, "1") + t(596, 27, "+∞") +
    t(210, 78, "+", "pos") + t(290, 78, "0") + t(370, 78, "−", "neg") + t(450, 78, "0") + t(523, 78, "+", "pos") +
    t(130, 190, "−∞") + t(290, 122, "2") + t(450, 190, "−2") + t(596, 122, "+∞") +
    ar(150, 182, 270, 130) + ar(310, 130, 430, 182) + ar(470, 182, 576, 130) +
    "</svg>";
}

function blockHTML(b, si, bi_) {
  switch (b.type) {
    case "p": return '<p class="b-p">' + bi(b) + "</p>";
    case "hint": return '<p class="b-hint">' + bi(b) + "</p>";
    case "note": return '<div class="b-note">' + bi(b) + "</div>";
    case "list": return '<ul class="b-list">' + b.items.map((x) => "<li>" + bi(x) + "</li>").join("") + "</ul>";
    case "steps": return '<ol class="b-steps">' + b.items.map((x, i) => '<li><span class="n">' + (i + 1) + "</span><div>" + bi(x) + "</div></li>").join("") + "</ol>";
    case "graph": return '<div class="b-graph"><svg class="board" id="board-' + si + '" viewBox="0 0 380 256" role="img" aria-label="Đồ thị y = x³ − 3x"></svg><p class="cap" id="cap-' + si + '"></p></div>';
    case "bbt": return '<div class="b-bbt">' + bbtSVG() + "</div>";
    case "quiz":
      return '<div class="b-quiz" data-q="' + si + "-" + bi_ + '"><p class="qq">' + bi(b.q) + '</p><div class="qo">' +
        b.options.map((o, i) => '<button type="button" class="opt" data-i="' + i + '"><span class="k">' + "ABC"[i] + '</span><span class="en">' + enHTML(o.en) + '</span><span class="vi">' + viHTML(o.vi) + "</span></button>").join("") +
        '</div><div class="qe" hidden>' + bi(b.explain) + "</div></div>";
    case "say":
      return '<div class="b-say">' + b.items.map((x) => '<div class="row"><button type="button" class="spk" data-say="' + esc(x.en) + '" aria-label="Nghe câu này">' + I.speak + "</button><div>" + bi(x) + "</div></div>").join("") + "</div>";
    case "mystats": return '<div class="b-mystats" id="mystats"></div>';
  }
  return "";
}
function slideHTML(s, i) {
  return '<section class="slide' + (s.kind ? " k-" + s.kind : "") + '" data-i="' + i + '" aria-label="' + esc(s.title.vi) + '">' +
    '<header class="s-head"><span class="s-num">' + (i + 1) + " / " + N + "</span><h2>" + bi(s.title) + "</h2></header>" +
    '<div class="s-body">' + s.blocks.map((b, k) => blockHTML(b, i, k)).join("") + "</div></section>";
}

/* ---------- page shell ---------- */
function shell() {
  document.body.innerHTML =
    '<header class="topbar"><a class="home" href="./" aria-label="Trang chủ">Lớp học song ngữ</a>' +
    '<div class="seg" role="group" aria-label="Ngôn ngữ"><button type="button" data-l="en">EN</button><button type="button" data-l="both">EN + VI</button><button type="button" data-l="vi">VI</button></div>' +
    '<div class="tools">' + (TEACHER ? '<button type="button" class="ic" id="inviteBtn" aria-label="Mời học sinh">' + I.qr + "</button>" : "") +
    '<button type="button" class="ic" id="ovBtn" aria-label="Xem toàn bài">' + I.grid + "</button></div></header>" +
    '<main id="stage"><div id="plane">' + LESSON.slides.map(slideHTML).join("") + "</div></main>" +
    '<nav class="bottombar"><button type="button" class="ic nav" id="prev" aria-label="Phần trước">' + I.prev + '</button>' +
    '<div class="prog"><div class="bar"><i id="progBar"></i></div><span id="progTxt"></span></div>' +
    '<button type="button" class="ic nav" id="next" aria-label="Phần sau">' + I.next + "</button>" +
    '<button type="button" class="trbtn" id="trBtn">' + I.tr + "<span>Việt → Anh</span></button></nav>" +
    '<div class="scrim" id="scrim" hidden></div>' +
    '<div class="sheet" id="sheet" role="dialog" aria-modal="true" hidden></div>';
}

/* ---------- layout: canvas (wide) or stack (phone) ---------- */
const POS = LESSON.slides.map((s, i) => ({ x: i * 1480, y: [0, 330, -260, 120, -380][i % 5], r: [0, -2, 1.5, -1, 2][i % 5] }));
function pickMode() {
  const m = window.innerWidth >= 860 && window.innerHeight >= 480 ? "canvas" : "stack";
  if (m === mode) { if (m === "canvas") camera(); return; }
  mode = m; root.dataset.mode = m;
  const slides = $$(".slide");
  if (m === "canvas") {
    slides.forEach((el, i) => { el.style.transform = "translate(" + (POS[i].x - 640) + "px," + (POS[i].y - 360) + "px) rotate(" + POS[i].r + "deg)"; });
    fitSlides();
    camera(true);
  } else {
    overview = false; root.classList.remove("ov");
    slides.forEach((el) => { el.style.transform = ""; el.style.fontSize = ""; });
    $("#plane").style.transform = "";
    requestAnimationFrame(() => slides[cur].scrollIntoView({ block: "start" }));
  }
}
// Canvas slides are a fixed 1280×720: shrink the text of a slide until it fits.
function fitSlides() {
  if (mode !== "canvas") return;
  $$(".slide").forEach((el) => {
    let fs = el.classList.contains("k-title") ? 34 : 30;
    el.style.fontSize = fs + "px";
    while (el.scrollHeight > 721 && fs > 17) { fs -= 1; el.style.fontSize = fs + "px"; }
  });
}
function camera(instant) {
  const plane = $("#plane"), W = window.innerWidth, H = window.innerHeight - 64 - 76;
  let x, y, r, s;
  if (overview) {
    const xs = POS.map((p) => p.x), ys = POS.map((p) => p.y);
    const minX = Math.min(...xs) - 700, maxX = Math.max(...xs) + 700, minY = Math.min(...ys) - 420, maxY = Math.max(...ys) + 420;
    x = (minX + maxX) / 2; y = (minY + maxY) / 2; r = 0; s = Math.min(W / (maxX - minX), H / (maxY - minY));
  } else {
    const p = POS[cur]; x = p.x; y = p.y; r = p.r; s = Math.min((W - 48) / 1280, (H - 24) / 720);
  }
  plane.style.transition = instant ? "none" : "";
  plane.style.transform = "translate(" + W / 2 + "px," + (64 + H / 2) + "px) scale(" + s + ") rotate(" + -r + "deg) translate(" + -x + "px," + -y + "px)";
}
function go(i) {
  cur = Math.max(0, Math.min(N - 1, i));
  overview = false; root.classList.remove("ov");
  if (mode === "canvas") camera(); else $$(".slide")[cur].scrollIntoView({ behavior: "smooth", block: "start" });
  update();
}
function update() {
  $$(".slide").forEach((el, i) => el.classList.toggle("on", i === cur));
  $("#progTxt").textContent = cur + 1 + " / " + N;
  $("#progBar").style.width = ((cur + 1) / N) * 100 + "%";
  $("#prev").disabled = cur === 0; $("#next").disabled = cur === N - 1;
  if (LESSON.slides[cur].kind === "summary") renderMyStats();
}

/* ---------- language ---------- */
function setLang(l) {
  lang = l; root.dataset.lang = l;
  try { localStorage.setItem("lesson-lang", l); } catch (e) {}
  $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === l)));
  S.lang = l === "en" ? "en" : "vi";
  fitSlides();
}

/* ---------- sheet (word meaning, translate, invite) ---------- */
let sheetFor = null;
function openSheet(html, anchor) {
  const sh = $("#sheet"), sc = $("#scrim");
  sh.innerHTML = '<button type="button" class="ic close" id="shClose" aria-label="Đóng">' + I.close + "</button>" + html;
  sh.hidden = false; sc.hidden = false;
  sh.classList.toggle("pop", !!anchor && mode === "canvas");
  if (anchor && mode === "canvas") {
    const r = anchor.getBoundingClientRect(), w = 360;
    let left = Math.min(window.innerWidth - w - 16, Math.max(16, r.left + r.width / 2 - w / 2));
    let topY = r.bottom + 12; if (topY + 260 > window.innerHeight) topY = Math.max(16, r.top - 272);
    sh.style.left = left + "px"; sh.style.top = topY + "px";
  } else { sh.style.left = ""; sh.style.top = ""; }
  $("#shClose").onclick = closeSheet;
  renderMath(sh);
}
function closeSheet() { $("#sheet").hidden = true; $("#scrim").hidden = true; $$(".w.act").forEach((w) => w.classList.remove("act")); sheetFor = null; }

async function showWord(el) {
  const word = el.dataset.w;
  $$(".w.act").forEach((w) => w.classList.remove("act")); el.classList.add("act");
  sheetFor = word;
  openSheet('<div class="wd"><div class="wd-top"><span class="wd-w">' + esc(word) + '</span><button type="button" class="spk" id="wdSpk" aria-label="Nghe">' + I.speak + '</button></div><p class="wd-vi" id="wdVi">Đang tra…</p></div>', el);
  $("#wdSpk").onclick = () => speakEn(word);
  const m = await meaningOf(word);
  if (sheetFor !== word) return;
  const box = $("#wdVi");
  if (!m.vi) { box.textContent = "Chưa tra được nghĩa. Kiểm tra mạng rồi thử lại."; return; }
  box.innerHTML = esc(m.vi) +
    (m.ex ? '<span class="wd-ex">' + esc(m.ex) + "</span>" : "") +
    '<span class="wd-src">' + (m.source === "gloss" ? "Theo bảng thuật ngữ của bài" : "Dịch máy, có thể chưa chuẩn") + "</span>";
  stats.lookup(m.key, word, m.vi);
}

function showTranslate() {
  const recent = stats.translations().slice(0, 5);
  openSheet('<div class="trs"><h3>Dịch tiếng Việt sang tiếng Anh</h3>' +
    '<textarea id="trIn" rows="2" placeholder="Ví dụ: đạo hàm bằng 0"></textarea>' +
    '<button type="button" class="primary" id="trGo">Dịch</button><div id="trOut" class="tr-out" hidden></div>' +
    (recent.length ? '<div class="tr-recent"><h4>Em đã tra</h4>' + recent.map((r) => '<button type="button" class="rc" data-vi="' + esc(r.vi) + '"><span>' + esc(r.vi) + "</span><b>" + esc(r.en) + "</b></button>").join("") + "</div>" : "") +
    "</div>");
  const inp = $("#trIn"), out = $("#trOut");
  const run = async () => {
    const v = inp.value.trim();
    if (!v) { out.hidden = false; out.innerHTML = '<p class="err">Nhập câu tiếng Việt trước đã.</p>'; return; }
    out.hidden = false; out.innerHTML = '<p class="muted">Đang dịch…</p>';
    const r = await toEnglish(v);
    if (!r.en) { out.innerHTML = '<p class="err">Chưa dịch được. Kiểm tra mạng rồi thử lại.</p>'; return; }
    out.innerHTML = '<div class="tr-res"><span>' + esc(r.en) + '</span><button type="button" class="spk" id="trSpk" aria-label="Nghe">' + I.speak + "</button></div>" +
      '<span class="wd-src">' + (r.source === "gloss" ? "Theo bảng thuật ngữ của bài" : "Dịch máy, có thể chưa chuẩn") + "</span>";
    $("#trSpk").onclick = () => speakEn(r.en);
    stats.translated(v, r.en);
  };
  $("#trGo").onclick = run;
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(); } });
  inp.oninput = () => { if (out.querySelector(".err")) out.hidden = true; };
  $$(".rc").forEach((b) => { b.onclick = () => { inp.value = b.dataset.vi; run(); }; });
  setTimeout(() => inp.focus(), 50);
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
        const i = +o.dataset.i, ok = i === B.answer;
        stats.quiz(LESSON.slides[si].id, ok);
        o.classList.add(ok ? "right" : "wrong");
        if (ok) { $$(".opt", q).forEach((x) => (x.disabled = true)); $(".qe", q).hidden = false; }
      };
    });
  });
  $$(".b-say .spk").forEach((b) => { b.onclick = () => speakEn(b.dataset.say); });
}
function bindBoards() {
  LESSON.slides.forEach((s, i) => s.blocks.forEach((b) => {
    if (b.type !== "graph") return;
    const svg = $("#board-" + i), cap = $("#cap-" + i);
    if (!svg) return;
    cap.textContent = S.lang === "en" ? "Trace the curve with your finger, or drag a label onto it." : "Lướt ngón tay theo đồ thị, hoặc kéo nhãn đặt lên đồ thị.";
    makeBoard(svg, MONO, (ev) => { cap.textContent = boardCaption(ev, MONO); });
  }));
}

/* ---------- summary: the student's own words ---------- */
function renderMyStats() {
  const box = $("#mystats"); if (!box) return;
  const ws = stats.words(), tr = stats.translations(), qz = stats.quizzes();
  const qs = LESSON.slides.filter((s) => s.blocks.some((b) => b.type === "quiz"));
  const firstOk = qs.filter((s) => qz[s.id] && qz[s.id].first).length;
  let h = '<div class="tiles"><div class="tile"><b>' + ws.length + '</b><span>từ đã tra nghĩa</span></div>' +
    '<div class="tile"><b>' + tr.length + '</b><span>câu đã dịch Việt → Anh</span></div>' +
    '<div class="tile"><b>' + firstOk + "/" + qs.length + '</b><span>câu hỏi đúng ngay lần đầu</span></div></div>';
  if (ws.length) {
    h += '<h3 class="mh">Từ cần ôn <span>chạm để xem nghĩa</span></h3><div class="cards">' +
      ws.map((w) => '<button type="button" class="fc"><span class="fc-en">' + esc(w.word) + '</span><span class="fc-vi">' + esc(w.vi || "") + '</span><span class="fc-n">tra ' + w.n + " lần</span></button>").join("") + "</div>";
  }
  if (tr.length) {
    h += '<h3 class="mh">Câu em đã dịch</h3><ul class="trl">' + tr.slice(0, 8).map((r) => "<li><span>" + esc(r.vi) + "</span><b>" + esc(r.en) + "</b></li>").join("") + "</ul>";
  }
  if (!ws.length && !tr.length) h += '<p class="muted">Em chưa tra từ nào. Chạm vào từ tiếng Anh ở các phần trước để xem nghĩa.</p>';
  h += '<button type="button" class="ghost" id="clearStats">Xóa thống kê và học lại</button>';
  box.innerHTML = h;
  $$(".fc", box).forEach((c) => { c.onclick = () => c.classList.toggle("open"); });
  $("#clearStats").onclick = () => { stats.clear(); renderMyStats(); };
}

/* ---------- start ---------- */
function start() {
  document.title = LESSON.title.vi + " · Lớp học song ngữ";
  shell();
  setLang(lang);
  renderMath(document.body);
  bindQuiz(); bindBoards();
  if (TEACHER) root.classList.add("teacher");
  $$(".seg button").forEach((b) => { b.onclick = () => { setLang(b.dataset.l); if (LESSON.slides[cur].kind === "summary") renderMyStats(); }; });
  $("#prev").onclick = () => go(cur - 1);
  $("#next").onclick = () => go(cur + 1);
  $("#trBtn").onclick = showTranslate;
  $("#scrim").onclick = closeSheet;
  if ($("#inviteBtn")) $("#inviteBtn").onclick = showInvite;
  $("#ovBtn").onclick = () => {
    if (mode !== "canvas") { go(0); return; }
    overview = !overview; root.classList.toggle("ov", overview); camera();
  };
  $$(".slide").forEach((el, i) => el.addEventListener("click", () => { if (overview) go(i); }));
  // Word taps anywhere in the lesson.
  document.addEventListener("click", (e) => {
    const w = e.target.closest(".w"); if (!w || overview) return;
    e.stopPropagation(); showWord(w);
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("textarea,input")) return;
    if (e.key === "Escape") { closeSheet(); return; }
    const w = e.target.closest && e.target.closest(".w");
    if (w && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showWord(w); return; }
    if (!$("#sheet").hidden) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") go(cur + 1);
    if (e.key === "ArrowLeft" || e.key === "PageUp") go(cur - 1);
  });
  // On phones, the slide in view is the current one.
  const io = new IntersectionObserver((es) => {
    if (mode !== "stack") return;
    es.forEach((en) => { if (en.isIntersecting && en.intersectionRatio > 0.55) { cur = +en.target.dataset.i; update(); } });
  }, { threshold: [0.55] });
  $$(".slide").forEach((el) => io.observe(el));
  let rt = null;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(pickMode, 120); });
  pickMode(); update();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSlides);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
