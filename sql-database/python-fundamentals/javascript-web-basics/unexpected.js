<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OFFICIAL</title>
  <style>
    :root {
      --bg-primary: #050505;
      --bg-secondary: #0a0a0a;
      --bg-tertiary: #111;
      --accent: #ff003c;
      --accent-dim: rgba(255, 0, 60, 0.12);
      --accent-glow: rgba(255, 0, 60, 0.5);
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #333;
      --border: #222;
      --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      --font-sans: system-ui, -apple-system, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      background: 
        radial-gradient(ellipse at top, #080808 0%, transparent 70%),
        radial-gradient(ellipse at bottom, #050505 0%, transparent 70%),
        var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      overflow-x: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        linear-gradient(90deg, transparent 49.5%, var(--accent-dim) 50%, transparent 50.5%) 0 0/5px 5px,
        linear-gradient(0deg, transparent 49.5%, var(--accent-dim) 50%, transparent 50.5%) 0 0/5px 5px;
      opacity: 0.02;
      pointer-events: none;
      animation: grid-scroll 25s linear infinite;
    }

    @keyframes grid-scroll {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 5px 5px, 5px 5px; }
    }

    .container {
      max-width: 800px;
      width: 100%;
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 2.5rem;
      position: relative;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
    }

    .container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.4;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .classification {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-dim);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .title {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 400;
      letter-spacing: 8px;
      text-transform: uppercase;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent);
      letter-spacing: 2px;
      opacity: 0.9;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-secondary);
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--text-dim);
      border-radius: 50%;
      transition: background 0.3s;
    }

    .status-dot.active {
      background: var(--accent);
      box-shadow: 0 0 12px var(--accent-glow);
      animation: pulse-erratic 1.8s infinite;
    }

    @keyframes pulse-erratic {
      0%, 100% { opacity: 1; transform: scale(1); }
      45% { opacity: 0.3; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.1); }
      90% { opacity: 0.5; transform: scale(0.95); }
    }

    .bpm {
      font-family: var(--font-mono);
      font-size: 1.8rem;
      font-weight: 300;
      color: var(--accent);
      text-align: center;
      margin: 1.5rem 0;
      letter-spacing: 4px;
    }

    .section-display {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 2rem;
      min-height: 1.2rem;
    }

    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 1.5rem 0;
    }

    button {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 0.75rem 2rem;
      background: transparent;
      color: var(--accent);
      border: 1px solid var(--accent);
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    button::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, var(--accent-dim), transparent);
      transition: left 0.3s;
    }

    button:hover::before { left: 100%; }
    button:hover {
      background: var(--accent-dim);
      box-shadow: 0 0 25px var(--accent-glow);
    }

    button:active { transform: scale(0.98); }

    button.stop {
      color: var(--text-secondary);
      border-color: var(--border);
    }

    button.stop:hover {
      color: var(--text-primary);
      border-color: var(--accent);
      background: var(--bg-tertiary);
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .status-text {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
      margin: 1rem 0;
      min-height: 1rem;
    }

    .visualizer {
      width: 100%;
      height: 80px;
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 2px;
      margin: 1.5rem 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 2px;
      padding: 1rem;
      position: relative;
      overflow: hidden;
    }

    .visualizer::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(180deg, transparent 60%, var(--bg-primary) 100%);
      pointer-events: none;
    }

    .bar {
      width: 3px;
      background: var(--accent);
      border-radius: 1px 1px 0 0;
      transition: height 0.06s ease;
      min-height: 2px;
      opacity: 0.7;
    }

    .metadata {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-dim);
      line-height: 1.8;
      padding: 1rem;
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 2px;
      margin-top: 1.5rem;
    }

    .metadata-row {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      border-bottom: 1px dashed var(--border);
    }

    .metadata-row:last-child { border-bottom: none; }

    .metadata-label { color: var(--text-secondary); }
    .metadata-value { color: var(--accent); }

    .footer {
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-dim);
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      letter-spacing: 1px;
    }

    .scanline {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.08;
      animation: scan 3.5s linear infinite;
      pointer-events: none;
    }

    @keyframes scan {
      0% { top: -10%; }
      100% { top: 110%; }
    }

    .glitch-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      opacity: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        rgba(255, 0, 60, 0.03) 2px,
        rgba(255, 0, 60, 0.03) 4px
      );
      animation: glitch-flicker 8s infinite;
      z-index: 10;
    }

    @keyframes glitch-flicker {
      0%, 90%, 100% { opacity: 0; }
      92% { opacity: 0.15; }
      94% { opacity: 0; }
      96% { opacity: 0.08; }
      98% { opacity: 0; }
    }

    @media (max-width: 600px) {
      .container { padding: 1.5rem; }
      .title { font-size: 1.2rem; letter-spacing: 4px; }
      .bpm { font-size: 1.4rem; }
      .controls { flex-direction: column; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="scanline"></div>
  <div class="glitch-overlay"></div>
  
  <div class="container">
    <header class="header">
      <div class="classification">classified</div>
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

    <div class="bpm" id="bpmDisplay">54 BPM</div>
    <div class="section-display" id="sectionDisplay">awaiting execution</div>

    <div class="controls">
      <button id="startBtn">execute</button>
      <button id="stopBtn" class="stop">terminate</button>
    </div>

    <div class="status-text" id="statusMessage">system ready. awaiting command.</div>

    <div class="visualizer" id="visualizer"></div>

    <div class="metadata">
      <div class="metadata-row">
        <span class="metadata-label">tempo</span>
        <span class="metadata-value">54 bpm</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">key</span>
        <span class="metadata-value">c diminished</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">duration</span>
        <span class="metadata-value">4:18</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">classification</span>
        <span class="metadata-value">restricted</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">origin</span>
        <span class="metadata-value">zona oscura // sin coordenadas</span>
      </div>
    </div>

    <div class="footer">
     secure channel
    </div>
  </div>

  <script>
    const CONFIG = {
      BPM: 54,
      BEAT: 60 / 54,
      SECTIONS: {
        PRESENCE: { beats: 10, intensity: 0.15, label: "algo se acerca" },
        TENSION: { beats: 18, intensity: 0.45, label: "tensión creciente" },
        TERROR: { beats: 22, intensity: 0.92, label: "pánico" },
        SILENCE: { beats: 8, intensity: 0.08, label: "silencio roto" }
      }
    };

    let audioCtx, masterGain, analyser, isRunning = false;
    let scheduled = [], animationId, sectionIdx = 0, globalTime = 0;
    let reverbBuffer = null;
    const bars = [];

    function init() {
      const viz = document.getElementById('visualizer');
      for (let i = 0; i < 48; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        viz.appendChild(bar);
        bars.push(bar);
      }
      updateTime();
      setInterval(updateTime, 1000);
    }

    function updateTime() {
      const now = new Date();
      document.getElementById('timestamp').textContent = 
        now.toISOString().slice(11, 19).replace(/:/g, ':');
    }

    async function setupAudio() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.6;
      
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.ratio.value = 8;
      compressor.attack.value = 0.001;
      compressor.release.value = 0.3;
      
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.destination);

      // Crear reverb artificial para atmósfera opresiva
      reverbBuffer = createReverbBuffer(audioCtx, 2.5, 3);
    }

    function createReverbBuffer(ctx, duration, decay) {
      const rate = ctx.sampleRate;
      const length = rate * duration;
      const buffer = ctx.createBuffer(2, length, rate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      return buffer;
    }

    function freqFromNote(note) {
      return 440 * Math.pow(2, (note - 69) / 12);
    }

    // Escala disminuida para disonancia constante
    const DIMINISHED = [36, 38, 40, 42, 44, 46, 48, 50];
    const TRITONE = [36, 42]; // C - F#

    function dreadDrone(time, duration, intensity = 0.3) {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc3 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      
      // Frecuencias disonantes (tritono + semitono)
      osc1.type = 'sawtooth'; osc1.frequency.value = freqFromNote(36);
      osc2.type = 'square'; osc2.frequency.value = freqFromNote(42);
      osc3.type = 'sine'; osc3.frequency.value = freqFromNote(37);
      
      // LFO lento para modulación inquietante
      lfo.type = 'sine'; lfo.frequency.value = 0.08 + Math.random() * 0.05;
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain); lfoGain.connect(osc3.detune);
      lfo.start(time);
      
      // Filtro que se abre lentamente = tensión creciente
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, time);
      filter.frequency.linearRampToValueAtTime(500, time + duration * 0.7);
      filter.Q.value = 0.8;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18 * intensity, time + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc1.connect(filter); osc2.connect(filter); osc3.connect(filter);
      filter.connect(gain); gain.connect(masterGain);
      
      osc1.start(time); osc2.start(time); osc3.start(time);
      osc1.stop(time + duration + 0.5); osc2.stop(time + duration + 0.5); osc3.stop(time + duration + 0.5);
      lfo.stop(time + duration + 0.5);
      
      scheduled.push(osc1, osc2, osc3, gain, filter, lfo, lfoGain);
    }

    function whisperNoise(time, duration, intensity = 0.25) {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        // Ruido con patrones casi-voceales
        const t = i / audioCtx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * (0.3 + 0.7 * Math.sin(t * 12) * Math.sin(t * 7));
      }
      noise.buffer = buffer;
      
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 400, time);
      filter.Q.value = 2;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15 * intensity, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      noise.connect(filter); filter.connect(gain); gain.connect(masterGain);
      noise.start(time); noise.stop(time + duration);
      scheduled.push(noise, gain, filter);
    }

    function dreadStrike(time, intensity = 0.6) {
      // Golpe disonante: tritono + ruido + sub-bajo
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const sub = audioCtx.createOscillator();
      const noise = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const noiseGain = audioCtx.createGain();
      
      osc1.type = 'square'; osc1.frequency.value = freqFromNote(36);
      osc2.type = 'square'; osc2.frequency.value = freqFromNote(42);
      sub.type = 'sine'; sub.frequency.value = 28;
      
      // Ruido percusivo
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      noise.buffer = buf;
      
      filter.type = 'lowpass'; filter.frequency.value = 400; filter.Q.value = 0.5;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.4 * intensity, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
      
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.35 * intensity, time + 0.003);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
      
      osc1.connect(filter); osc2.connect(filter); sub.connect(gain);
      filter.connect(gain); gain.connect(masterGain);
      noise.connect(noiseGain); noiseGain.connect(masterGain);
      
      osc1.start(time); osc2.start(time); sub.start(time); noise.start(time);
      osc1.stop(time + 0.4); osc2.stop(time + 0.4); sub.stop(time + 0.5); noise.stop(time + 0.3);
      scheduled.push(osc1, osc2, sub, noise, gain, noiseGain, filter);
    }

    function screech(time, intensity = 0.4) {
      // Agudo penetrante e impredecible
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800 + Math.random() * 600, time);
      osc.frequency.exponentialRampToValueAtTime(2400 + Math.random() * 400, time + 0.15);
      
      lfo.type = 'square'; lfo.frequency.value = 18 + Math.random() * 12;
      lfoGain.gain.value = 80;
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      lfo.start(time);
      
      filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 4;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12 * intensity, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);
      
      osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
      osc.start(time); osc.stop(time + 0.25);
      lfo.stop(time + 0.25);
      scheduled.push(osc, gain, filter, lfo, lfoGain);
    }

    function silenceBreak(time, intensity = 0.7) {
      // Silencio roto por golpe súbito + reverb
      const convolver = audioCtx.createConvolver();
      convolver.buffer = reverbBuffer;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freqFromNote(36), time);
      osc.frequency.exponentialRampToValueAtTime(freqFromNote(30), time + 0.3);
      
      filter.type = 'lowpass'; filter.frequency.value = 300; filter.Q.value = 0.3;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.5 * intensity, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 1.8);
      
      osc.connect(filter); filter.connect(gain);
      gain.connect(convolver); convolver.connect(masterGain);
      
      osc.start(time); osc.stop(time + 2);
      scheduled.push(osc, gain, filter, convolver);
    }

    function scheduleSection(start, key) {
      const section = CONFIG.SECTIONS[key];
      const { intensity } = section;
      
      for (let b = 0; b < section.beats; b++) {
        const t = start + b * CONFIG.BEAT;
        const bar = b % 4;
        
        // Ritmo irregular: a veces salta beats para desestabilizar
        const skip = Math.random() > 0.85;
        if (!skip) {
          if (bar === 0) dreadStrike(t, intensity * 0.9);
          if (bar === 2 && Math.random() > 0.4) dreadStrike(t, intensity * 0.6);
        }
        
        // Drones continuos con variación
        if (b % 3 === 0) {
          dreadDrone(t, CONFIG.BEAT * 3, intensity * 0.4);
        }
        
        // Susurros aleatorios = paranoia
        if (Math.random() > 0.7) {
          whisperNoise(t + CONFIG.BEAT * Math.random() * 0.5, 0.8, intensity * 0.3);
        }
        
        // Chillidos impredecibles en TERROR
        if (key === 'TERROR' && Math.random() > 0.6) {
          screech(t + CONFIG.BEAT * (0.2 + Math.random() * 0.6), intensity * 0.5);
        }
        
        // Silencios rotos cada 6 beats en TENSION/TERROR
        if ((key === 'TENSION' || key === 'TERROR') && b % 6 === 3) {
          silenceBreak(t + CONFIG.BEAT * 0.1, intensity * 0.7);
        }
      }
      
      // Drone base continuo que evoluciona
      dreadDrone(start, section.beats * CONFIG.BEAT, intensity * 0.35);
    }

    function start() {
      if (isRunning) return;
      setupAudio().then(() => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        isRunning = true;
        sectionIdx = 0;
        globalTime = audioCtx.currentTime + 0.15;
        scheduled = [];
        
        document.getElementById('statusDot').classList.add('active');
        document.getElementById('statusText').textContent = 'active';
        document.getElementById('statusMessage').textContent = 'sequence executing';
        
        scheduleNext();
        animate();
      });
    }

    function scheduleNext() {
      if (!isRunning) return;
      
      const keys = Object.keys(CONFIG.SECTIONS);
      if (sectionIdx >= keys.length) {
        sectionIdx = 0;
        setTimeout(() => { if (isRunning) stop(); }, 600);
        return;
      }
      
      const key = keys[sectionIdx];
      const section = CONFIG.SECTIONS[key];
      
      document.getElementById('sectionDisplay').textContent = section.label;
      scheduleSection(globalTime, key);
      
      globalTime += section.beats * CONFIG.BEAT;
      sectionIdx++;
      
      setTimeout(scheduleNext, section.beats * CONFIG.BEAT * 1000 * 0.97);
    }

    function stop() {
      if (!isRunning) return;
      isRunning = false;
      
      scheduled.forEach(node => {
        try { if (node.stop) node.stop(); } catch(e) {}
      });
      scheduled = [];
      
      if (animationId) cancelAnimationFrame(animationId);
      
      document.getElementById('statusDot').classList.remove('active');
      document.getElementById('statusText').textContent = 'idle';
      document.getElementById('statusMessage').textContent = 'sequence terminated';
      document.getElementById('sectionDisplay').textContent = 'awaiting execution';
      bars.forEach(b => b.style.height = '2px');
    }

    function animate() {
      if (!isRunning || !analyser) return;
      
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      
      for (let i = 0; i < bars.length; i++) {
        const idx = Math.floor(i * data.length / bars.length);
        // Variación errática en altura para inquietud visual
        const jitter = Math.random() * 8 - 4;
        const h = Math.max(2, (data[idx] / 255) * 55 + jitter);
        bars[i].style.height = `${h}px`;
        bars[i].style.opacity = 0.5 + (data[idx] / 255) * 0.5;
      }
      
      animationId = requestAnimationFrame(animate);
    }

    document.getElementById('startBtn').addEventListener('click', start);
    document.getElementById('stopBtn').addEventListener('click', stop);
    
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? stop() : start();
      }
    });

    window.addEventListener('load', init);
  </script>
</body>
</html>
