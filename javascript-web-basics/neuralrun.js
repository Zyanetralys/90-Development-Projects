<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEURAL-RUN // TACTICAL CADENCE</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
    :root{ --bg:#050508; --panel:#0a0a12; --cyan:#00f0ff; --magenta:#ff00aa; --warn:#ff3333; --txt:#c0d0e0; }
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:var(--bg);color:var(--txt);font-family:'Share Tech Mono',monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;position:relative}
    
    .grid{position:fixed;inset:0;background-image:linear-gradient(rgba(0,240,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.05) 1px,transparent 1px);background-size:40px 40px;animation:grid 30s linear infinite;z-index:1}
    @keyframes grid{to{transform:translateY(40px)}}
    .scan{position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(0,0,0,0.3) 3px);pointer-events:none;z-index:2;opacity:0.5}
    
    .hud{width:100%;max-width:900px;background:var(--panel);border:1px solid var(--cyan);box-shadow:0 0 0 1px #000,0 0 30px rgba(0,240,255,0.2),inset 0 0 50px rgba(0,0,0,0.8);padding:24px;position:relative;z-index:10;clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px)}
    .hud::before{content:"BLACK OPS // LEVEL 4";position:absolute;top:10px;right:14px;font-size:0.6rem;color:var(--magenta);letter-spacing:2px;opacity:0.8}
    
    h1{font-family:'Orbitron',sans-serif;font-size:2.4rem;font-weight:900;text-align:center;color:#fff;letter-spacing:3px;text-shadow:0 0 10px var(--cyan);margin:8px 0 4px}
    .sub{text-align:center;color:var(--txt);opacity:0.75;font-size:0.85rem;letter-spacing:2px;margin-bottom:18px}
    
    .status{display:flex;justify-content:space-between;align-items:center;margin:14px 0;padding:12px 16px;background:rgba(0,0,0,0.4);border-left:3px solid var(--cyan);border-bottom:1px solid rgba(0,240,255,0.2)}
    .bpm{font-family:'Orbitron';font-size:2.2rem;color:var(--cyan);text-shadow:0 0 8px var(--cyan)}
    .phase{font-size:1rem;color:var(--txt);letter-spacing:1px;font-weight:700}
    .meta{font-size:0.75rem;color:var(--txt);opacity:0.6;text-align:right;line-height:1.4}
    
    .controls{display:flex;gap:14px;justify-content:center;margin:18px 0}
    button{background:transparent;border:1px solid var(--cyan);color:var(--cyan);padding:12px 30px;font-family:'Share Tech Mono';font-size:0.95rem;cursor:pointer;letter-spacing:2px;text-transform:uppercase;transition:all 0.12s;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
    button:hover{background:rgba(0,240,255,0.1);box-shadow:0 0 10px var(--cyan);transform:translateY(-1px)}
    button:active{transform:translateY(1px)}
    button.stop{border-color:var(--magenta);color:var(--magenta)}
    button.stop:hover{background:rgba(255,0,170,0.1);box-shadow:0 0 10px var(--magenta)}
    
    .viz-wrap{width:100%;height:90px;background:#030306;border:1px solid #111;margin:16px 0;position:relative;overflow:hidden;border-radius:2px}
    canvas{width:100%;height:100%;display:block}
    .viz-label{position:absolute;top:6px;left:8px;font-size:0.6rem;color:var(--cyan);opacity:0.5;letter-spacing:1px}
    
    .log{margin-top:16px;padding:14px;background:rgba(0,0,0,0.5);border-left:2px solid var(--cyan);font-size:0.8rem;line-height:1.6;max-height:130px;overflow-y:auto;color:var(--txt);opacity:0.85;scrollbar-width:thin;scrollbar-color:var(--cyan) transparent}
    .log div{margin:2px 0}
    .log .sys{color:var(--cyan)}.log .phase{color:var(--magenta)}.log .warn{color:var(--warn)}
    
    @media(max-width:650px){h1{font-size:1.8rem}.bpm{font-size:1.7rem}button{padding:10px 22px;font-size:0.85rem}}
  </style>
</head>
<body>
  <div class="grid"></div><div class="scan"></div>
  <div class="hud">
    <h1>NEURAL-RUN</h1>
    <div class="sub">TACTICAL CADENCE ENGINE // 180 BPM // CINEMATIC MIX</div>
    
    <div class="status">
      <div class="bpm" id="bpm">180</div>
      <div class="phase" id="phase">STATUS: STANDBY</div>
      <div class="meta" id="meta">CTX: READY<br>AUDIO: IDLE<br>DRIVERS: OK</div>
    </div>
    
    <div class="controls">
      <button onclick="startEngine()">▶ ENGAGE</button>
      <button class="stop" onclick="stopEngine()">⏹ TERMINATE</button>
    </div>
    
    <div class="viz-wrap">
      <canvas id="viz"></canvas>
      <div class="viz-label">OSCILLOSCOPE // MASTER OUT</div>
    </div>
    
    <div class="log" id="log">
      <div class="sys">[SYS] Engine v5.2 loaded.</div>
      <div>[LOG] Audio chain: Osc/Noise → Filter → Gain → Comp → Limiter → Out</div>
      <div>[INFO] Press ENGAGE. Spacebar toggles playback.</div>
    </div>
  </div>

  <script>
    const BPM = 180, BEAT = 60 / BPM, LOOKAHEAD = 0.1, SCHED_MS = 25;
    const PHASES = {
      BOOT:   { dur: 16, int: 0.25, name: "SYSTEM BOOT",     harm: [110, 130.81, 164.81, 146.83] },
      RECON:  { dur: 32, int: 0.55, name: "TACTICAL RECON",  harm: [110, 130.81, 164.81, 146.83] },
      ENGAGE: { dur: 40, int: 0.85, name: "COMBAT ENGAGE",   harm: [110, 146.83, 164.81, 130.81] },
      ASSAULT:{ dur: 48, int: 1.0,  name: "ASSAULT PROTOCOL",harm: [130.81, 146.83, 164.81, 110] },
      EXFIL:  { dur: 20, int: 0.35, name: "EXFILTRATION",    harm: [110, 130.81, 146.83, 164.81] }
    };

    let ctx, master, analyser, playing=false, nextNoteTime=0, currentBeat=0, phaseIdx=0, schedId;
    let animId;

    // ===== AUDIO INIT (Robust) =====
    function init() {
      if(ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if(ctx.state==='suspended') ctx.resume();
      
      master = ctx.createGain(); master.gain.value = 0.75;
      analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = 0.85;
      
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 4;
      comp.attack.value = 0.004; comp.release.value = 0.12;
      
      // Simple delay for space (more reliable than custom reverb)
      const delay = ctx.createDelay(0.4); delay.delayTime.value = 0.22;
      const feed = ctx.createGain(); feed.gain.value = 0.28;
      const wet = ctx.createGain(); wet.gain.value = 0.35;
      
      master.connect(comp);
      comp.connect(analyser);
      analyser.connect(ctx.destination);
      
      // Delay send
      master.connect(delay);
      delay.connect(feed);
      feed.connect(delay);
      delay.connect(wet);
      wet.connect(analyser);
      
      log("sys", "Audio context created & routed. Ready.");
    }

    // ===== INSTRUMENTS =====
    function kick(t, I) {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sine';
      o.frequency.setValueAtTime(128, t);
      o.frequency.exponentialRampToValueAtTime(42, t+0.12);
      f.type='lowpass'; f.frequency.value=550*I;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.95*I,t+0.003);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.28);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t+0.3);
    }

    function snare(t, I) {
      const n = ctx.createBufferSource(), nb = ctx.createBuffer(1, ctx.sampleRate*0.16, ctx.sampleRate);
      const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.03));
      n.buffer = nb;
      const ng = ctx.createGain(), nf = ctx.createBiquadFilter();
      nf.type='bandpass'; nf.frequency.value=1900; nf.Q.value=0.6;
      ng.gain.setValueAtTime(0,t); ng.gain.linearRampToValueAtTime(0.62*I,t+0.002); ng.gain.exponentialRampToValueAtTime(0.01,t+0.12);
      n.connect(nf); nf.connect(ng); ng.connect(master);
      n.start(t); n.stop(t+0.14);
      
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type='triangle'; o.frequency.value=168;
      og.gain.setValueAtTime(0.26*I,t); og.gain.exponentialRampToValueAtTime(0.01,t+0.09);
      o.connect(og); og.connect(master); o.start(t); o.stop(t+0.1);
    }

    function hat(t, I, open=false) {
      const n = ctx.createBufferSource(), nb = ctx.createBuffer(1, ctx.sampleRate*(open?0.1:0.03), ctx.sampleRate);
      const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      n.buffer = nb;
      const g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type='highpass'; f.frequency.value=open?4800:7400;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.34*I,t+0.001); g.gain.exponentialRampToValueAtTime(0.01,t+(open?0.09:0.025));
      n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t+(open?0.1:0.03));
    }

    function bass(t, note, I) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o1.type='sawtooth'; o2.type='square'; o1.frequency.value=note; o2.frequency.value=note*1.005;
      f.type='lowpass'; f.frequency.setValueAtTime(340+I*480,t); f.frequency.linearRampToValueAtTime(160,t+0.35); f.Q.value=0.8;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.52*I,t+0.015); g.gain.exponentialRampToValueAtTime(0.01,t+0.4);
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
      o1.start(t); o2.start(t); o1.stop(t+0.45); o2.stop(t+0.45);
    }

    function lead(t, notes, I) {
      notes.forEach((freq,i)=>{
        const time = t + i*0.14;
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type='triangle'; o.frequency.value=freq;
        f.type='lowpass'; f.frequency.setValueAtTime(1500+I*1900,time); f.frequency.linearRampToValueAtTime(550,time+0.28); f.Q.value=0.5;
        g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(0.36*I,time+0.02); g.gain.exponentialRampToValueAtTime(0.01,time+0.32);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(time); o.stop(time+0.35);
      });
    }

    function pad(t, chord, I, dur) {
      chord.forEach(freq=>{
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type='sine'; o.frequency.value=freq;
        f.type='lowpass'; f.frequency.value=900+I*1300;
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.2*I,t+1.2); g.gain.linearRampToValueAtTime(0.2*I,t+dur-1); g.gain.exponentialRampToValueAtTime(0.01,t+dur);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(t); o.stop(t+dur);
      });
    }

    // ===== SCHEDULER =====
    function scheduleNote(beat, time) {
      const keys = Object.keys(PHASES);
      if(beat >= PHASES[keys[phaseIdx]].dur) {
        phaseIdx = (phaseIdx + 1) % keys.length;
        beat = 0;
        log("phase", `[PHASE] ${PHASES[keys[phaseIdx]].name}`);
      }
      const phase = PHASES[keys[phaseIdx]];
      const I = phase.int;
      const bar = beat % 4;
      
      kick(time, I*(bar===0?1.08:0.92));
      if(bar===2) snare(time, I);
      hat(time, I*0.68, false);
      if(beat%2===1) hat(time+BEAT*0.5, I*0.5, true);
      
      if(beat%2===0 && keys[phaseIdx]!=='BOOT') {
        const chord = phase.harm;
        bass(time, chord[beat%chord.length]*0.5, I*0.9);
        if(beat%4===0) pad(time, [chord[0],chord[1]*2,chord[2]*2], I*0.45, BEAT*4);
      }
      
      if(beat%8===0 && keys[phaseIdx]!=='BOOT') {
        lead(time+BEAT*0.25, [phase.harm[2]*2, phase.harm[3]*2, phase.harm[2]*2, phase.harm[1]*2], I*0.78);
      }
    }

    function scheduler() {
      while(nextNoteTime < ctx.currentTime + LOOKAHEAD) {
        scheduleNote(currentBeat, nextNoteTime);
        nextNoteTime += BEAT;
        currentBeat++;
      }
    }

    // ===== VISUALIZER =====
    function drawViz() {
      if(!analyser) return;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0,0,w,h);
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);
      vizCtx.lineWidth = 1.8;
      vizCtx.strokeStyle = '#00f0ff';
      vizCtx.beginPath();
      const slice = w / data.length;
      for(let i=0;i<data.length;i++){
        const v = data[i]/128.0;
        const y = v * h/2;
        i===0 ? vizCtx.moveTo(0,y) : vizCtx.lineTo(i*slice,y);
      }
      vizCtx.stroke();
      animId = requestAnimationFrame(drawViz);
    }

    // ===== CONTROL =====
    let canvas, vizCtx;
    function startEngine() {
      if(playing) return;
      init();
      canvas = document.getElementById('viz');
      vizCtx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      vizCtx.scale(2,2);
      
      if(ctx.state==='suspended') ctx.resume();
      playing=true; nextNoteTime=ctx.currentTime+0.05; currentBeat=0; phaseIdx=0;
      schedId = setInterval(scheduler, SCHED_MS);
      drawViz();
      log("sys", "Engine engaged. Cadence 180 BPM locked.");
    }

    function stopEngine() {
      if(!playing) return;
      playing=false;
      clearInterval(schedId);
      cancelAnimationFrame(animId);
      log("sys", "Protocol terminated. Audio chain unloaded.");
    }

    function log(type, msg) {
      const l = document.getElementById('log');
      const cls = type==='sys'?'sys':type==='phase'?'phase':type==='warn'?'warn':'';
      l.innerHTML += `<div class="${cls}">[${new Date().toLocaleTimeString()}] ${msg}</div>`;
      l.scrollTop = l.scrollHeight;
    }

    window.addEventListener('keydown', e=>{
      if(e.code==='Space'){e.preventDefault();playing?stopEngine():startEngine();}
    });

    window.addEventListener('load', ()=>{
      log("sys", "Interface loaded. Awaiting user gesture for audio context.");
    });
  </script>
</body>
</html>
