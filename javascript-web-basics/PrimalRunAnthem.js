<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRIMAL RUN ANTHEM </title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #00ff88;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-x: hidden;
    }
    .container {
      max-width: 900px;
      width: 100%;
      text-align: center;
      background: rgba(10, 15, 30, 0.9);
      border: 2px solid #00ff88;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5);
      animation: pulse-border 3s infinite;
    }
    @keyframes pulse-border {
      0%, 100% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5); }
      50% { box-shadow: 0 0 70px rgba(0, 255, 136, 0.6), inset 0 0 80px rgba(0, 0, 0, 0.7); }
    }
    h1 {
      font-size: 2.8rem;
      margin-bottom: 10px;
      text-shadow: 0 0 20px #00ff88, 0 0 40px #00cc66;
      letter-spacing: 3px;
      animation: glow 2s ease-in-out infinite alternate;
    }
    @keyframes glow {
      from { text-shadow: 0 0 20px #00ff88, 0 0 40px #00cc66; }
      to { text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff88, 0 0 80px #00cc66; }
    }
    .subtitle {
      font-size: 1.2rem;
      color: #88ffcc;
      margin-bottom: 25px;
      opacity: 0.9;
    }
    .controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 25px 0;
    }
    button {
      background: linear-gradient(145deg, #00cc66, #009944);
      color: #000;
      border: none;
      padding: 15px 35px;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 5px 20px rgba(0, 204, 102, 0.4);
    }
    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 255, 136, 0.7);
      background: linear-gradient(145deg, #00ff88, #00cc66);
    }
    button:active { transform: translateY(1px); }
    button.stop {
      background: linear-gradient(145deg, #ff4444, #cc0000);
      box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4);
    }
    button.stop:hover {
      box-shadow: 0 8px 30px rgba(255, 68, 68, 0.7);
      background: linear-gradient(145deg, #ff6666, #ff4444);
    }
    .status {
      margin: 20px 0;
      font-size: 1.1rem;
      min-height: 24px;
      color: #00ff88;
    }
    .visualizer {
      width: 100%;
      height: 100px;
      background: rgba(0, 30, 20, 0.6);
      border-radius: 10px;
      margin: 20px 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 3px;
      padding: 10px;
      overflow: hidden;
    }
    .bar {
      width: 8px;
      background: linear-gradient(to top, #00cc66, #00ff88);
      border-radius: 4px 4px 0 0;
      transition: height 0.05s ease;
      min-height: 2px;
    }
    .info {
      margin-top: 25px;
      text-align: left;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #aaffcc;
      background: rgba(0, 40, 30, 0.4);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #00ff88;
    }
    .info h3 {
      color: #00ff88;
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
    .info ul {
      padding-left: 20px;
      margin: 10px 0;
    }
    .info li { margin: 5px 0; }
    .bpm-display {
      font-size: 3rem;
      font-weight: bold;
      color: #00ff88;
      text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
      margin: 15px 0;
      animation: pulse 0.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .section-indicator {
      font-size: 1.3rem;
      margin: 15px 0;
      color: #ffcc00;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      min-height: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1> PRIMAL RUN ANTHEM</h1>
    
    <div class="bpm-display">180 BPM</div>
    <div class="section-indicator" id="section">READY TO RUN</div>
    
    <div class="controls">
      <button onclick="startAnthem()">INICIAR</button>
      <button class="stop" onclick="stopAnthem()">⏹ STOP</button>
    </div>
    
    <div class="status" id="status">Presiona INICIAR para comenzar tu carrera épica</div>
    
    <div class="visualizer" id="visualizer">
      <!-- Bars generadas por JS -->
    </div>
    
    <div class="info">
      <h3>Características del Anthem:</h3>
      <ul>
        <li><strong>Ritmo:</strong> 180 BPM</li>
      </ul>
    </div>
  </div>

  <script>
    // ===== CONFIGURACIÓN PRIMAL =====
    const BPM = 180;
    const BEAT_DURATION = 60 / BPM; // 0.333s por beat
    const SECTIONS = {
      INTRO: { duration: 16, intensity: 0.3, label: "DESPERTAR" },
      BUILD: { duration: 32, intensity: 0.6, label: "ASCENSO" },
      DROP: { duration: 48, intensity: 0.95, label: "DROP PRIMAL" },
      CLIMAX: { duration: 32, intensity: 1.0, label: "CLÍMAX" },
      COOLDOWN: { duration: 16, intensity: 0.4, label: "ENFRIAMIENTO" }
    };

    let audioContext, masterGain, analyser, isPlaying = false;
    let currentSection = 0, sectionTime = 0, globalTime = 0;
    let scheduledNodes = [];
    let animationFrame;
    const bars = [];

    // ===== INICIALIZACIÓN =====
    function initAudio() {
      if (audioContext) return;
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Master chain con compresión suave
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.85;
      
      // Analizador para visualizador
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      
      // Compresor para controlar picos
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -12;
      compressor.knee.value = 20;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      
      masterGain.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(audioContext.destination);
      
      // Crear barras del visualizador
      const viz = document.getElementById('visualizer');
      viz.innerHTML = '';
      for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        viz.appendChild(bar);
        bars.push(bar);
      }
    }

    // ===== GENERADORES DE SONIDO PRIMAL =====
    
    // Kick épico con ataque explosivo
    function createKick(time, intensity = 1) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 * intensity, time);
      filter.Q.value = 0.8;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.9 * intensity, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      
      // Capa de ruido para impacto primal
      const noise = audioContext.createBufferSource();
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.15, audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = noiseBuffer;
      
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 400;
      noiseGain.gain.setValueAtTime(0.4 * intensity, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      osc.start(time);
      osc.stop(time + 0.35);
      noise.start(time);
      noise.stop(time + 0.15);
      
      scheduledNodes.push(osc, gain, noise, noiseGain);
    }

    // Snare tribal con cuerpo
    function createSnare(time, intensity = 1) {
      // Ruido principal
      const noise = audioContext.createBufferSource();
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = noiseBuffer;
      
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1800;
      noiseFilter.Q.value = 0.5;
      
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.7 * intensity, time + 0.002);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
      
      // Tone body
      const osc = audioContext.createOscillator();
      const oscGain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      oscGain.gain.setValueAtTime(0.3 * intensity, time);
      oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      noise.start(time);
      noise.stop(time + 0.2);
      osc.start(time);
      osc.stop(time + 0.15);
      
      scheduledNodes.push(noise, noiseGain, osc, oscGain);
    }

    // Hi-hat rápido para cadencia
    function createHat(time, intensity = 0.5, open = false) {
      const noise = audioContext.createBufferSource();
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * (open ? 0.15 : 0.05), audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = noiseBuffer;
      
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.35 * intensity, time + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.01, time + (open ? 0.14 : 0.04));
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      noise.start(time);
      noise.stop(time + (open ? 0.15 : 0.05));
      
      scheduledNodes.push(noise, gain);
    }

    // Bajo épico con distorsión controlada
    function createBass(time, note, intensity = 1) {
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const waveShaper = audioContext.createWaveShaper();
      
      // Distorsión suave para agresividad
      const amount = 30 + intensity * 50;
      const curve = new Float32Array(audioContext.sampleRate);
      for (let i = 0; i < audioContext.sampleRate; i++) {
        const x = i * 2 / audioContext.sampleRate - 1;
        curve[i] = (1 + amount) * x / (1 + amount * Math.abs(x));
      }
      waveShaper.curve = curve;
      waveShaper.oversample = '2x';
      
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.value = note;
      osc2.frequency.value = note * 1.005; // Detune para grosor
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + intensity * 600, time);
      filter.Q.value = 0.7;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.5 * intensity, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      
      osc1.connect(waveShaper);
      osc2.connect(waveShaper);
      waveShaper.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.45);
      osc2.stop(time + 0.45);
      
      scheduledNodes.push(osc1, osc2, gain, waveShaper);
    }

    // Synth épico con arpegio y delay
    function createEpicSynth(time, notes, intensity = 1) {
      notes.forEach((note, idx) => {
        const t = time + idx * 0.125;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        const delay = audioContext.createDelay();
        const delayGain = audioContext.createGain();
        
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = note;
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200 + intensity * 1800, t);
        filter.Q.value = 0.3;
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4 * intensity, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        
        // Delay épico
        delay.delayTime.value = 0.25;
        delayGain.gain.value = 0.25 * intensity;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        gain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(masterGain);
        
        osc.start(t);
        osc.stop(t + 0.55);
        
        scheduledNodes.push(osc, gain, delay, delayGain);
      });
    }

    // Pad atmosférico primal
    function createPad(time, note, duration, intensity = 0.6) {
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = note;
      osc2.frequency.value = note * 2; // Octava
      
      // LFO para modulación orgánica
      lfo.type = 'sine';
      lfo.frequency.value = 0.3 + Math.random() * 0.4;
      lfoGain.gain.value = 30 + intensity * 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.detune);
      lfo.start(time);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, time);
      filter.frequency.linearRampToValueAtTime(2000 + intensity * 1500, time + duration * 0.4);
      filter.Q.value = 0.5;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.25 * intensity, time + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration + 0.5);
      osc2.stop(time + duration + 0.5);
      lfo.stop(time + duration + 0.5);
      
      scheduledNodes.push(osc1, osc2, gain, filter, lfo, lfoGain);
    }

    // ===== PATRONES RÍTMICOS PARA 180 BPM =====
    function scheduleSection(startTime, sectionKey) {
      const section = SECTIONS[sectionKey];
      const intensity = section.intensity;
      const beats = section.duration;
      
      for (let beat = 0; beat < beats; beat++) {
        const t = startTime + beat * BEAT_DURATION;
        const bar = beat % 4;
        const isDownbeat = bar === 0;
        const isBackbeat = bar === 2;
        
        // Kick en cada beat (corazón de la bestia)
        createKick(t, intensity * (isDownbeat ? 1.2 : 0.9));
        
        // Snare en 2 y 4 (golpe tribal)
        if (isBackbeat) createSnare(t, intensity);
        
        // Hi-hats en subdivisiones (cadencia rápida)
        createHat(t, intensity * 0.6, false); // Closed hat en beat
        if (beat % 2 === 0) createHat(t + BEAT_DURATION * 0.5, intensity * 0.4, true); // Open hat offbeat
        
        // Bajo en patrón épico (notas en escala menor primal)
        if (beat % 2 === 0) {
          const bassNotes = [55, 55, 61.74, 55, 55, 49, 55, 61.74]; // A menor con tensión
          createBass(t, bassNotes[beat % bassNotes.length], intensity * 0.85);
        }
        
        // Synth épico cada 8 beats (fraseo heroico)
        if (beat % 8 === 0 && sectionKey !== 'INTRO') {
          const epicNotes = [220, 261.63, 329.63, 392, 440, 392, 329.63, 261.63]; // A menor arpegio
          createEpicSynth(t + BEAT_DURATION * 0.25, epicNotes.slice(0, 4), intensity * 0.7);
        }
      }
      
      // Pad atmosférico de fondo (evolución continua)
      if (sectionKey !== 'DROP') {
        createPad(startTime, 55, beats * BEAT_DURATION, intensity * 0.5);
      }
    }

    // ===== MOTOR DE SECUENCIACIÓN =====
    function startAnthem() {
      if (isPlaying) return;
      initAudio();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      isPlaying = true;
      globalTime = audioContext.currentTime + 0.1;
      currentSection = 0;
      sectionTime = 0;
      scheduledNodes = [];
      
      document.getElementById('status').textContent = "RUN!";
      scheduleNextSection();
      animateVisualizer();
    }

    function scheduleNextSection() {
      if (!isPlaying) return;
      
      const sections = Object.keys(SECTIONS);
      if (currentSection >= sections.length) {
        // Loop: reiniciar con cooldown corto
        currentSection = 0;
        sectionTime = 0;
      }
      
      const sectionKey = sections[currentSection];
      const section = SECTIONS[sectionKey];
      
      // Actualizar UI
      document.getElementById('section').textContent = section.label;
      
      // Programar sección
      scheduleSection(globalTime, sectionKey);
      
      // Avanzar tiempo
      sectionTime += section.duration;
      globalTime += section.duration * BEAT_DURATION;
      currentSection++;
      
      // Programar siguiente sección
      setTimeout(scheduleNextSection, section.duration * BEAT_DURATION * 1000 * 0.95);
    }

    function stopAnthem() {
      if (!isPlaying) return;
      isPlaying = false;
      
      // Detener todos los nodos programados
      scheduledNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
        } catch(e) {}
      });
      scheduledNodes = [];
      
      // Detener animación
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      // Reset UI
      document.getElementById('status').textContent = "⏹ Anthem detenido. ¿Listo para otra carrera?";
      document.getElementById('section').textContent = "PAUSA";
      bars.forEach(bar => bar.style.height = '2px');
    }

    // ===== VISUALIZADOR DINÁMICO =====
    function animateVisualizer() {
      if (!isPlaying || !analyser) return;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      // Mapear frecuencias a barras
      for (let i = 0; i < bars.length; i++) {
        const idx = Math.floor(i * dataArray.length / bars.length);
        const value = dataArray[idx] / 255;
        const height = Math.max(2, value * 80 + Math.random() * 10);
        bars[i].style.height = `${height}px`;
        bars[i].style.opacity = 0.7 + value * 0.3;
      }
      
      animationFrame = requestAnimationFrame(animateVisualizer);
    }

    // ===== INICIALIZACIÓN DE UI =====
    window.addEventListener('load', () => {
      // Precargar visualizador
      const viz = document.getElementById('visualizer');
      for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        viz.appendChild(bar);
        bars.push(bar);
      }
      
      // Teclas rápidas
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          isPlaying ? stopAnthem() : startAnthem();
        }
      });
    });

    // ===== MENSAJE DE PODER =====
    console.log("%cPRIMAL RUN ANTHEM ", "color:#00ff88; font-size:20px; font-weight:bold;");
    console.log("%c180 BPM • Épico • Adrenalina • Bestia Interior", "color:#88ffcc;");
    console.log("%c Presiona ESPACIO para iniciar/detener", "color:#ffcc00;");
  </script>
</body>
</html>
