// Shared state for the lesson.
// S.lang: language for board captions. S.rate: reading speed for English (0.6 slow, 0.8 medium, 1 normal).
let saved = 0.8;
try { saved = parseFloat(localStorage.getItem("tts-rate")) || 0.8; } catch (e) {}
export const S = { lang: "vi", rate: saved };
export const RATES = [0.6, 0.8, 1];
export function setRate(r) { S.rate = r; try { localStorage.setItem("tts-rate", String(r)); } catch (e) {} }

// Read English aloud with the device's own voice, at the chosen speed.
export function speakEn(text, rate) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate || S.rate;
    const v = speechSynthesis.getVoices().find((x) => /^en(-|_)US/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

// Whether to show the Vietnamese-style approximate reading (cách đọc gần đúng).
let boiOn = true;
try { boiOn = localStorage.getItem("show-boi") !== "0"; } catch (e) {}
export function showBoi() { return boiOn; }
export function setBoi(v) { boiOn = v; try { localStorage.setItem("show-boi", v ? "1" : "0"); } catch (e) {} }
