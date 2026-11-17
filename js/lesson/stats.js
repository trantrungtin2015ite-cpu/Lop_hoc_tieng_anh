// What one student needed help with in this lesson, kept on their own device.
// Later (step 2) the same records are sent to the teacher's class summary.

export function makeStats(lessonId) {
  const KEY = "lesson-stats-" + lessonId;
  let d = { words: {}, tr: [], quiz: {} };
  try { d = Object.assign(d, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  return {
    lookup(key, word, vi) {
      const w = d.words[key] || (d.words[key] = { word, vi, n: 0 });
      w.n += 1; if (vi) w.vi = vi; save();
    },
    translated(vi, en) {
      const old = d.tr.find((x) => x.vi.toLowerCase() === vi.toLowerCase());
      if (old) { old.n += 1; old.en = en; } else d.tr.unshift({ vi, en, n: 1 });
      d.tr = d.tr.slice(0, 40); save();
    },
    quiz(id, ok) { if (!(id in d.quiz)) d.quiz[id] = { first: ok, tries: 0 }; d.quiz[id].tries += 1; if (ok) d.quiz[id].done = true; save(); },
    words() { return Object.values(d.words).sort((a, b) => b.n - a.n); },
    translations() { return d.tr; },
    quizzes() { return d.quiz; },
    clear() { d = { words: {}, tr: [], quiz: {} }; save(); }
  };
}
