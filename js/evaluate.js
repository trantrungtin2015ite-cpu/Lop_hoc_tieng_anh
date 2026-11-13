// Scoring a spoken sentence.
// For now this uses simple rules, so the site costs nothing to run.
// Rules never award "excellent": that needs an AI check (grammar, natural, fuller than the
// suggestion), which will plug into evaluate() later without changing the screens.
import { S } from "./i18n.js";

const VI = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

// Higher = better. The first attempt sets the level, the best attempt records progress.
export const RANK = { excellent: 6, good: 5, minor: 4, mixed: 3, short: 3, vietnamese: 2, offtopic: 1, joke: 1, skip: 0 };

export const CATVI = {
  excellent: "xuất sắc", good: "đúng, ngang câu gợi ý", minor: "có lỗi nhưng hiểu được", short: "quá ngắn",
  mixed: "pha Việt và Anh", vietnamese: "tiếng Việt", offtopic: "lạc đề", joke: "nói đùa", skip: "chưa nói được"
};

function category(text, kw) {
  const s = text.trim();
  if (!s) return "skip";
  const words = s.split(/\s+/);
  const vi = words.filter((w) => VI.test(w)).length, en = words.length - vi;
  if (vi > 0 && en <= 1) return "vietnamese";
  if (vi > 0) return "mixed";
  if (words.length <= 2) return "short";
  const hit = kw.split("·").some((k) => s.toLowerCase().includes(k.trim().toLowerCase()));
  return hit && words.length >= 4 ? "good" : "minor";
}

function feedback(cat) {
  const L = S.lang === "vi", w = S.who, W = w === "thầy" ? "Thầy" : "Cô";
  const m = {
    good: [L ? "Câu rõ ràng, đúng tình huống." : "Clear and right for the moment.", ""],
    minor: ["", L ? "Lớp hiểu ý " + w + ". Câu này nghe tự nhiên hơn:" : "The class understood you. This sounds more natural:"],
    short: ["", L ? "Thêm vài từ nữa sẽ trọn câu hơn:" : "A few more words make it a full sentence:"],
    mixed: [L ? "Phần tiếng Anh dùng tốt." : "Your English part works well.", L ? "Phần còn lại có thể nói:" : "The rest could be:"],
    vietnamese: ["", L ? "Lần sau thử câu ngắn này:" : "Next time, try this short line:"],
    skip: ["", L ? "Một câu ngắn để thử:" : "A short line to try:"],
    offtopic: ["", L ? "Câu chưa khớp tình huống. " + W + " thử nói lại nhé." : "That doesn't fit this moment. Try again."],
    joke: ["", L ? "Thử nói lại câu sẽ dùng thật trên lớp nhé." : "Try the line you would really use in class."]
  };
  return m[cat] || ["", ""];
}

// ctx: { kw, model, situation, choice, board }
export function evaluate(text, ctx) {
  const cat = category(text, ctx.kw);
  const [praise, fb] = feedback(cat);
  return Promise.resolve({
    cat, praise, feedback: fb,
    better: cat === "good" || cat === "joke" ? null : ctx.model
  });
}
