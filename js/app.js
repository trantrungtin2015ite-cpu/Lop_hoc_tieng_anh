// Screens: start → scene 1 → choose lesson → guide → scene 2 → summary.
import { T, S, t, esc } from "./i18n.js";
import { OPT1, KW1, PACKS } from "./content.js";
import { classroom, bubbles, anim } from "./classroom.js";
import { makeBoard, boardCaption } from "./board.js";
import { Voice, playClip, speakEn, bell } from "./voice.js";
import { evaluate, RANK, CATVI } from "./evaluate.js";

const app = document.getElementById("app");
const voice = new Voice();
let micMode = "voice";      // "voice" = always-on mic, "type" = typing / keyboard mic
let micReason = "";         // why we fell back to typing
const $ = (id) => document.getElementById(id);
const top = () => window.scrollTo(0, 0);
const newScene = () => ({ choice: -1, attempts: [], comfort: 0, hint: false });

/* ---------------- speaking panel ---------------- */
function panelHTML(label, kw) {
  const hintRow =
    '<div class="row"><button type="button" class="small" id="hintBtn">' + t("hintBtn") + '</button>' +
    '<button type="button" class="small" id="cant">' + t("cant") + "</button></div>" +
    '<p class="hint" id="hintBox" hidden>' + esc(kw) + '</p><p class="err" id="err"></p>';
  if (micMode === "voice") {
    return '<div class="group"><h3>' + esc(label) + "</h3>" +
      '<p class="heard" id="heard" data-empty="' + esc(t("heardEmpty")) + '"></p>' +
      '<div class="confirm" id="confirm" hidden><textarea id="say"></textarea><p class="count" id="count"></p>' +
      '<div class="chips2"><button type="button" id="editBtn">' + t("edit") + '</button><button type="button" class="primary" id="sendNow">' + t("sendNow") + "</button></div></div>" +
      hintRow + "</div>";
  }
  return '<div class="group"><h3>' + esc(label) + "</h3>" +
    '<p class="muted">' + esc(t(micReason === "unsupported" ? "unsupported" : "denied")) + "</p>" +
    '<textarea id="say" placeholder="' + esc(t("ph")) + '"></textarea>' + hintRow +
    '<button type="button" class="primary big" id="sendNow">' + t("send") + "</button></div>";
}
function voiceBarHTML() {
  if (micMode !== "voice") return "";
  return '<div class="voicebar on" id="vb"><span class="dot" aria-hidden="true"></span><span class="lbl" id="vbl">' + t("micOn") +
    '</span><span class="lv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' +
    '<button type="button" id="muteBtn">' + t("mute") + "</button></div>";
}

let silenceTimer = null, countTimer = null;

// onSubmit(text, blob) returns false when the answer can't be taken yet (e.g. no option chosen).
function bindPanel(st, onSubmit) {
  const err = $("err"), hb = $("hintBox"), cant = $("cant");
  $("hintBtn").onclick = () => { st.hint = true; hb.hidden = false; };
  cant.onclick = () => {
    if (micMode !== "voice") { onSubmit("", null); return; }
    stopCount(); voice.pause();
    if (onSubmit("", null) !== false) hideConfirm(); else voice.resume();
  };
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    if (!st.attempts.length && !(($("heard") || {}).textContent)) { hb.hidden = false; cant.classList.add("sel"); }
  }, 10000);

  if (micMode === "type") {
    const say = $("say");
    say.oninput = () => { err.textContent = ""; };
    $("sendNow").onclick = () => {
      const text = say.value.trim();
      if (!text) { err.textContent = t("needSay"); return; }
      onSubmit(text, null);
    };
    return;
  }

  const heard = $("heard"), confirm = $("confirm"), say = $("say"), count = $("count");
  let pendingBlob = null;
  function stopCount() { clearInterval(countTimer); countTimer = null; }
  function hideConfirm() { confirm.hidden = true; heard.hidden = false; heard.textContent = ""; }
  function submit() {
    stopCount();
    const text = say.value.trim();
    if (!text) { err.textContent = t("needSay"); return; }
    if (onSubmit(text, pendingBlob) !== false) hideConfirm();
  }
  voice.on("partial", (txt) => { heard.textContent = txt; err.textContent = ""; hb.hidden = true; });
  voice.on("level", (v) => {
    const bars = document.querySelectorAll("#vb .lv i");
    bars.forEach((b, i) => { b.style.height = Math.max(4, Math.min(20, v * 20 * (0.6 + 0.4 * Math.sin(i + v * 9)))) + "px"; });
  });
  voice.on("state", setBar);
  voice.on("utterance", (u) => {
    voice.pause();
    pendingBlob = u.blob;
    heard.hidden = true; confirm.hidden = false; say.value = u.text;
    let n = 3;
    count.textContent = t("count").replace("{n}", n);
    stopCount();
    countTimer = setInterval(() => {
      n -= 1;
      if (n <= 0) submit(); else count.textContent = t("count").replace("{n}", n);
    }, 1000);
  });
  $("editBtn").onclick = () => { stopCount(); count.textContent = t("editHint"); say.focus(); };
  $("sendNow").onclick = submit;
  say.oninput = stopCount;
  $("muteBtn").onclick = () => { voice.toggleMute(); };
  // Called after feedback, when the user chooses "Nói lại".
  st.listenAgain = () => { hideConfirm(); err.textContent = ""; pendingBlob = null; voice.resume(); };
}
function setBar(state) {
  const vb = $("vb"), lbl = $("vbl"), mb = $("muteBtn");
  if (state === "denied") { micMode = "type"; micReason = "denied"; if (current) current(); return; }
  if (!vb) return;
  vb.classList.toggle("on", state === "listening");
  lbl.textContent = state === "listening" ? t("micOn") : state === "muted" ? t("micMuted") : t("micPaused");
  mb.textContent = voice.muted ? t("unmute") : t("mute");
}
let current = null; // re-renders the current scene when the mic falls back to typing

/* ---------------- comfort and feedback ---------------- */
function facesHTML() {
  const mouths = ["M10 25 q7 -6 14 0", "M11 24 q6 -3 12 0", "M11 23 h12", "M11 22 q6 3 12 0", "M10 21 q7 7 14 0"];
  return '<div class="group"><h3>' + esc(t("comfort")) + '</h3><div class="faces">' + mouths.map((m, i) =>
    '<button type="button" data-n="' + (i + 1) + '"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="14" r="1.8" fill="currentColor"/><circle cx="22" cy="14" r="1.8" fill="currentColor"/><path d="' + m + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' + esc(t("f")[i]) + "</button>").join("") + "</div></div>";
}
function askComfort(box, st, then) {
  if (st.comfort) { then(); return; }
  box.innerHTML = '<div class="card">' + facesHTML() + "</div>";
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  box.querySelectorAll(".faces button").forEach((b) => { b.onclick = () => { st.comfort = +b.dataset.n; then(); }; });
}
function feedbackCard(box, res, onRetry, onNext) {
  let h = '<div class="card">';
  if (res.praise) h += '<p class="praise">' + esc(res.praise) + "</p>";
  if (res.cat === "excellent") h += '<p class="muted">' + esc(t("saved")) + " " + esc(t("tryUp")) + "</p>";
  if (res.feedback) h += "<p>" + esc(res.feedback) + "</p>";
  if (res.better) h += '<div class="model"><span class="en">' + esc(res.better) + '</span></div><div class="row"><button type="button" class="small" id="listen">' + t("listen") + "</button></div>";
  h += '<div class="chips2"><button type="button" id="retry">' + t("retry") + '</button><button type="button" class="primary" id="nextBtn">' + t("next") + "</button></div></div>";
  box.innerHTML = h;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  const l = $("listen"); if (l) l.onclick = () => speakEn(res.better);
  $("retry").onclick = onRetry; $("nextBtn").onclick = onNext;
}
// Shared: comfort (first time) → evaluate → play the user's voice → class reacts → feedback.
function respond(st, text, blob, ctx, react, onNext, listenEl) {
  const fb = $("fb");
  askComfort(fb, st, async () => {
    fb.innerHTML = (listenEl || "") + '<p class="sub" id="fbsub">' + esc(t("listening")) + "</p>";
    const res = await evaluate(text, ctx);
    st.attempts.push({ text, cat: res.cat, hint: st.hint });
    if (res.cat === "excellent") S.saved.push(text);
    if (blob) { $("fbsub").textContent = t("replay"); await playClip(blob); }
    react(res.cat);
    const sub = $("fbsub"); if (sub) sub.remove();
    const holder = document.createElement("div"); fb.appendChild(holder);
    feedbackCard(holder, res, () => {
      fb.innerHTML = "";
      if (micMode === "voice" && st.listenAgain) st.listenAgain(); else { const s = $("say"); if (s) { s.value = ""; s.focus(); } }
    }, onNext);
  });
}

/* ---------------- screens ---------------- */
function renderStart() {
  current = null;
  app.innerHTML = '<header class="group"><h1>' + t("start") + '</h1><p class="muted">' + t("lead") + "</p></header>" +
    '<div class="card"><div class="group"><h3>' + T.vi.who + " / " + T.en.who + '</h3><div class="chips2"><button type="button" data-who="thầy">Thầy</button><button type="button" data-who="cô">Cô</button></div></div>' +
    '<div class="group"><h3>' + T.vi.lang + " / " + T.en.lang + '</h3><div class="chips2"><button type="button" data-lang="vi">Tiếng Việt</button><button type="button" data-lang="en">English</button></div></div>' +
    '<button type="button" class="primary big" id="enter">' + t("enter") + "</button></div>";
  const mark = () => {
    app.querySelectorAll("[data-who]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.who === S.who)));
    app.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === S.lang)));
    $("enter").textContent = t("enter");
  };
  app.querySelectorAll("[data-who]").forEach((b) => { b.onclick = () => { S.who = b.dataset.who; mark(); }; });
  app.querySelectorAll("[data-lang]").forEach((b) => { b.onclick = () => { S.lang = b.dataset.lang; mark(); }; });
  mark();
  $("enter").onclick = async () => {
    bell();
    S.s1 = newScene(); S.s2 = newScene(); S.saved = [];
    if (!voice.active) {
      const ok = await voice.start();
      micMode = ok ? "voice" : "type";
      micReason = voice.supported ? "denied" : "unsupported";
    }
    renderScene1();
  };
}

function renderScene1() {
  current = renderScene1;
  const st = S.s1;
  app.innerHTML = "<h2>" + t("s1t") + "</h2>" + classroom("cls") + '<p class="sub" id="sub"></p>' +
    '<div class="card"><p>' + esc(t("s1q")) + '</p><div class="group">' +
    OPT1.map((o, i) => '<label class="opt" for="o' + i + '"><input type="radio" name="o1" id="o' + i + '" value="' + i + '"' + (st.choice === i ? " checked" : "") + '><span><b>' + "ABC"[i] + ".</b> " + esc(o[S.lang]) + "</span></label>").join("") +
    "</div>" + panelHTML(t(micMode === "voice" ? "say1v" : "say1"), KW1) + '</div><div id="fb"></div>' + voiceBarHTML();
  top();
  const cls = $("cls");
  setTimeout(() => { cls.classList.add("standing"); $("sub").textContent = S.lang === "vi" ? "Lớp trưởng: Cả lớp đứng!" : "Class monitor: Stand up, everyone!"; }, 400);
  app.querySelectorAll('input[name="o1"]').forEach((r) => { r.onchange = () => { st.choice = +r.value; $("err").textContent = ""; }; });
  bindPanel(st, (text, blob) => {
    if (st.choice < 0) { $("err").textContent = t("needOpt"); return false; }
    const o = OPT1[st.choice];
    respond(st, text, blob, { kw: KW1, model: o.model, situation: "Chào lớp đầu tiết bằng tiếng Anh", choice: o.vi },
      (cat) => react1(cls, cat),
      () => { voice.pause(); cls.classList.remove("standing"); setTimeout(renderTopic, 350); });
  });
  if (micMode === "voice") voice.resume();
}
function react1(svg, cat) {
  const vi = S.who === "thầy" ? "Chúng em chào thầy ạ!" : "Chúng em chào cô ạ!";
  const L = {
    excellent: ["bounce", [{ x: 110, y: 44, t: "Wow!" }, { x: 200, y: 78, t: "Good morning, teacher!" }, { x: 300, y: 44, t: "Wow!" }]],
    good: ["nod", [{ x: 190, y: 78, t: "Good morning, teacher!" }]],
    minor: ["nod", [{ x: 150, y: 78, t: "Good morning!" }, { x: 270, y: 110, t: "Good morning!" }]],
    short: ["nod", [{ x: 190, y: 78, t: "Good morning!" }]],
    mixed: ["nod", [{ x: 190, y: 78, t: "Good morning!" }]],
    vietnamese: ["nod", [{ x: 190, y: 78, t: vi }]],
    skip: ["nod", [{ x: 190, y: 78, t: vi }]],
    offtopic: [null, []], joke: [null, []]
  };
  const r = L[cat] || L.minor;
  svg.classList.add("standing"); anim(svg, r[0]); bubbles(svg, r[1]);
  if (cat !== "offtopic" && cat !== "joke") setTimeout(() => svg.classList.remove("standing", "bounce", "nod"), 1700);
}

function renderTopic() {
  current = null;
  app.innerHTML = '<header class="group"><h2>' + t("topicT") + '</h2><p class="muted">' + t("topicL") + '</p></header><div class="group">' +
    PACKS.map((p, i) => '<button type="button" class="topic" data-i="' + i + '"><b style="font-weight:600">' + esc(p[S.lang]) + "</b><span>" + esc(p.grade) + "</span></button>").join("") + "</div>";
  top();
  app.querySelectorAll(".topic").forEach((b) => { b.onclick = () => { S.pack = PACKS[+b.dataset.i]; renderGuide(); }; });
}

function renderGuide() {
  current = null;
  voice.pause();
  const P = S.pack;
  app.innerHTML = "<h2>" + t("guideT") + '</h2><div class="card"><p>' + P.guide[S.lang] + "</p></div>" +
    '<div class="row"><button type="button" class="primary" id="demo">' + t("demo") + '</button><button type="button" id="prac">' + t("practice") + "</button></div>" +
    '<p class="rotate">' + t("rotate") + '</p><svg id="bd" class="board" viewBox="0 0 380 256" role="img" aria-label="' + esc(P[S.lang]) + '"></svg><p class="status" id="cap"></p>' +
    '<div class="chips2"><button type="button" id="skip">' + t("skip") + '</button><button type="button" class="primary" id="go">' + t("go") + "</button></div>";
  top();
  const cap = $("cap");
  let practicing = false;
  const B = makeBoard($("bd"), P, (ev) => { if (ev.type === "demo" || practicing) cap.textContent = boardCaption(ev, P); });
  cap.textContent = S.lang === "vi" ? "Bấm xem mô phỏng trước, rồi chạy thử." : "Watch the demo first, then try it.";
  $("demo").onclick = () => { practicing = false; B.demo(() => { cap.textContent = S.lang === "vi" ? "Giờ thầy cô chạy thử nhé." : "Now try it yourself."; }); };
  $("prac").onclick = () => { B.clear(); practicing = true; cap.textContent = t("tryHint"); };
  $("skip").onclick = renderScene2; $("go").onclick = renderScene2;
  setTimeout(() => { const b = $("demo"); if (b) b.click(); }, 500);
}

function renderScene2() {
  current = renderScene2;
  const P = S.pack, st = S.s2;
  st.board = st.board || { wrong: 0, labels: [], traces: [], taps: [] };
  const bdat = st.board;
  app.innerHTML = "<h2>" + t("s2t") + '</h2><div class="card"><p>' + esc(P.q[S.lang]) + "</p></div>" +
    '<p class="rotate">' + t("rotate") + '</p><svg id="bd" class="board" viewBox="0 0 380 256" role="img" aria-label="' + esc(P[S.lang]) + '"></svg>' +
    '<div class="row" style="justify-content:space-between;align-items:center"><p class="status" id="cap">' + esc(t("tryHint")) + '</p><button type="button" class="small" id="clr">' + t("clear") + "</button></div>" +
    '<div class="card">' + panelHTML(t(micMode === "voice" ? "say2v" : "say2"), P.kw) + '</div><div id="fb"></div>' + voiceBarHTML();
  top();
  const cap = $("cap");
  const B = makeBoard($("bd"), P, (ev) => {
    cap.textContent = boardCaption(ev, P);
    if (ev.type === "trace" && ev.parts.length) bdat.traces.push(ev.parts.map((r) => r.vi).join(" + "));
    if (ev.type === "tap") bdat.taps.push(ev.name);
    if (ev.type === "wrong") bdat.wrong++;
    if (ev.type === "label") bdat.labels.push(ev.word);
  });
  $("clr").onclick = () => { B.clear(); cap.textContent = t("tryHint"); };
  bindPanel(st, (text, blob) => {
    const board = "lướt: " + (bdat.traces.join("; ") || "không") + ". chạm: " + (bdat.taps.join("; ") || "không") +
      ". nhãn đúng: " + (bdat.labels.join(", ") || "không") + ". đặt sai: " + bdat.wrong + " lần.";
    respond(st, text, blob, { kw: P.kw, model: P.model, situation: "Giảng trên bảng: " + P.q.vi, choice: "thao tác trên bảng và nói", board },
      (cat) => {
        const cls = $("cls2");
        const R2 = { excellent: ["bounce", [{ x: 110, y: 44, t: "Wow!" }, { x: 270, y: 78, t: "I see!" }]], good: ["nod", [{ x: 190, y: 78, t: "Oh, I see." }]], minor: ["nod", [{ x: 190, y: 78, t: "I see." }]] };
        const r = R2[cat] || ["nod", [{ x: 190, y: 78, t: "Dạ." }]];
        anim(cls, r[0]); bubbles(cls, r[1]);
      },
      () => { voice.pause(); renderEnd(); },
      classroom("cls2"));
  });
  if (micMode === "voice") voice.resume();
}

/* ---------------- summary ---------------- */
function best(at) { let b = null; at.forEach((a) => { if (!b || RANK[a.cat] > RANK[b.cat]) b = a; }); return b; }
function renderEnd() {
  current = null;
  voice.pause();
  const s1 = S.s1, s2 = S.s2, P = S.pack, bd = s2.board || { wrong: 0, labels: [], traces: [], taps: [] };
  const rows = (st) => {
    const f = st.attempts[0], b = best(st.attempts);
    return [["Số lần nói", st.attempts.length], ["Lần đầu (dùng để xếp mức)", f ? CATVI[f.cat] : "–"], ["Lần tốt nhất (ghi nhận tiến bộ)", b ? CATVI[b.cat] : "–"],
      ["Mức thoải mái", st.comfort ? st.comfort + "/5" : "–"], ["Dùng gợi ý từ khóa", st.hint ? "có" : "không"]];
  };
  const r1 = [["Cách xử lý đã chọn", s1.choice >= 0 ? "ABC"[s1.choice] + ". " + OPT1[s1.choice].vi : "–"]].concat(rows(s1));
  const r2 = [["Bài", P.vi]].concat(rows(s2)).concat([["Lướt trên bảng", bd.traces.join("; ") || "không"], ["Chạm vào", bd.taps.join("; ") || "không"],
    ["Nhãn đặt đúng", bd.labels.join(", ") || "không"], ["Số lần đặt nhãn sai", bd.wrong], ["Cách nói", micMode === "voice" ? "micro luôn mở" : "gõ chữ hoặc micro bàn phím"]]);
  const tbl = (r) => '<div class="sum">' + r.map((x) => "<div><span>" + esc(x[0]) + "</span><span>" + esc(x[1]) + "</span></div>").join("") + "</div>";
  app.innerHTML = '<header class="group"><h1>' + t("endT") + '</h1><p class="muted">' + t("endL") + "</p></header>" +
    '<div class="card"><h2>Cảnh 1: Chào lớp</h2>' + tbl(r1) + '</div><div class="card"><h2>Cảnh 2: Giảng trên bảng</h2>' + tbl(r2) + "</div>" +
    (S.saved.length ? '<div class="card"><h3>Câu được lưu vào kịch bản riêng</h3>' + S.saved.map((x) => '<p>"' + esc(x) + '"</p>').join("") + "</div>" : "") +
    '<div class="chips2"><button type="button" id="copy">' + t("copy") + '</button><button type="button" id="again">' + t("again") + '</button></div><p class="muted" id="cn"></p>';
  top();
  $("again").onclick = renderStart;
  $("copy").onclick = () => {
    const said = (st) => st.attempts.map((a) => '"' + (a.text || "[chưa nói]") + '" (' + CATVI[a.cat] + ")").join(" | ");
    const txt = "Kết quả cảnh 1 và 2 (" + S.who + ", hướng dẫn " + (S.lang === "vi" ? "tiếng Việt" : "tiếng Anh") + ")\nCảnh 1:\n" +
      r1.map((x) => "- " + x[0] + ": " + x[1]).join("\n") + "\nCâu đã nói: " + said(s1) +
      "\nCảnh 2:\n" + r2.map((x) => "- " + x[0] + ": " + x[1]).join("\n") + "\nCâu đã nói: " + said(s2);
    const cn = $("cn");
    try { navigator.clipboard.writeText(txt).then(() => { cn.textContent = t("copied"); }, () => { cn.textContent = t("copyFail"); }); }
    catch (e) { cn.textContent = t("copyFail"); }
  };
}

renderStart();
