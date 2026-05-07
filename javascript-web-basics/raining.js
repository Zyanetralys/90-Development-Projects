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

    .tuner-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1rem 0;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-secondary);
    }

    .tuner-label { width: 80px; text-align: right; }
    
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
      outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 6px var(--accent-glow);
    }

    input[type="range"]::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }

    #radar {
      width: 180px;
      height: 180px;
      margin: 1.5rem auto;
      display: block;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: radial-gradient(circle, var(--bg-primary) 0%, var(--bg-secondary) 100%);
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

    <div class="bpm" id="bpmDisplay">96 BPM</div>
    <div class="section-display" id="sectionDisplay">awaiting execution</div>

    <div class="controls">
      <button id="startBtn">execute</button>
      <button id="stopBtn" class="stop">terminate</button>
    </div>

    <div class="tuner-container">
      <span class="tuner-label">filter</span>
      <input type="range" id="tuner" min="0" max="100" value="15">
      <span class="tuner-label">lock</span>
    </div>

    <canvas id="radar" width="180" height="180"></canvas>

    <div class="status-text" id="statusMessage">system ready. awaiting command.</div>

    <div class="visualizer" id="visualizer"></div>

    <div class="metadata">
      <div class="metadata-row">
        <span class="metadata-label">tempo</span>
        <span class="metadata-value">96 bpm</span>
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
        <span class="metadata-value">on ur 6</span>
      </div>
    </div>

    <div class="footer">
     secure channel
    </div>
  </div>

  <script>
    const CONFIG = {
      BPM: 96,
      BEAT: 60 / 96,
      LOOKAHEAD: 0.1,
      SCHEDULE_INTERVAL: 25
    };

    let audioCtx, masterGain, analyser, isRunning = false;
    let scheduled = [], animationId, nextNoteTime = 0, currentBeat = 0;
    let filterNode, pannerNode, noiseGain, noiseNode;
    let radarAngle = 0, radarBlips = [];
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
      document.getElementById('tuner').addEventListener('input', updateFilter);
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
      analyser.smoothingTimeConstant = 0.75;
      
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioCtx.destination);

      // Noise generator for static
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;
      
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.Q.value = 1;
      
      pannerNode = audioCtx.createStereoPanner();
      pannerNode.pan.value = 0;
      
      noiseGain = audioCtx.createGain();
      noiseGain.gain.value = 0.3;
      
      noiseNode.connect(filterNode);
      filterNode.connect(pannerNode);
      pannerNode.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseNode.start();
      
      updateFilter();
    }

    function updateFilter() {
      if (!filterNode) return;
      const val = document.getElementById('tuner').value;
      const freq = 80 + (val * 140);
      const gain = 0.3 - (val * 0.0025);
      const pan = Math.sin(val * 0.05) * 0.4;
      
      filterNode.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
      filterNode.Q.setTargetAtTime(0.5 + val * 0.02, audioCtx.currentTime, 0.1);
      noiseGain.gain.setTargetAtTime(gain, audioCtx.currentTime, 0.1);
      pannerNode.pan.setTargetAtTime(pan, audioCtx.currentTime, 0.1);
    }

    function freqFromNote(note) {
      return 440 * Math.pow(2, (note - 69) / 12);
    }

    function createPulse(time, intensity = 1) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(48, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.25);
      
      filter.type = 'lowpass'; filter.frequency.value = 300; filter.Q.value = 0.4;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.35 * intensity, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
      
      osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
      osc.start(time); osc.stop(time + 0.4);
      scheduled.push(osc, gain);
    }

    function createClick(time, intensity = 0.5) {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.03, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 2500;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2 * intensity, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.025);
      
      noise.connect(filter); filter.connect(gain); gain.connect(masterGain);
      noise.start(time); noise.stop(time + 0.03);
      scheduled.push(noise, gain);
    }

    function createDrone(time, duration, note, intensity = 0.35) {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc1.type = 'sine'; osc2.type = 'triangle';
      osc1.frequency.value = freqFromNote(note);
      osc2.frequency.value = freqFromNote(note + 7);
      
      filter.type = 'lowpass'; filter.frequency.value = 450; filter.Q.value = 0.3;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12 * intensity, time + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc1.connect(filter); osc2.connect(filter);
      filter.connect(gain); gain.connect(masterGain);
      
      osc1.start(time); osc2.start(time);
      osc1.stop(time + duration + 0.3); osc2.stop(time + duration + 0.3);
      scheduled.push(osc1, osc2, gain, filter);
    }

    function createSignal(time, note, intensity = 0.4) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freqFromNote(note);
      
      filter.type = 'bandpass'; filter.frequency.value = 800; filter.Q.value = 3;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18 * intensity, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      
      osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
      osc.start(time); osc.stop(time + 0.45);
      scheduled.push(osc, gain, filter);
    }

    function scheduleBeat() {
      const intensity = 0.5 + (Math.sin(currentBeat * 0.15) * 0.3 + 0.3);
      const bar = currentBeat % 4;
      
      // Probabilistic rhythm
      if (Math.random() > 0.2) createPulse(nextNoteTime, intensity);
      if (bar === 2 || Math.random() > 0.6) createClick(nextNoteTime + CONFIG.BEAT * 0.5, intensity * 0.6);
      
      // Generative drone evolution
      if (currentBeat % 8 === 0) {
        const notes = [38, 41, 43, 45, 48, 50, 53, 55];
        createDrone(nextNoteTime, CONFIG.BEAT * 8, notes[currentBeat % notes.length], intensity);
      }
      
      // Sparse melodic signals (emerge with lock)
      const tunerVal = document.getElementById('tuner').value;
      if (Math.random() > 0.85 - (tunerVal * 0.005)) {
        const sigNotes = [50, 53, 57, 62, 65, 69];
        createSignal(nextNoteTime + CONFIG.BEAT * (Math.random() * 0.8), sigNotes[Math.floor(Math.random() * sigNotes.length)], intensity);
        addRadarBlip();
      }
      
      // Spatial sweep
      if (pannerNode) {
        pannerNode.pan.setTargetAtTime(Math.sin(currentBeat * 0.12) * 0.5, nextNoteTime, 0.1);
      }
    }

    function scheduler() {
      while (nextNoteTime < audioCtx.currentTime + CONFIG.LOOKAHEAD) {
        scheduleBeat();
        nextNoteTime += CONFIG.BEAT;
        currentBeat++;
      }
    }

    function start() {
      if (isRunning) return;
      setupAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      isRunning = true;
      nextNoteTime = audioCtx.currentTime + 0.05;
      currentBeat = 0;
      scheduled = [];
      radarBlips = [];
      
      document.getElementById('statusDot').classList.add('active');
      document.getElementById('statusText').textContent = 'active';
      document.getElementById('statusMessage').textContent = 'sequence executing';
      document.getElementById('sectionDisplay').textContent = 'signal acquisition';
      
      setInterval(scheduler, CONFIG.SCHEDULE_INTERVAL);
      animate();
    }

    function stop() {
      if (!isRunning) return;
      isRunning = false;
      clearInterval(scheduler);
      
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

    function addRadarBlip() {
      radarBlips.push({
        angle: radarAngle + (Math.random() * 0.5 - 0.25),
        dist: 0.3 + Math.random() * 0.5,
        life: 1.0
      });
    }

    function drawRadar() {
      const ctx = document.getElementById('radar').getContext('2d');
      const w = ctx.canvas.width, h = ctx.canvas.height;
      const cx = w/2, cy = h/2;
      
      ctx.clearRect(0, 0, w, h);
      
      // Grid
      ctx.strokeStyle = 'rgba(55, 65, 81, 0.4)';
      ctx.lineWidth = 1;
      [0.3, 0.6, 0.9].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * cx, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.stroke();
      
      // Sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(radarAngle);
      const grad = ctx.createLinearGradient(0, 0, -cx, 0);
      grad.addColorStop(0, 'rgba(0, 212, 170, 0.4)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, cx, 0, -0.15, true);
      ctx.fill();
      ctx.restore();
      
      // Blips
      radarBlips = radarBlips.filter(b => {
        const x = cx + Math.cos(b.angle) * b.dist * cx;
        const y = cy + Math.sin(b.angle) * b.dist * cy;
        ctx.fillStyle = `rgba(0, 212, 170, ${b.life})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        b.life -= 0.02;
        return b.life > 0;
      });
      
      radarAngle += 0.02;
    }

    function animate() {
      if (!isRunning) return;
      
      drawRadar();
      
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        
        for (let i = 0; i < bars.length; i++) {
          const idx = Math.floor(i * data.length / bars.length);
          const h = Math.max(2, (data[idx] / 255) * 60);
          bars[i].style.height = `${h}px`;
          bars[i].style.opacity = 0.65 + (data[idx] / 255) * 0.35;
        }
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
