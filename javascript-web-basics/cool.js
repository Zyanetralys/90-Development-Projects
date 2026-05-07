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

    <div class="bpm" id="bpmDisplay">104 BPM</div>
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
        <span class="metadata-value">104 bpm</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">key</span>
        <span class="metadata-value">d minor → f major</span>
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
        <span class="metadata-value">punto de extracción // perímetro seguro</span>
      </div>
    </div>

    <div class="footer">
     secure channel
    </div>
  </div>

  <script>
    const CONFIG = {
      BPM: 104,
      BEAT: 60 / 104,
      SECTIONS: {
        DETECT: { beats: 12, intensity: 0.22, label: "señal localizada" },
        ADVANCE: { beats: 20, intensity: 0.5, label: "acercamiento táctico" },
        RESCUE: { beats: 28, intensity: 0.88, label: "extracción asegurada" },
        EXFIL: { beats: 14, intensity: 0.35, label: "retirada segura" }
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
      masterGain.gain.value = 0.68;
      
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 4.5;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.22;
      
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    function freqFromNote(note) {
      return 440 * Math.pow(2, (note - 69) / 12);
    }

    function anchorKick(time, intensity = 1) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const sub = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(48, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.28);
      
      sub.type = 'sine'; sub.frequency.value = 36;
      subGain.gain.setValueAtTime(0.3 * intensity, time);
      subGain.gain.exponentialRampToValueAtTime(0.01, time + 0.45);
      
      filter.type = 'lowpass'; filter.frequency.value = 320; filter.Q.value = 0.35;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.45 * intensity, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      
      osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
      sub.connect(subGain); subGain.connect(masterGain);
      
      osc.start(time); osc.stop(time + 0.45);
      sub.start(time); sub.stop(time + 0.5);
      scheduled.push(osc, gain, sub, subGain);
    }

    function tacticalSnare(time, intensity = 0.75) {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.14, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      
      const tone = audioCtx.createOscillator();
      const toneGain = audioCtx.createGain();
      const noiseGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      tone.type = 'triangle'; tone.frequency.value = 240;
      toneGain.gain.setValueAtTime(0.28 * intensity, time);
      toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.07);
      
      filter.type = 'bandpass'; filter.frequency.value = 1500; filter.Q.value = 1.1;
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.42 * intensity, time + 0.002);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(masterGain);
      tone.connect(toneGain); toneGain.connect(masterGain);
      
      noise.start(time); noise.stop(time + 0.12);
      tone.start(time); tone.stop(time + 0.08);
      scheduled.push(noise, tone, noiseGain, toneGain);
    }

    function precisionHat(time, intensity = 0.45, open = false) {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * (open ? 0.1 : 0.03), audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 8000;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.26 * intensity, time + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.01, time + (open ? 0.09 : 0.025));
      
      noise.connect(filter); filter.connect(gain); gain.connect(masterGain);
      noise.start(time); noise.stop(time + (open ? 0.11 : 0.03));
      scheduled.push(noise, gain);
    }

    function shroudPad(time, duration, intensity = 0.35) {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      
      osc1.type = 'sine'; osc2.type = 'triangle';
      osc1.frequency.value = 65; osc2.frequency.value = 65.2;
      
      lfo.type = 'sine'; lfo.frequency.value = 0.18;
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain); lfoGain.connect(osc1.detune); lfo.start(time);
      
      filter.type = 'lowpass'; filter.frequency.value = 450; filter.Q.value = 0.3;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.14 * intensity, time + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc1.connect(filter); osc2.connect(filter);
      filter.connect(gain); gain.connect(masterGain);
      
      osc1.start(time); osc2.start(time);
      osc1.stop(time + duration + 0.3); osc2.stop(time + duration + 0.3);
      lfo.stop(time + duration + 0.3);
      scheduled.push(osc1, osc2, gain, filter, lfo, lfoGain);
    }

    function arrivalChord(time, duration, notes, intensity = 0.5) {
      notes.forEach((note, i) => {
        const t = time + i * 0.08;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freqFromNote(note);
        
        filter.type = 'lowpass'; filter.frequency.value = 900; filter.Q.value = 0.5;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2 * intensity, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration * 0.8);
        
        osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
        osc.start(t); osc.stop(t + duration);
        scheduled.push(osc, gain, filter);
      });
    }

    function resolveStab(time, intensity = 0.6) {
      const notes = [62, 66, 69, 74]; // D minor to F major shift feel
      notes.forEach((note, i) => {
        const t = time + i * 0.05;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = 'sawtooth'; osc.frequency.value = freqFromNote(note);
        filter.type = 'lowpass'; filter.frequency.value = 1200; filter.Q.value = 0.4;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12 * intensity, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        
        osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
        osc.start(t); osc.stop(t + 1.3);
        scheduled.push(osc, gain, filter);
      });
    }

    function scheduleSection(start, key) {
      const section = CONFIG.SECTIONS[key];
      const { intensity } = section;
      
      for (let b = 0; b < section.beats; b++) {
        const t = start + b * CONFIG.BEAT;
        const bar = b % 4;
        
        anchorKick(t, intensity * (bar === 0 ? 1.05 : 0.85));
        if (bar === 2) tacticalSnare(t, intensity * 0.8);
        
        precisionHat(t, intensity * 0.5, false);
        precisionHat(t + CONFIG.BEAT * 0.5, intensity * 0.4, bar === 3);
        precisionHat(t + CONFIG.BEAT * 0.25, intensity * 0.3, false);
        precisionHat(t + CONFIG.BEAT * 0.75, intensity * 0.25, false);
        
        if (b % 8 === 0) shroudPad(t, CONFIG.BEAT * 8, intensity * 0.4);
        
        if (key === 'RESCUE' && b % 8 === 4) {
          const minorChord = [50, 53, 57, 62];
          const majorChord = [50, 55, 59, 65];
          arrivalChord(t, CONFIG.BEAT * 6, b % 16 === 4 ? minorChord : majorChord, intensity * 0.6);
        }
        
        if (key === 'RESCUE' && b % 16 === 0) resolveStab(t + CONFIG.BEAT * 0.5, intensity * 0.55);
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
        setTimeout(() => { if (isRunning) stop(); }, 500);
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
        const h = Math.max(2, (data[idx] / 255) * 62);
        bars[i].style.height = `${h}px`;
        bars[i].style.opacity = 0.65 + (data[idx] / 255) * 0.35;
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
