// Always-on microphone for a scene.
// The browser asks for microphone permission once, on the first tap ("Vào lớp").
// After that the mic listens through the whole scene: speech is turned into text,
// a short pause (SILENCE_MS) ends a sentence, and the sentence is sent with an
// audio clip of the user's own voice for playback.

const SILENCE_MS = 1800;      // pause that ends a sentence
const START_LEVEL = 0.045;    // loudness that counts as speech for the recorder
const LANG = "en-US";         // recogniser language: the target is English

export class Voice {
  constructor() {
    this.SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.supported = !!this.SR && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    this.active = false;   // permission granted and session running
    this.paused = true;    // not listening right now (between scenes, during feedback)
    this.muted = false;    // user pressed "Tắt micro"
    this.handlers = {};
    this._reset();
  }

  on(name, fn) { this.handlers[name] = fn; }
  _emit(name, value) { const fn = this.handlers[name]; if (fn) fn(value); }
  _reset() { this.text = ""; this.interim = ""; this.lastHeard = 0; }

  // Must be called from a tap, so the browser allows the microphone and audio.
  async start() {
    if (!this.supported) { this._emit("state", "unsupported"); return false; }
    const AC = window.AudioContext || window.webkitAudioContext;
    try { this.ctx = AC ? new AC() : null; } catch (e) { this.ctx = null; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
    } catch (e) {
      this._emit("state", "denied");
      return false;
    }
    if (this.ctx) {
      try {
        if (this.ctx.state === "suspended") await this.ctx.resume();
        const src = this.ctx.createMediaStreamSource(this.stream);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 512;
        src.connect(this.analyser);
        this.buf = new Float32Array(this.analyser.fftSize);
      } catch (e) { this.analyser = null; }
    }
    if (window.MediaRecorder) {
      try { this.mr = new MediaRecorder(this.stream); } catch (e) { this.mr = null; }
    }
    this.active = true;
    this._loop();
    this._timer = setInterval(() => this._checkEnd(), 200);
    return true;
  }

  // ---- listening control ----
  resume() {
    if (!this.active || this.muted) return;
    this.paused = false;
    this._reset();
    this._startRecognition();
    this._emit("state", "listening");
  }
  pause() {
    this.paused = true;
    this._reset();
    if (this.rec) { try { this.rec.abort(); } catch (e) {} this.rec = null; }
    this._stopClip(true);
    this._emit("state", this.muted ? "muted" : "paused");
  }
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.pause(); else this.resume();
    return this.muted;
  }

  _startRecognition() {
    if (!this.active || this.paused || this.rec) return;
    const r = new this.SR();
    r.lang = LANG; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = (e) => {
      if (this.paused) return;
      let fin = "", int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fin += res[0].transcript; else int += res[0].transcript;
      }
      if (fin) this.text = (this.text + " " + fin).trim();
      this.interim = int.trim();
      this.lastHeard = performance.now();
      this._startClip();
      this._emit("partial", (this.text + " " + this.interim).trim());
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        this.active = false; this._emit("state", "denied");
      } else if (e.error === "audio-capture" && this.stream) {
        // Some phones cannot share the mic between recognition and recording:
        // keep recognition, drop the level meter and voice playback.
        this._dropStream();
      }
    };
    r.onend = () => {
      this.rec = null;
      if (this.active && !this.paused) setTimeout(() => this._startRecognition(), 250);
    };
    try { r.start(); this.rec = r; } catch (e) { this.rec = null; }
  }

  // A sentence ends after SILENCE_MS without new words.
  _checkEnd() {
    if (this.paused) return;
    const said = (this.text + " " + this.interim).trim();
    if (said && performance.now() - this.lastHeard > SILENCE_MS) {
      this._reset();
      this._stopClip(false).then((blob) => this._emit("utterance", { text: said, blob }));
    }
  }

  // ---- level meter and voice clip ----
  _loop() {
    if (!this.active) return;
    let level = 0;
    if (this.analyser && !this.paused) {
      this.analyser.getFloatTimeDomainData(this.buf);
      let sum = 0;
      for (let i = 0; i < this.buf.length; i++) sum += this.buf[i] * this.buf[i];
      level = Math.sqrt(sum / this.buf.length);
      if (level > START_LEVEL) this._startClip();
    } else if (!this.analyser && !this.paused && this.interim) {
      level = 0.05 + Math.random() * 0.05; // no meter on this phone: show activity from words
    }
    this._emit("level", Math.min(1, level * 8));
    requestAnimationFrame(() => this._loop());
  }
  _startClip() {
    if (!this.mr || this.paused || this.mr.state !== "inactive") return;
    this.chunks = [];
    this.mr.ondataavailable = (e) => { if (e.data && e.data.size) this.chunks.push(e.data); };
    try { this.mr.start(); } catch (e) {}
  }
  _stopClip(discard) {
    return new Promise((resolve) => {
      if (!this.mr || this.mr.state === "inactive") { resolve(null); return; }
      this.mr.onstop = () => {
        resolve(discard || !this.chunks.length ? null : new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" }));
      };
      try { this.mr.stop(); } catch (e) { resolve(null); }
    });
  }
  _dropStream() {
    try { this.stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
    this.stream = null; this.analyser = null; this.mr = null;
  }
}

// Play the user's own sentence back; resolves when it ends (or after 8 s at most).
export function playClip(blob) {
  return new Promise((resolve) => {
    if (!blob) { resolve(); return; }
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    const done = () => { URL.revokeObjectURL(url); resolve(); };
    a.onended = done; a.onerror = done;
    setTimeout(done, 8000);
    a.play().catch(done);
  });
}

// English model sentences, read by the browser's own voice.
export function speakEn(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.85;
    const v = speechSynthesis.getVoices().find((x) => /^en(-|_)US/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

export function bell() {
  try {
    const C = window.AudioContext || window.webkitAudioContext, ac = new C();
    [[880, 0], [660, 0.35]].forEach(([f, d]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ac.currentTime + d);
      g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d + 0.6);
      o.connect(g); g.connect(ac.destination);
      o.start(ac.currentTime + d); o.stop(ac.currentTime + d + 0.65);
    });
  } catch (e) {}
}
