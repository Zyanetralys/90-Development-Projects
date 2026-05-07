<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>侍 RUN ANTHEM </title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Serif JP', 'Segoe UI', system-ui, sans-serif;
      background: 
        radial-gradient(ellipse at top, #1a0a0a 0%, #0a0a0a 40%),
        repeating-linear-gradient(0deg, rgba(188,0,45,0.03) 0px, rgba(188,0,45,0.03) 2px, transparent 2px, transparent 20px),
        #050505;
      color: #ffd700;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-x: hidden;
      position: relative;
    }
    
    /* Cherry blossom particles */
    .sakura {
      position: fixed;
      width: 10px;
      height: 10px;
      background: radial-gradient(circle, #ffb7c5, #ff69b4);
      border-radius: 50% 50% 50% 0;
      animation: fall linear infinite;
      pointer-events: none;
      opacity: 0.8;
      z-index: 0;
    }
    @keyframes fall {
      to { transform: translateY(100vh) rotate(720deg); }
    }
    
    /* Wave pattern background */
    .seigaiha {
      position: fixed;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      background-image: 
        radial-gradient(circle at 25px 25px, transparent 20px, rgba(188,0,45,0.08) 21px, transparent 22px),
        radial-gradient(circle at 75px 75px, transparent 20px, rgba(188,0,45,0.08) 21px, transparent 22px);
      background-size: 100px 100px;
      animation: wave-scroll 30s linear infinite;
      z-index: 1;
      opacity: 0.5;
    }
    @keyframes wave-scroll {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-50px, -50px); }
    }
    
    .container {
      max-width: 900px;
      width: 100%;
      text-align: center;
      background: linear-gradient(145deg, rgba(15,10,20,0.95), rgba(25,15,30,0.9));
      border: 3px solid #bc002d;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 
        0 0 0 2px #ffd700,
        0 0 60px rgba(188, 0, 45, 0.5),
        inset 0 0 80px rgba(0, 0, 0, 0.7);
      position: relative;
      z-index: 10;
      animation: border-glow 4s ease-in-out infinite;
    }
    
    @keyframes border-glow {
      0%, 100% { box-shadow: 0 0 0 2px #ffd700, 0 0 60px rgba(188, 0, 45, 0.5), inset 0 0 80px rgba(0, 0, 0, 0.7); }
      50% { box-shadow: 0 0 0 2px #ffd700, 0 0 90px rgba(255, 215, 0, 0.7), inset 0 0 100px rgba(188, 0, 45, 0.3); }
    }
    
    /* Torii gate decoration */
    .container::before, .container::after {
      content: "⛩";
      position: absolute;
      font-size: 2rem;
      color: #bc002d;
      text-shadow: 0 0 10px rgba(188,0,45,0.8);
      z-index: 11;
    }
    .container::before { top: -15px; left: 20px; }
    .container::after { top: -15px; right: 20px; }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      text-shadow: 0 0 15px #ffd700, 0 0 30px #bc002d;
      letter-spacing: 8px;
      animation: kanji-glow 3s ease-in-out infinite alternate;
      line-height: 1.3;
    }
    
    @keyframes kanji-glow {
      from { text-shadow: 0 0 15px #ffd700, 0 0 30px #bc002d; }
      to { text-shadow: 0 0 25px #ffd700, 0 0 50px #ffd700, 0 0 70px #bc002d; }
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: #ffb7c5;
      margin-bottom: 15px;
      opacity: 0.95;
      letter-spacing: 2px;
    }
    
    .kanji-large {
      font-size: 3.5rem;
      font-weight: 900;
      color: #bc002d;
      text-shadow: 0 0 20px rgba(188,0,45,0.9), 0 0 40px rgba(255,215,0,0.6);
      margin: 10px 0;
      letter-spacing: 5px;
      animation: pulse-kanji 2s infinite;
    }
    
    @keyframes pulse-kanji {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    
    .bpm-display {
      font-size: 2.8rem;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.9);
      margin: 12px 0;
      font-family: monospace;
    }
    
    .section-indicator {
      font-size: 1.4rem;
      margin: 12px 0;
      color: #ffd700;
      font-weight: bold;
      min-height: 32px;
      letter-spacing: 3px;
    }
    
    .controls {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 20px 0;
    }
    
    button {
      background: linear-gradient(145deg, #bc002d, #8b0020);
      color: #ffd700;
      border: 2px solid #ffd700;
      padding: 14px 32px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.25s ease;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Noto Serif JP', serif;
      box-shadow: 0 4px 15px rgba(188, 0, 45, 0.5);
      position: relative;
      overflow: hidden;
    }
    
    button::before {
      content: "";
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent);
      transition: left 0.4s ease;
    }
    
    button:hover::before { left: 100%; }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(255, 215, 0, 0.6);
      background: linear-gradient(145deg, #cc0033, #9b0025);
    }
    
    button:active { transform: translateY(1px); }
    
    button.stop {
      background: linear-gradient(145deg, #4a0000, #2a0000);
      border-color: #ff6b6b;
      box-shadow: 0 4px 15px rgba(74, 0, 0, 0.5);
    }
    
    button.stop:hover {
      box-shadow: 0 6px 25px rgba(255, 107, 107, 0.6);
      background: linear-gradient(145deg, #5a0000, #3a0000);
    }
    
    .status {
      margin: 15px 0;
      font-size: 1.05rem;
      min-height: 24px;
      color: #ffd700;
      letter-spacing: 1px;
    }
    
    .visualizer {
      width: 100%;
      height: 90px;
      background: 
        linear-gradient(180deg, rgba(30,10,20,0.8), rgba(20,5,15,0.9)),
        repeating-linear-gradient(90deg, transparent 0, transparent 48px, rgba(188,0,45,0.1) 49px, rgba(188,0,45,0.1) 50px);
      border: 1px solid #bc002d;
      border-radius: 4px;
      margin: 18px 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 2px;
      padding: 8px;
      overflow: hidden;
      position: relative;
    }
    
    .visualizer::before {
      content: "〆";
      position: absolute;
      color: rgba(188,0,45,0.3);
      font-size: 3rem;
      font-weight: bold;
      pointer-events: none;
    }
    
    .bar {
      width: 6px;
      background: linear-gradient(to top, #bc002d, #ffd700, #ffb7c5);
      border-radius: 2px 2px 0 0;
      transition: height 0.04s ease;
      min-height: 2px;
      box-shadow: 0 0 8px rgba(188, 0, 45, 0.6);
    }
    
    .info {
      margin-top: 22px;
      text-align: left;
      font-size: 0.92rem;
      line-height: 1.7;
      color: #ffd700;
      background: rgba(20, 10, 25, 0.7);
      padding: 18px;
      border-radius: 4px;
      border-left: 4px solid #bc002d;
      border-right: 4px solid #ffd700;
    }
    
    .info h3 {
      color: #ffd700;
      margin-bottom: 10px;
      font-size: 1.15rem;
      letter-spacing: 2px;
      text-align: center;
    }
    
    .info ul {
      padding-left: 22px;
      margin: 8px 0;
    }
    
    .info li { margin: 4px 0; color: #ffb7c5; }
    
    .info strong { color: #ffd700; }
    
    .footer-kanji {
      margin-top: 20px;
      font-size: 1.8rem;
      color: rgba(188,0,45,0.7);
      letter-spacing: 8px;
      text-shadow: 0 0 10px rgba(255,215,0,0.4);
      animation: float-kanji 3s ease-in-out infinite;
    }
    
    @keyframes float-kanji {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    /* Responsive */
    @media (max-width: 600px) {
      h1 { font-size: 2rem; letter-spacing: 4px; }
      .kanji-large { font-size: 2.5rem; }
      .bpm-display { font-size: 2.2rem; }
      button { padding: 12px 24px; font-size: 0.95rem; }
    }
  </style>
</head>
<body>
  <!-- Cherry blossom particles -->
  <div id="sakura-container"></div>
  <div class="seigaiha"></div>
  
  <div class="container">
    <h1>侍 RUN ANTHEM</h1>
    <div class="subtitle">走 • 武士道 • 180 BPM /div>
    
    <div class="kanji-large" id="main-kanji">走</div>
    <div class="bpm-display">180 BPM</div>
    <div class="section-indicator" id="section">準備 - JUNBI</div>
    
    <div class="controls">
      <button onclick="startAnthem()">⚔開始 - KAISHI</button>
      <button class="stop" onclick="stopAnthem()">◼️ 停止 - TEISHI</button>
    </div>
    
    <div class="status" id="status">Press 開始 to awaken the warrior within</div>
    
    <div class="visualizer" id="visualizer"></div>
    
    <div class="info">
      <h3> 刀を抜け </h3>
      準備→上昇→爆発→絶頂→静寂 - Cada latido es un paso hacia la victoria.
      </p>
    </div>
    
    <div class="footer-kanji">武士道 • 忍 • 勇気</div>
  </div>

  <script>
    // ===== CONFIGURACIÓN SAMURÁI =====
    const BPM = 180;
    const BEAT = 60 / BPM;
    
    // Escala pentatónica japonesa In-Sen (D menor con tensión)
    const PENTATONIC_IN = [293.66, 311.13, 392.00, 440.00, 466.16]; // D-Eb-G-A-Bb
    const PENTATONIC_YO = [293.66, 329.63, 392.00, 440.00, 493.88]; // D-E-G-A-B (más brillante)
    
    // Secciones con nombres japoneses
    const SECTIONS = {
      JUNBI:    { dur: 16, int: 0.25, label: "準備 - JUNBI", kanji: "静", desc: "Respiración • Enfoque" },
      JOSHOU:   { dur: 32, int: 0.55, label: "上昇 - JŌSHŌ", kanji: "昇", desc: "Aceleración • Flujo" },
      BAKUHATSU:{ dur: 48, int: 0.92, label: "爆発 - BAKUHATSU", kanji: "WAR", desc: "¡GUERRA! • Máxima intensidad" },
      ZECCHO:   { dur: 32, int: 1.0,  label: "絶頂 - ZECCHŌ", kanji: "Go", desc: "Pico épico • Sin límites" },
      SEIJAKU:  { dur: 16, int: 0.35, label: "静寂 - SEIJAKU", kanji: "和", desc: "Recuperación • Honor" }
    };

    let audioCtx, master, analyser, playing = false;
    let nodes = [], vizBars = [], sakuras = [];
    let globalTime = 0, currentSec = 0;

    // ===== INICIALIZACIÓN =====
    function init() {
      if (audioCtx) return;
      audioCtx = new (AudioContext || webkitAudioContext)();
      
      master = audioCtx.createGain();
      master.gain.value = 0.82;
      
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      
      const comp = audioCtx.createDynamicsCompressor();
      comp.threshold.value = -10;
      comp.knee.value = 24;
      comp.ratio.value = 4;
      comp.attack.value = 0.004;
      comp.release.value = 0.22;
      
      master.connect(comp);
      comp.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      // Visualizer bars
      const viz = document.getElementById('visualizer');
      viz.innerHTML = '';
      for (let i = 0; i < 40; i++) {
        const b = document.createElement('div');
        b.className = 'bar';
        viz.appendChild(b);
        vizBars.push(b);
      }
      
      // Cherry blossom particles
      createSakura();
    }
    
    function createSakura() {
      const container = document.getElementById('sakura-container');
      for (let i = 0; i < 25; i++) {
        const s = document.createElement('div');
        s.className = 'sakura';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (15 + Math.random() * 20) + 's';
        s.style.animationDelay = Math.random() * 10 + 's';
        s.style.transform = `scale(${0.6 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
        container.appendChild(s);
        sakuras.push(s);
      }
    }

    // ===== INSTRUMENTOS JAPONESES =====
    
    // Taiko épico (bombo ceremonial)
    function taiko(t, intensity = 1) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const noiseSrc = audioCtx.createBufferSource();
      const noiseGain = audioCtx.createGain();
      
      // Frecuencia descendente para impacto profundo
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.25);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500 * intensity, t);
      filter.Q.value = 0.9;
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(1.0 * intensity, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
      
      // Capa de ruido para textura de piel
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.15));
      noiseSrc.buffer = buf;
      
      const nf = audioCtx.createBiquadFilter();
      nf.type = 'lowpass';
      nf.frequency.value = 300;
      
      noiseGain.gain.setValueAtTime(0.35 * intensity, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      
      noiseSrc.connect(nf);
      nf.connect(noiseGain);
      noiseGain.connect(master);
      
      osc.start(t); osc.stop(t + 0.5);
      noiseSrc.start(t); noiseSrc.stop(t + 0.3);
      
      nodes.push(osc, gain, noiseSrc, noiseGain);
    }
    
    // Shime-daiko (patrón rítmico rápido)
    function shime(t, intensity = 0.6, open = false) {
      const noise = audioCtx.createBufferSource();
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * (open ? 0.12 : 0.04), audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buf;
      
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = open ? 1200 : 2200;
      filter.Q.value = open ? 0.4 : 1.2;
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.45 * intensity, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.01, t + (open ? 0.11 : 0.035));
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      
      noise.start(t);
      noise.stop(t + (open ? 0.12 : 0.04));
      
      nodes.push(noise, gain);
    }
    
    // Shakuhachi (flauta de bambú emocional)
    function shakuhachi(t, note, duration, intensity = 0.7) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      
      // Vibrato orgánico característico
      osc.type = 'sine';
      osc.frequency.value = note;
      
      lfo.type = 'sine';
      lfo.frequency.value = 5 + Math.random() * 3;
      lfoGain.gain.value = 8 + intensity * 12;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      // Filtro que simula respiración
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.linearRampToValueAtTime(2200 + intensity * 1800, t + duration * 0.35);
      filter.Q.value = 0.6;
      
      // Envelope de respiración
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.55 * intensity, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      
      osc.start(t);
      lfo.start(t);
      osc.stop(t + duration + 0.2);
      lfo.stop(t + duration + 0.2);
      
      nodes.push(osc, gain, lfo, lfoGain);
    }
    
    // Koto (cuerdas pulsadas épicas)
    function koto(t, notes, intensity = 0.65) {
      notes.forEach((freq, idx) => {
        const time = t + idx * 0.14;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.Q.value = 0.4;
        
        // Ataque percusivo + decay natural de cuerda
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.48 * intensity, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        
        osc.start(time);
        osc.stop(time + 0.4);
        
        nodes.push(osc, gain);
      });
    }
    
    // Pad atmosférico con escala pentatónica
    function pad(t, root, duration, intensity = 0.4) {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = root;
      osc2.frequency.value = root * 1.5; // Quinta justa
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.linearRampToValueAtTime(1400 + intensity * 1200, t + duration * 0.5);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22 * intensity, t + 2);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration + 1);
      osc2.stop(t + duration + 1);
      
      nodes.push(osc1, osc2, gain);
    }

    // ===== PATRONES RÍTMICOS JAPONESES =====
    function scheduleSection(start, key) {
      const sec = SECTIONS[key];
      const I = sec.int;
      
      for (let b = 0; b < sec.dur; b++) {
        const t = start + b * BEAT;
        const bar = b % 4;
        const down = bar === 0;
        const back = bar === 2;
        
        // Taiko en cada beat (corazón del guerrero)
        taiko(t, I * (down ? 1.15 : 0.88));
        
        // Shime-daiko en subdivisiones (cadencia ninja)
        shime(t, I * 0.55, false);
        if (b % 2 === 1) shime(t + BEAT * 0.5, I * 0.4, true);
        
        // Patrón de koto cada 2 beats (fraseo tradicional)
        if (b % 2 === 0 && key !== 'JUNBI') {
          const kotoNotes = key === 'BAKUHATSU' || key === 'ZECCHO' 
            ? PENTATONIC_YO 
            : PENTATONIC_IN;
          koto(t + BEAT * 0.1, [kotoNotes[b % kotoNotes.length], kotoNotes[(b+2) % kotoNotes.length]], I * 0.75);
        }
        
        // Shakuhachi melódico cada 8 beats (alma del samurái)
        if (b % 8 === 0 && key !== 'JUNBI' && key !== 'SEIJAKU') {
          const melody = [PENTATONIC_IN[0], PENTATONIC_IN[2], PENTATONIC_IN[3], PENTATONIC_IN[4], PENTATONIC_IN[3], PENTATONIC_IN[2]];
          shakuhachi(t + BEAT * 0.3, melody[b % melody.length], BEAT * 3.5, I * 0.85);
        }
      }
      
      // Pad atmosférico de fondo (excepto en BAKUHATSU)
      if (key !== 'BAKUHATSU') {
        pad(start, PENTATONIC_IN[0], sec.dur * BEAT, I * 0.5);
      }
    }

    // ===== MOTOR DE SECUENCIACIÓN =====
    function startAnthem() {
      if (playing) return;
      init();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      playing = true;
      globalTime = audioCtx.currentTime + 0.12;
      currentSec = 0;
      nodes = [];
      
      document.getElementById('status').textContent = "⚔️ ANTHEM ACTIVADO - ¡CORRE, GUERRERO! ⚔️";
      animateViz();
      scheduleNext();
    }
    
    function scheduleNext() {
      if (!playing) return;
      
      const keys = Object.keys(SECTIONS);
      if (currentSec >= keys.length) { currentSec = 0; }
      
      const key = keys[currentSec];
      const sec = SECTIONS[key];
      
      // Actualizar UI
      document.getElementById('section').textContent = sec.label;
      document.getElementById('main-kanji').textContent = sec.kanji;
      
      // Programar sección
      scheduleSection(globalTime, key);
      
      // Avanzar
      globalTime += sec.dur * BEAT;
      currentSec++;
      
      // Siguiente sección
      setTimeout(scheduleNext, sec.dur * BEAT * 1000 * 0.96);
    }
    
    function stopAnthem() {
      if (!playing) return;
      playing = false;
      
      nodes.forEach(n => { try { if (n.stop) n.stop(); } catch(e) {} });
      nodes = [];
      
      document.getElementById('status').textContent = "◼️ Detenido. 武士の休息 - Descanso del guerrero";
      document.getElementById('section').textContent = "停止 - TEISHI";
      document.getElementById('main-kanji').textContent = "止";
      vizBars.forEach(b => b.style.height = '2px');
    }

    // ===== VISUALIZADOR DINÁMICO =====
    function animateViz() {
      if (!playing || !analyser) return;
      
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      
      for (let i = 0; i < vizBars.length; i++) {
        const idx = Math.floor(i * data.length / vizBars.length);
        const v = data[idx] / 255;
        const h = Math.max(2, v * 75 + Math.random() * 12);
        vizBars[i].style.height = `${h}px`;
        vizBars[i].style.opacity = 0.75 + v * 0.25;
      }
      
      requestAnimationFrame(animateViz);
    }

    // ===== INICIALIZACIÓN =====
    window.addEventListener('load', () => {
      // Teclas rápidas
      document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          e.preventDefault();
          playing ? stopAnthem() : startAnthem();
        }
      });
      
      // Crear sakura inicial
      createSakura();
    });
    
    console.log("%c🏯 侍 RUN ANTHEM 🏯", "color:#bc002d; font-size:18px; font-weight:bold;");
    console.log("%c180 BPM • Escala In-Sen • Taiko • Shakuhachi • Koto", "color:#ffd700;");
    console.log("%c💡 ESPACIO: Iniciar/Detener | 刀を抜け", "color:#ffb7c5;");
  </script>
</body>
</html>
