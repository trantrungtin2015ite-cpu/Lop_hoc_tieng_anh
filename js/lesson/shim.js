// Shared state for the lesson: S.lang is the language used for board captions.
export const S = { lang: "vi" };

// Read English aloud with the device's own voice.
export function speakEn(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.9;
    const v = speechSynthesis.getVoices().find((x) => /^en(-|_)US/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}
