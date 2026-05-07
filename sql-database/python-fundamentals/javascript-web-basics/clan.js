<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OFFICIAL</title>
  <style>
    :root {
      --bg-primary: #0a0e14;
      --bg-secondary: #111827;
      --bg-tertiary: #1f2937;
      --accent: #00d4aa;
      --accent-dim: rgba(0, 212, 170, 0.15);
      --accent-glow: rgba(0, 212, 170, 0.4);
      --text-primary: #e5e7eb;
      --text-secondary: #9ca3af;
      --text-dim: #6b7280;
      --border: #374151;
      --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      --font-sans: system-ui, -apple-system, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      background: 
        radial-gradient(ellipse at top, #0f172a 0%, transparent 70%),
        radial-gradient(ellipse at bottom, #0a0e14 0%, transparent 70%),
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
        linear-gradient(90deg, transparent 49.5%, var(--accent-dim) 50%, transparent 50.5%) 0 0/4px 4px,
        linear-gradient(0deg, transparent 49.5%, var(--accent-dim) 50%, transparent 50.5%) 0 0/4px 4px;
      opacity: 0.03;
      pointer-events: none;
      animation: grid-scroll 20s linear infinite;
    }

    @keyframes grid-scroll {
      0% { background-position: 0 0, 0 0; }
      100% { background-position: 4px 4px, 4px 4px; }
    }

    .container {
      max-width: 800px;
      width: 100%;
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 2.5rem;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.6;
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
      box-shadow: 0 0 8px var(--accent-glow);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
      box-shadow: 0 0 20px var(--accent-glow);
    }

    button:active { transform: scale(0.98); }

    button.stop {
      color: var(--text-secondary);
      border-color: var(--border);
    }

    button.stop:hover {
      color: var(--text-primary);
      border-color: var(--text-secondary);
      background: var(--bg-tertiary);
      box-shadow: none;
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
      transition: height 0.04s ease;
      min-height: 2px;
      opacity: 0.8;
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
      opacity: 0.1;
      animation: scan 4s linear infinite;
      pointer-events: none;
    }

    @keyframes scan {
      0% { top: -10%; }
      100% { top: 110%; }
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

    <div class="bpm" id="bpmDisplay">64 BPM</div>
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
        <span class="metadata-value">64 bpm</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">key</span>
        <span class="metadata-value">d minor</span>
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
        <span class="metadata-value">haifa</span>
      </div>
    </div>

    <div class="footer">
     secure channel
    </div>
  </div>

  <script>
    const CONFIG = {
      BPM: 64,
      BEAT: 60 / 64,
      SECTIONS: {
        INIT: { beats: 8, intensity: 0.2, label: "silencio" },
        GATHER: { beats: 16, intensity: 0.45, label: "formación en línea" },
        OATH: { beats: 24, intensity: 0.7, label: "juramento" },
        RESOLVE: { beats: 12, intensity: 0.3, label: "paso firme" }
      }
    };

    let audioCtx, masterGain, analyser, isRunning = false;
    let scheduled = [], animationId, sectionIdx = 0, globalTime = 0;
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

    function setupAudio() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.65;
      
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.25;
      
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    function freqFromNote(note) {
      return 440 * Math.pow(2, (note - 69) / 12);
    }

    const D_MINOR = [38, 41, 43, 45, 48, 50, 53, 55];

    function deepDrum(time, intensity = 1) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.35);
      
      filter.type = 'lowpass';
      filter.frequency.value = 250;
      filter.Q.value = 0.3;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.4 * intensity, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start(time);
      osc.stop(time + 0.55);
      scheduled.push(osc, gain);
    }

    function brushHit(time, intensity = 0.4) {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.5;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18 * intensity, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      noise.start(time);
      noise.stop(time + 0.2);
      scheduled.push(noise, gain);
    }

    function solemnPad(time, duration, notes, intensity = 0.35) {
      const oscs = [];
      const gains = [];
      const filter = audioCtx.createBiquadFilter();
      const mainGain = audioCtx.createGain();
      
      notes.forEach((note, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freqFromNote(note);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.12 * intensity, time + duration * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.connect(gain);
        gains.push(gain);
        oscs.push(osc);
      });
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, time);
      filter.frequency.linearRampToValueAtTime(1200, time + duration * 0.6);
      filter.Q.value = 0.4;
      
      gains.forEach(g => g.connect(filter));
      filter.connect(mainGain);
      mainGain.connect(masterGain);
      
      oscs.forEach(o => {
        o.start(time);
        o.stop(time + duration + 0.3);
      });
      
      scheduled.push(...oscs, ...gains, filter, mainGain);
    }

    function firmBass(time, duration, note, intensity = 0.4) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freqFromNote(note);
      
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      filter.Q.value = 0.2;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.25 * intensity, time + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start(time);
      osc.stop(time + duration + 0.2);
      scheduled.push(osc, gain);
    }

    function resoluteMotif(time, intensity = 0.5) {
      const pairs = [
        [62, 69], // D4, A4
        [67, 74], // G4, D5
        [69, 76]  // A4, E5
      ];
      
      pairs.forEach(([root, fifth], idx) => {
        const t = time + idx * (CONFIG.BEAT * 1.5);
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc1.type = 'sine'; osc1.frequency.value = freqFromNote(root);
        osc2.type = 'sine'; osc2.frequency.value = freqFromNote(fifth);
        
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15 * intensity, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.8);
        
        osc1.connect(filter); osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        
        osc1.start(t); osc2.start(t);
        osc1.stop(t + 1.9); osc2.stop(t + 1.9);
        scheduled.push(osc1, osc2, gain, filter);
      });
    }

    function scheduleSection(start, key) {
      const section = CONFIG.SECTIONS[key];
      const { intensity } = section;
      
      for (let b = 0; b < section.beats; b++) {
        const t = start + b * CONFIG.BEAT;
        const bar = b % 4;
        
        // Tambor profundo en 1 y 3 (latido solemne)
        if (bar === 0 || bar === 2) deepDrum(t, intensity);
        
        // Brush suave en 2 y 4 (respiración del grupo)
        if (bar === 1 || bar === 3) brushHit(t + CONFIG.BEAT * 0.5, intensity * 0.7);
        
        // Pad armónico cada 8 compases
        if (b % 8 === 0) {
          const chords = [[38, 43, 48], [41, 45, 50], [43, 47, 53], [38, 43, 48]];
          solemnPad(t, section.beats * CONFIG.BEAT, chords[(b/8) % chords.length], intensity * 0.6);
        }
        
        // Bajo firme en tónica
        if (b % 4 === 0) firmBass(t, CONFIG.BEAT * 3.5, D_MINOR[0], intensity * 0.55);
        
        // Motivo de quintas firmes en GATHER y OATH
        if ((key === 'GATHER' || key === 'OATH') && b % 12 === 4) {
          resoluteMotif(t + CONFIG.BEAT, intensity * 0.65);
        }
      }
    }

    function start() {
      if (isRunning) return;
      setupAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      isRunning = true;
      sectionIdx = 0;
      globalTime = audioCtx.currentTime + 0.1;
      scheduled = [];
      
      document.getElementById('statusDot').classList.add('active');
      document.getElementById('statusText').textContent = 'active';
      document.getElementById('statusMessage').textContent = 'sequence executing';
      
      scheduleNext();
      animate();
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
        const h = Math.max(2, (data[idx] / 255) * 55);
        bars[i].style.height = `${h}px`;
        bars[i].style.opacity = 0.6 + (data[idx] / 255) * 0.4;
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
