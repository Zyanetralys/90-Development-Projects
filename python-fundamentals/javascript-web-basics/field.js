<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OFFICIAL</title>
  <style>
    :root {
      --bg-primary: #080a0f;
      --bg-secondary: #0f131a;
      --bg-tertiary: #161b25;
      --accent: #00d4aa;
      --accent-dim: rgba(0, 212, 170, 0.15);
      --accent-glow: rgba(0, 212, 170, 0.35);
      --text-primary: #e6e9f0;
      --text-secondary: #8b95a5;
      --text-dim: #4a5568;
      --border: #232a36;
      --font-mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
      --font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      background: 
        radial-gradient(ellipse at 20% 10%, #0c121c 0%, transparent 65%),
        radial-gradient(ellipse at 80% 90%, #0a0f17 0%, transparent 65%),
        var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow-x: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        linear-gradient(90deg, transparent 49.8%, var(--accent-dim) 50%, transparent 50.2%) 0 0/4px 4px,
        linear-gradient(0deg, transparent 49.8%, var(--accent-dim) 50%, transparent 50.2%) 0 0/4px 4px;
      opacity: 0.025;
      pointer-events: none;
      animation: grid-drift 24s linear infinite;
    }

    @keyframes grid-drift {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 4px 4px, 4px 4px; }
    }

    .container {
      max-width: 820px;
      width: 100%;
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 2rem;
      position: relative;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.65);
    }

    .container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.5;
    }

    .header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .classification {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-dim);
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 0.6rem;
    }

    .title {
      font-family: var(--font-mono);
      font-size: 1.4rem;
      font-weight: 400;
      letter-spacing: 9px;
      text-transform: uppercase;
      color: var(--text-primary);
      margin-bottom: 0.3rem;
    }

    .subtitle {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--accent);
      letter-spacing: 2px;
      opacity: 0.85;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-secondary);
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.2rem;
    }

    .status-indicator { display: flex; align-items: center; gap: 0.4rem; }
    .status-dot { width: 5px; height: 5px; background: var(--text-dim); border-radius: 50%; transition: background 0.25s; }
    .status-dot.active { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); animation: pulse 2.5s infinite; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .bpm { font-family: var(--font-mono); font-size: 1.6rem; font-weight: 300; color: var(--accent); text-align: center; margin: 1rem 0; letter-spacing: 4px; }
    .section-display { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); text-align: center; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 1.2rem; min-height: 1rem; }

    .controls { display: flex; gap: 0.8rem; justify-content: center; margin: 1rem 0; }
    button {
      font-family: var(--font-mono); font-size: 0.7rem; font-weight: 400; text-transform: uppercase; letter-spacing: 2px;
      padding: 0.65rem 1.6rem; background: transparent; color: var(--accent); border: 1px solid var(--accent);
      border-radius: 2px; cursor: pointer; transition: all 0.18s ease; position: relative; overflow: hidden;
    }
    button::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, var(--accent-dim), transparent); transition: left 0.25s; }
    button:hover::before { left: 100%; }
    button:hover { background: var(--accent-dim); box-shadow: 0 0 18px var(--accent-glow); }
    button:active { transform: scale(0.98); }
    button.stop { color: var(--text-secondary); border-color: var(--border); }
    button.stop:hover { color: var(--text-primary); border-color: var(--text-secondary); background: var(--bg-tertiary); box-shadow: none; }

    .sliders { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin: 0.8rem 0 1.2rem; }
    .slider-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .slider-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
    input[type="range"] { -webkit-appearance: none; width: 100%; height: 3px; background: var(--bg-tertiary); border-radius: 2px; outline: none; }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: var(--accent); border-radius: 50%; cursor: pointer; box-shadow: 0 0 6px var(--accent-glow); }
    input[type="range"]::-moz-range-thumb { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; cursor: pointer; border: none; }

    .visualizers { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.2rem; }
    .viz-box { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 2px; height: 70px; position: relative; overflow: hidden; }
    .viz-box canvas { width: 100%; height: 100%; display: block; }

    .status-text { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary); text-align: center; margin: 0.6rem 0; min-height: 1rem; }

    .metadata { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); line-height: 1.8; padding: 0.8rem; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 2px; margin-top: 1rem; }
    .metadata-row { display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 1px dashed var(--border); }
    .metadata-row:last-child { border-bottom: none; }
    .metadata-label { color: var(--text-secondary); }
    .metadata-value { color: var(--accent); }

    .footer { text-align: center; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); margin-top: 1.2rem; padding-top: 0.8rem; border-top: 1px solid var(--border); letter-spacing: 1px; }
    .scanline { position: fixed; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.06; animation: scan 4.5s linear infinite; pointer-events: none; z-index: 1; }
    @keyframes scan { 0% { top: -5%; } 100% { top: 105%; } }

    @media (max-width: 600px) {
      .container { padding: 1.2rem; }
      .title { font-size: 1.1rem; letter-spacing: 5px; }
      .bpm { font-size: 1.3rem; }
      .controls { flex-direction: column; }
      button { width: 100%; }
      .sliders { grid-template-columns: 1fr; }
      .visualizers { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="scanline"></div>
  
  <div class="container">
    <header class="header">
      <div class="classification">classified // audio asset</div>
      <h1 class="title">OFFICIAL</h1>
      <div class="subtitle">operational signature</div>
    </header>

    <div class="status-bar">
      <div class="status-indicator">
        <div class="status-dot" id="statusDot"></div>
        <span id="statusText">idle</span>
      </div>
      <span id="timestamp">--:--:--</span>
    </div>

    <div class="bpm" id="bpmDisplay">92 BPM</div>
    <div class="section-display" id="sectionDisplay">awaiting execution</div>

    <div class="controls">
      <button id="startBtn">execute</button>
      <button id="stopBtn" class="stop">terminate</button>
    </div>

    <div class="sliders">
      <div class="slider-group">
        <span class="slider-label">intensity</span>
        <input type="range" id="intensity" min="0" max="100" value="40">
      </div>
      <div class="slider-group">
        <span class="slider-label">filter</span>
        <input type="range" id="filterCutoff" min="100" max="12000" value="800">
      </div>
      <div class="slider-group">
        <span class="slider-label">reverb</span>
        <input type="range" id="reverbMix" min="0" max="100" value="65">
      </div>
    </div>

    <div class="status-text" id="statusMessage">system ready. awaiting command.</div>

    <div class="visualizers">
      <div class="viz-box"><canvas id="waveCanvas"></canvas></div>
      <div class="viz-box"><canvas id="specCanvas"></canvas></div>
    </div>

    <div class="metadata">
      <div class="metadata-row"><span class="metadata-label">tempo</span><span class="metadata-value">92 bpm</span></div>
      <div class="metadata-row"><span class="metadata-label">key</span><span class="metadata-value">c# minor → e major</span></div>
      <div class="metadata-row"><span class="metadata-label">duration</span><span class="metadata-value">4:18</span></div>
      <div class="metadata-row"><span class="metadata-label">classification</span><span class="metadata-value">restricted</span></div>
      <div class="metadata-row"><span class="metadata-label">origin</span><span class="metadata-value">field ops</span></div>
    </div>

    <div class="footer">
     audio synthesis engine v3.4.1 // cinematic grade // secure channel
    </div>
  </div>

  <script>
    // ==========================================
    // AUDIO ENGINE
    // ==========================================
    const Engine = {
      ctx: null, master: null, comp: null, conv: null, delay: null, analyser: null, dry: null, wet: null,
      isActive: false, nextTime: 0, beat: 0, schedulerTimer: null, animId: null,
      params: { intensity: 0.4, filter: 800, reverb: 0.65 },

      init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        this.master = this.ctx.createGain();
        this.master.gain.value = 0.75;

        this.comp = this.ctx.createDynamicsCompressor();
        this.comp.threshold.value = -20;
        this.comp.ratio.value = 4;
        this.comp.knee.value = 8;
        this.comp.attack.value = 0.003;
        this.comp.release.value = 0.25;

        this.conv = this.ctx.createConvolver();
        this.conv.buffer = this.createIR(2.5, 4);

        this.delay = this.ctx.createDelay();
        this.delay.delayTime.value = 0.75; // 3/4 note at ~92bpm
        const delayFb = this.ctx.createGain(); delayFb.gain.value = 0.35;
        const delayFilter = this.ctx.createBiquadFilter(); delayFilter.type = 'highpass'; delayFilter.frequency.value = 400;
        this.delay.connect(delayFilter); delayFilter.connect(delayFb); delayFb.connect(this.delay);

        this.dry = this.ctx.createGain(); this.dry.gain.value = 0.7;
        this.wet = this.ctx.createGain(); this.wet.gain.value = this.params.reverb;

        // Routing
        this.master.connect(this.comp);
        this.comp.connect(this.analyser);
        this.comp.connect(this.dry);
        this.comp.connect(this.conv);
        this.comp.connect(this.delay);
        this.delay.connect(this.wet);
        this.dry.connect(this.ctx.destination);
        this.conv.connect(this.wet);
        this.wet.connect(this.ctx.destination);
      },

      createIR(duration, decay) {
        const rate = this.ctx.sampleRate;
        const len = rate * duration;
        const buf = this.ctx.createBuffer(2, len, rate);
        for (let ch = 0; ch < 2; ch++) {
          const d = buf.getChannelData(ch);
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
        }
        return buf;
      },

      freq(note) { return 440 * Math.pow(2, (note - 69) / 12); },

      playNote(time, note, duration, type = 'sine', gainVal = 0.1, filterFreq = 2000, filterQ = 0.5) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        o.type = type; o.frequency.value = this.freq(note);
        f.type = 'lowpass'; f.frequency.value = filterFreq; f.Q.value = filterQ;
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(gainVal * this.params.intensity, time + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        o.connect(f); f.connect(g); g.connect(this.master);
        o.start(time); o.stop(time + duration + 0.1);
      },

      playPad(time, duration, chord, intensity = 0.3) {
        chord.forEach((n, i) => {
          const t = time + i * 0.08;
          const o1 = this.ctx.createOscillator();
          const o2 = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          const f = this.ctx.createBiquadFilter();
          o1.type = 'sawtooth'; o2.type = 'triangle';
          o1.frequency.value = this.freq(n); o2.frequency.value = this.freq(n + 0.01);
          f.type = 'lowpass';
          f.frequency.setValueAtTime(300 + this.params.filter * 0.4, t);
          f.frequency.linearRampToValueAtTime(1500 + this.params.filter * 0.5, t + duration * 0.6);
          f.Q.value = 0.6;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.15 * intensity * this.params.intensity, t + duration * 0.4);
          g.gain.exponentialRampToValueAtTime(0.001, t + duration);
          o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.master);
          o1.start(t); o2.start(t); o1.stop(t + duration); o2.stop(t + duration);
        });
      },

      playLead(time, note, duration, intensity = 0.4) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        const delay = this.ctx.createDelay(); delay.delayTime.value = 0.4;
        const delayG = this.ctx.createGain(); delayG.gain.value = 0.25;
        const fDelay = this.ctx.createBiquadFilter(); fDelay.type = 'bandpass'; fDelay.frequency.value = 1200; fDelay.Q.value = 2;

        o.type = 'square';
        o.frequency.setValueAtTime(this.freq(note), time);
        o.frequency.linearRampToValueAtTime(this.freq(note - 2), time + duration * 0.5);

        f.type = 'lowpass';
        f.frequency.setValueAtTime(600, time);
        f.frequency.exponentialRampToValueAtTime(400 + this.params.filter * 0.8, time + duration * 0.2);
        f.Q.value = 1.2;

        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(0.2 * intensity * this.params.intensity, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);

        o.connect(f); f.connect(g); g.connect(this.master);
        g.connect(delay); delay.connect(fDelay); fDelay.connect(delayG); delayG.connect(this.master);
        o.start(time); o.stop(time + duration + 0.1);
      },

      playKick(time, intensity = 0.6) {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        const sub = this.ctx.createOscillator();
        const subG = this.ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(65, time); o.frequency.exponentialRampToValueAtTime(38, time + 0.12);
        sub.type = 'sine'; sub.frequency.value = 32;
        f.type = 'lowpass'; f.frequency.value = 250; f.Q.value = 0.4;
        g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(0.45 * intensity * this.params.intensity, time + 0.005); g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        subG.gain.setValueAtTime(0, time); subG.gain.linearRampToValueAtTime(0.3 * intensity * this.params.intensity, time + 0.01); subG.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        o.connect(f); f.connect(g); g.connect(this.master);
        sub.connect(subG); subG.connect(this.master);
        o.start(time); o.stop(time + 0.3); sub.start(time); sub.stop(time + 0.4);
      },

      playSnare(time, intensity = 0.5) {
        const n = this.ctx.createBufferSource();
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        n.buffer = buf;
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
        const t = this.ctx.createOscillator(); t.frequency.value = 210; const tg = this.ctx.createGain(); tg.gain.value = 0.15 * intensity * this.params.intensity;
        g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(0.35 * intensity * this.params.intensity, time + 0.002); g.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        n.connect(f); f.connect(g); g.connect(this.master);
        t.connect(tg); tg.connect(this.master);
        n.start(time); n.stop(time + 0.15); t.start(time); t.stop(time + 0.08);
      },

      playHat(time, intensity = 0.3, open = false) {
        const n = this.ctx.createBufferSource();
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * (open ? 0.1 : 0.04), this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        n.buffer = buf;
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 9000;
        g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(0.2 * intensity * this.params.intensity, time + 0.001); g.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.08 : 0.025));
        n.connect(f); f.connect(g); g.connect(this.master);
        n.start(time); n.stop(time + (open ? 0.1 : 0.04));
      },

      scheduleSection(time, section) {
        const B = 60 / 92;
        if (section === 'awaken') {
          this.playPad(time, B * 16, [49, 53, 56, 61], 0.3);
          for (let i = 0; i < 16; i++) if (i % 4 === 0) this.playKick(time + i * B, 0.4);
        } else if (section === 'ascend') {
          const prog = [[49, 53, 56], [56, 60, 63], [52, 56, 59], [54, 58, 61]];
          for (let i = 0; i < 32; i += 8) this.playPad(time + i * B, B * 8, prog[i/8], 0.45);
          for (let i = 0; i < 32; i++) {
            if (i % 4 === 0) this.playKick(time + i * B, 0.6);
            if (i % 4 === 2) this.playSnare(time + i * B, 0.5);
            if (i % 2 === 0) this.playHat(time + i * B, 0.3, false);
            this.playHat(time + i * B + B * 0.5, 0.2, true);
          }
          for (let i = 0; i < 8; i++) if (i % 2 === 0) this.playLead(time + (i * 4 + 1) * B, B * 3, [64, 66, 68, 71][i/2], 0.5);
        } else if (section === 'climax') {
          const prog = [[56, 60, 63, 66], [52, 56, 59, 63], [49, 53, 56, 60], [54, 58, 61, 65]];
          for (let i = 0; i < 32; i += 8) this.playPad(time + i * B, B * 8, prog[i/8], 0.7);
          for (let i = 0; i < 32; i++) {
            this.playKick(time + i * B, 0.8);
            if (i % 4 === 2) this.playSnare(time + i * B, 0.7);
            this.playHat(time + i * B + B * 0.25, 0.4, false);
            this.playHat(time + i * B + B * 0.75, 0.3, true);
          }
          const melody = [68, 71, 73, 76, 73, 71, 68, 64];
          for (let i = 0; i < 32; i += 2) this.playLead(time + (i + 1) * B, B * 1.8, melody[(i/2) % melody.length], 0.8);
        } else if (section === 'resonance') {
          this.playPad(time, B * 16, [61, 64, 68, 71], 0.5);
          for (let i = 0; i < 16; i++) {
            if (i % 8 === 0) this.playKick(time + i * B, 0.3);
            if (i % 4 === 0) this.playHat(time + i * B, 0.15, true);
          }
          for (let i = 0; i < 4; i++) this.playLead(time + (i * 4 + 2) * B, B * 4, [76, 73, 71, 68][i], 0.6);
        }
      },

      scheduler() {
        while (this.nextTime < this.ctx.currentTime + 0.1) {
          const B = 60 / 92;
          const bar = this.beat % 64;
          let section = 'awaken';
          if (bar >= 16) section = 'ascend';
          if (bar >= 48) section = 'climax';
          if (bar >= 80) section = 'resonance';
          
          document.getElementById('sectionDisplay').textContent = section.replace(/([A-Z])/g, ' $1').trim();
          this.scheduleSection(this.nextTime, section);
          this.nextTime += B * 16;
          this.beat += 16;
        }
        this.schedulerTimer = setTimeout(() => this.scheduler(), 25);
      },

      start() {
        if (this.isActive) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.isActive = true;
        this.nextTime = this.ctx.currentTime + 0.05;
        this.beat = 0;
        this.scheduler();
        this.animate();
        document.getElementById('statusDot').classList.add('active');
        document.getElementById('statusText').textContent = 'active';
        document.getElementById('statusMessage').textContent = 'sequence executing';
      },

      stop() {
        if (!this.isActive) return;
        this.isActive = false;
        clearTimeout(this.schedulerTimer);
        cancelAnimationFrame(this.animId);
        this.ctx.close().then(() => {
          this.ctx = null;
          document.getElementById('statusDot').classList.remove('active');
          document.getElementById('statusText').textContent = 'idle';
          document.getElementById('statusMessage').textContent = 'sequence terminated';
          document.getElementById('sectionDisplay').textContent = 'awaiting execution';
        });
      },

      animate() {
        if (!this.isActive || !this.analyser) return;
        const time = this.ctx.currentTime;
        const bufLen = this.analyser.frequencyBinCount;
        const wave = new Float32Array(bufLen);
        const spec = new Uint8Array(bufLen);
        this.analyser.getByteTimeDomainData(wave);
        this.analyser.getByteFrequencyData(spec);

        // Waveform
        const c1 = document.getElementById('waveCanvas').getContext('2d');
        c1.fillStyle = '#080a0f'; c1.fillRect(0, 0, c1.canvas.width, c1.canvas.height);
        c1.lineWidth = 2; c1.strokeStyle = '#00d4aa'; c1.beginPath();
        const w = c1.canvas.width, h = c1.canvas.height;
        for (let i = 0; i < bufLen; i++) {
          const x = (i / bufLen) * w;
          const y = (wave[i] / 255) * h;
          i === 0 ? c1.moveTo(x, y) : c1.lineTo(x, y);
        }
        c1.stroke();

        // Spectrum
        const c2 = document.getElementById('specCanvas').getContext('2d');
        c2.fillStyle = '#080a0f'; c2.fillRect(0, 0, c2.canvas.width, c2.canvas.height);
        c2.lineWidth = 1; c2.strokeStyle = '#00d4aa'; c2.beginPath();
        const bars = 64, step = bufLen / bars;
        for (let i = 0; i < bars; i++) {
          const val = spec[Math.floor(i * step)] / 255;
          const h2 = val * c2.canvas.height;
          const x = i * (c2.canvas.width / bars);
          c2.rect(x + 2, c2.canvas.height - h2, (c2.canvas.width / bars) - 4, h2);
        }
        c2.fill();

        this.animId = requestAnimationFrame(() => this.animate());
      }
    };

    // ==========================================
    // UI & CONTROLS
    // ==========================================
    const UI = {
      init() {
        this.bindEvents();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
      },

      bindEvents() {
        document.getElementById('startBtn').onclick = () => Engine.start();
        document.getElementById('stopBtn').onclick = () => Engine.stop();
        document.getElementById('intensity').oninput = e => Engine.params.intensity = e.target.value / 100;
        document.getElementById('filterCutoff').oninput = e => Engine.params.filter = +e.target.value;
        document.getElementById('reverbMix').oninput = e => {
          Engine.params.reverb = e.target.value / 100;
          if (Engine.wet) Engine.wet.gain.value = Engine.params.reverb;
          if (Engine.dry) Engine.dry.gain.value = 1 - (Engine.params.reverb * 0.5);
        };
        document.addEventListener('keydown', e => {
          if (e.code === 'Space') { e.preventDefault(); Engine.isActive ? Engine.stop() : Engine.start(); }
        });
      },

      updateTime() {
        document.getElementById('timestamp').textContent = new Date().toISOString().slice(11, 19);
      },

      resizeCanvas() {
        ['waveCanvas', 'specCanvas'].forEach(id => {
          const c = document.getElementById(id);
          c.width = c.parentElement.clientWidth;
          c.height = c.parentElement.clientHeight;
        });
      }
    };

    window.addEventListener('load', () => UI.init());
  </script>
</body>
</html>
