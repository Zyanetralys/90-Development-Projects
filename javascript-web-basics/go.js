<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SYNTHAX ENGINE // FLOW STATE</title>
  <style>
    :root{
      --bg:#030503; --panel:#080a08; --border:#003311;
      --green:#00ff41; --dim:#008811; --dark:#004400; --cyan:#00ccaa; --white:#e0ffe0;
      --font:'Courier New', 'Fira Code', 'Consolas', monospace;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:var(--bg);color:var(--green);font-family:var(--font);min-height:100vh;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;padding:16px}
    
    #rain{position:fixed;inset:0;z-index:1;pointer-events:none}
    
    .terminal{width:100%;max-width:1100px;background:var(--panel);border:1px solid var(--border);box-shadow:0 0 0 1px #000,0 0 30px rgba(0,255,65,0.12),inset 0 0 50px rgba(0,0,0,0.8);padding:18px;position:relative;z-index:10}
    .header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed var(--dark);padding-bottom:8px;margin-bottom:14px}
    .title{font-size:1.1rem;font-weight:700;letter-spacing:2px;color:var(--white);text-shadow:0 0 6px var(--green)}
    .build{font-size:0.7rem;color:var(--dim);letter-spacing:1px}
    
    .dashboard{display:grid;grid-template-columns:240px 1fr 240px;gap:14px}
    @media(max-width:900px){.dashboard{grid-template-columns:1fr}.side{display:none}}
    
    .panel{background:rgba(0,10,4,0.6);border:1px solid var(--border);padding:12px;position:relative}
    .panel h3{font-size:0.8rem;color:var(--dim);letter-spacing:1px;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:4px}
    
    .row{display:flex;justify-content:space-between;align-items:center;margin:5px 0;font-size:0.8rem}
    .val{color:var(--white);font-weight:700}
    .bar{width:100%;height:4px;background:#001105;margin-top:3px;overflow:hidden}
    .fill{height:100%;background:var(--green);transition:width 0.3s ease}
    
    .center{display:flex;flex-direction:column;gap:10px}
    .status-bar{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(0,20,8,0.5);border:1px solid var(--border)}
    .bpm{font-size:2rem;font-weight:800;color:var(--green);text-shadow:0 0 8px var(--green)}
    .phase{font-size:0.9rem;color:var(--white);letter-spacing:1px}
    .timer{font-size:0.85rem;color:var(--cyan)}
    
    .viz{width:100%;height:100px;background:#020302;border:1px solid var(--border);position:relative;overflow:hidden}
    canvas{width:100%;height:100%;display:block}
    .viz-label{position:absolute;top:4px;left:8px;font-size:0.6rem;color:var(--dim)}
    
    .controls{display:flex;gap:10px;justify-content:center;margin:12px 0 8px}
    button{background:transparent;border:1px solid var(--green);color:var(--green);padding:10px 22px;font-family:var(--font);font-size:0.85rem;cursor:pointer;letter-spacing:1px;text-transform:uppercase;transition:0.1s}
    button:hover{background:rgba(0,255,65,0.1);box-shadow:0 0 10px var(--dark)}
    button:active{transform:translateY(1px)}
    button.override{border-color:var(--cyan);color:var(--cyan)}
    button.override:hover{background:rgba(0,204,170,0.1)}
    button.stop{border-color:var(--dim);color:var(--dim)}
    button.stop:hover{background:rgba(0,136,17,0.1)}
    
    .log{height:110px;overflow-y:auto;font-size:0.75rem;line-height:1.4;padding:8px;background:#010201;border:1px solid var(--border)}
    .log::-webkit-scrollbar{width:6px}
    .log::-webkit-scrollbar-thumb{background:var(--dark);border-radius:3px}
    .log div{margin:2px 0;white-space:pre-wrap;word-break:break-all}
    .sys{color:var(--dim)}.phase{color:var(--green)}.cmd{color:var(--cyan)}.warn{color:#ff4444}
    
    .blink{animation:blink 1.2s step-end infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    
    .status-led{position:absolute;top:10px;right:10px;width:6px;height:6px;border-radius:50%;background:var(--dim)}
    .status-led.active{background:var(--green);box-shadow:0 0 6px var(--green)}
  </style>
</head>
<body>
  <canvas id="rain"></canvas>
  <div class="terminal">
    <div class="header">
      <div class="title">SYNTHAX ENGINE // FLOW STATE PROTOCOL</div>
      <div class="build">v3.4.1 // KERNEL: WEB_AUDIO // MODE: REAL_TIME</div>
    </div>
    
    <div class="dashboard">
      <div class="panel side">
        <h3>SYSTEM TELEMETRY</h3>
        <div class="row"><span>CPU LOAD</span><span class="val" id="cpu">12%</span></div>
        <div class="bar"><div class="fill" id="cpu-bar" style="width:12%"></div></div>
        <div class="row" style="margin-top:6px"><span>MEMORY</span><span class="val" id="mem">342 MB</span></div>
        <div class="bar"><div class="fill" id="mem-bar" style="width:28%"></div></div>
        <div class="row" style="margin-top:6px"><span>KEYSTROKES/MIN</span><span class="val" id="kpm">0</span></div>
        <div class="bar"><div class="fill" id="kpm-bar" style="width:0%"></div></div>
        <div class="row" style="margin-top:6px"><span>COMPILE QUEUE</span><span class="val" id="queue">IDLE</span></div>
        <div class="status-led" id="led"></div>
      </div>
      
      <div class="center">
        <div class="status-bar">
          <div class="bpm" id="bpm">150</div>
          <div class="phase" id="phase">AWAITING INITIATION</div>
          <div class="timer" id="timer">00:00:00</div>
        </div>
        <div class="viz">
          <canvas id="fft"></canvas>
          <div class="viz-label">FFT SPECTRUM // 20Hz - 20kHz</div>
        </div>
        <div class="controls">
          <button onclick="startEngine()">INITIALIZE</button>
          <button class="override" onclick="triggerOverride()">OVERRIDE</button>
          <button class="stop" onclick="stopEngine()">TERMINATE</button>
        </div>
      </div>
      
      <div class="panel side">
        <h3>TERMINAL OUTPUT</h3>
        <div class="log" id="log">
          <div class="sys">[KERNEL] Audio subsystem initialized.</div>
          <div class="sys">[INIT] Waiting for user gesture to unlock context.</div>
          <div class="cmd">> Press INITIALIZE or SPACEBAR to begin.</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const BPM = 150, BEAT = 60 / BPM, LOOKAHEAD = 0.1, SCHED_MS = 25;
    const PHASES = {
      BOOT:    { dur: 16, int: 0.2, name: "BOOT SEQUENCE",  harm: [110, 130.81, 164.81, 146.83] },
      SYNC:    { dur: 32, int: 0.55, name: "SYNC THREADS",   harm: [110, 130.81, 164.81, 146.81] },
      COMPILE: { dur: 40, int: 0.85, name: "COMPILATION",    harm: [130.81, 146.83, 164.81, 110] },
      DEPLOY:  { dur: 48, int: 1.0,  name: "DEPLOY RUNTIME", harm: [146.83, 164.81, 174.61, 130.81] },
      ROLLBACK:{ dur: 16, int: 0.3,  name: "SYSTEM ROLLBACK",harm: [110, 123.47, 130.81, 146.83] }
    };

    let ctx, master, analyser, delay, feed, wet, playing=false, nextNoteTime=0, beat=0, phaseIdx=0, schedId, startTime;
    let fftCanvas, fftCtx, rainCanvas, rainCtx, animId, rainId;
    const logEl = document.getElementById('log');
    let cpu=12, mem=342, kpm=0;

    function log(cls, msg) {
      const div = document.createElement('div');
      div.className = cls;
      const t = new Date().toLocaleTimeString('en-US', {hour12:false});
      div.textContent = `[${t}] ${msg}`;
      logEl.appendChild(div);
      logEl.scrollTop = logEl.scrollHeight;
      if(logEl.children.length > 60) logEl.removeChild(logEl.firstChild);
    }

    function init() {
      if(ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if(ctx.state==='suspended') ctx.resume();
      
      master = ctx.createGain(); master.gain.value = 0.72;
      analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.8;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 5;
      comp.attack.value = 0.003; comp.release.value = 0.12;
      
      delay = ctx.createDelay(0.6); delay.delayTime.value = 0.3;
      feed = ctx.createGain(); feed.gain.value = 0.18;
      wet = ctx.createGain(); wet.gain.value = 0.25;
      
      master.connect(comp);
      comp.connect(analyser);
      analyser.connect(ctx.destination);
      
      master.connect(delay);
      delay.connect(feed); feed.connect(delay);
      delay.connect(wet); wet.connect(analyser);
      
      log('sys', 'Audio chain routed. Compressor + Delay active.');
      setupRain();
    }

    // RAIN CANVAS
    function setupRain() {
      rainCanvas = document.getElementById('rain');
      rainCtx = rainCanvas.getContext('2d');
      resizeRain();
      window.addEventListener('resize', resizeRain);
      const columns = Math.floor(rainCanvas.width / 14);
      const drops = new Array(columns).fill(1);
      
      function drawRain() {
        rainCtx.fillStyle = 'rgba(3, 5, 3, 0.08)';
        rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
        rainCtx.fillStyle = '#00ff41';
        rainCtx.font = '12px monospace';
        for(let i=0;i<drops.length;i++) {
          const char = String.fromCharCode(0x30A0 + Math.random() * 96);
          rainCtx.fillText(char, i*14, drops[i]*14);
          if(drops[i]*14 > rainCanvas.height && Math.random()>0.975) drops[i]=0;
          drops[i]++;
        }
        rainId = requestAnimationFrame(drawRain);
      }
      drawRain();
    }
    function resizeRain() {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
    }

    // AUDIO INSTRUMENTS
    function kick(t, I) {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sine';
      o.frequency.setValueAtTime(118, t);
      o.frequency.exponentialRampToValueAtTime(44, t+0.1);
      f.type='lowpass'; f.frequency.value=450*I;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.88*I,t+0.003);
      g.gain.exponentialRampToValueAtTime(0.01,t+0.22);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t+0.25);
      
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(0.72, t);
      master.gain.linearRampToValueAtTime(0.72*(1-0.6*I), t+0.004);
      master.gain.linearRampToValueAtTime(0.72, t+0.16);
    }

    function snare(t, I) {
      const n = ctx.createBufferSource(), nb = ctx.createBuffer(1, ctx.sampleRate*0.14, ctx.sampleRate);
      const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.025));
      n.buffer = nb;
      const ng = ctx.createGain(), nf = ctx.createBiquadFilter();
      nf.type='bandpass'; nf.frequency.value=1950; nf.Q.value=0.7;
      ng.gain.setValueAtTime(0,t); ng.gain.linearRampToValueAtTime(0.55*I,t+0.002); ng.gain.exponentialRampToValueAtTime(0.01,t+0.1);
      n.connect(nf); nf.connect(ng); ng.connect(master);
      n.start(t); n.stop(t+0.12);
    }

    function hat(t, I, open=false) {
      const n = ctx.createBufferSource(), nb = ctx.createBuffer(1, ctx.sampleRate*(open?0.08:0.02), ctx.sampleRate);
      const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      n.buffer = nb;
      const g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type='highpass'; f.frequency.value=open?4800:7200;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.3*I,t+0.001); g.gain.exponentialRampToValueAtTime(0.01,t+(open?0.07:0.02));
      n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t+(open?0.08:0.02));
    }

    function bass(t, note, I) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o1.type='sawtooth'; o2.type='square'; o1.frequency.value=note; o2.frequency.value=note*1.003;
      f.type='lowpass'; f.frequency.setValueAtTime(290+I*440,t); f.frequency.linearRampToValueAtTime(130,t+0.3); f.Q.value=0.8;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.46*I,t+0.012); g.gain.exponentialRampToValueAtTime(0.01,t+0.36);
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
      o1.start(t); o2.start(t); o1.stop(t+0.4); o2.stop(t+0.4);
    }

    function arp(t, notes, I) {
      notes.forEach((freq,i)=>{
        const time = t + i*0.11;
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type='square'; o.frequency.value=freq;
        f.type='lowpass'; f.frequency.setValueAtTime(1400+I*1700,time); f.frequency.linearRampToValueAtTime(420,time+0.24); f.Q.value=0.3;
        g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(0.32*I,time+0.015); g.gain.exponentialRampToValueAtTime(0.01,time+0.28);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(time); o.stop(time+0.3);
      });
    }

    function pad(t, chord, I, dur) {
      chord.forEach(freq=>{
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type='sine'; o.frequency.value=freq;
        f.type='lowpass'; f.frequency.value=820+I*1150;
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.16*I,t+0.9); g.gain.linearRampToValueAtTime(0.16*I,t+dur-0.7); g.gain.exponentialRampToValueAtTime(0.01,t+dur);
        o.connect(f); f.connect(g); g.connect(master);
        o.start(t); o.stop(t+dur);
      });
    }

    function glitch(t, I) {
      const n = ctx.createBufferSource(), nb = ctx.createBuffer(1, ctx.sampleRate*0.06, ctx.sampleRate);
      const d = nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()>0.5?1:-1)*Math.exp(-i/(ctx.sampleRate*0.01));
      n.buffer = nb;
      const g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type='bandpass'; f.frequency.value=1200+Math.random()*2000; f.Q.value=1.5;
      g.gain.setValueAtTime(0.25*I,t); g.gain.exponentialRampToValueAtTime(0.01,t+0.04);
      n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t+0.05);
    }

    // SCHEDULER
    function scheduleNote(b, time) {
      const keys = Object.keys(PHASES);
      if(b >= PHASES[keys[phaseIdx]].dur) {
        phaseIdx = (phaseIdx + 1) % keys.length;
        b = 0;
        log('phase', `[PHASE] ${PHASES[keys[phaseIdx]].name}`);
        document.getElementById('phase').textContent = PHASES[keys[phaseIdx]].name;
      }
      const phase = PHASES[keys[phaseIdx]];
      const I = phase.int;
      const bar = b % 4;
      
      kick(time, I*(bar===0?1.02:0.95));
      if(bar===2) snare(time, I);
      hat(time, I*0.64, false);
      if(b%2===1) hat(time+BEAT*0.5, I*0.46, true);
      
      if(b%2===0 && keys[phaseIdx]!=='BOOT') {
        const chord = phase.harm;
        bass(time, chord[b%chord.length]*0.5, I*0.86);
        if(b%4===0) pad(time, [chord[0],chord[1]*2,chord[2]*2], I*0.4, BEAT*4);
      }
      
      if(b%8===0 && keys[phaseIdx]!=='BOOT') {
        arp(time+BEAT*0.2, [phase.harm[2]*2, phase.harm[3]*2, phase.harm[2]*2, phase.harm[1]*2], I*0.74);
      }
      
      if(phaseIdx===2 && Math.random()>0.7) glitch(time+Math.random()*BEAT*0.2, I*0.5);
    }

    function scheduler() {
      while(nextNoteTime < ctx.currentTime + LOOKAHEAD) {
        scheduleNote(beat, nextNoteTime);
        nextNoteTime += BEAT;
        beat++;
      }
    }

    // VISUALIZERS & UI
    function drawFFT() {
      if(!analyser) return;
      const w = fftCanvas.offsetWidth, h = fftCanvas.offsetHeight;
      fftCtx.clearRect(0,0,w,h);
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      
      const bars = 64;
      const step = Math.floor(data.length / bars);
      const barW = (w / bars) - 1;
      for(let i=0;i<bars;i++){
        const val = data[i*step];
        const bh = (val/255)*h*0.85;
        fftCtx.fillStyle = val>170?'#00ff41':val>110?'#00ccaa':'#004422';
        fftCtx.fillRect(i*(barW+1), h-bh, barW, bh);
      }
      animId = requestAnimationFrame(drawFFT);
    }

    function updateMetrics() {
      if(!playing) return;
      const phaseInt = PHASES[Object.keys(PHASES)[phaseIdx]].int;
      cpu = Math.min(98, 8 + phaseInt*65 + Math.random()*12);
      mem = Math.min(2048, 340 + phaseInt*1200 + Math.random()*150);
      kpm = Math.round(180 + phaseInt*320 + (Math.random()-0.5)*40);
      
      document.getElementById('cpu').textContent = `${Math.round(cpu)}%`;
      document.getElementById('cpu-bar').style.width = `${cpu}%`;
      document.getElementById('mem').textContent = `${Math.round(mem)} MB`;
      document.getElementById('mem-bar').style.width = `${(mem/2048)*100}%`;
      document.getElementById('kpm').textContent = kpm;
      document.getElementById('kpm-bar').style.width = `${Math.min(100, kpm/500*100)}%`;
      document.getElementById('queue').textContent = phaseInt>0.7?'PROCESSING':'QUEUED';
      
      document.getElementById('led').className = playing?'status-led active':'status-led';
      
      requestAnimationFrame(updateMetrics);
    }

    function updateTimer() {
      if(!startTime) return;
      const e = Math.floor((Date.now()-startTime)/1000);
      const h = String(Math.floor(e/3600)).padStart(2,'0');
      const m = String(Math.floor((e%3600)/60)).padStart(2,'0');
      const s = String(e%60).padStart(2,'0');
      document.getElementById('timer').textContent = `${h}:${m}:${s}`;
      setTimeout(updateTimer, 1000);
    }

    // CONTROL
    function startEngine() {
      if(playing) return;
      init();
      if(ctx.state==='suspended') ctx.resume();
      
      fftCanvas = document.getElementById('fft');
      fftCtx = fftCanvas.getContext('2d');
      fftCanvas.width = fftCanvas.offsetWidth * 2;
      fftCanvas.height = fftCanvas.offsetHeight * 2;
      fftCtx.scale(2,2);
      
      playing=true; startTime=Date.now(); nextNoteTime=ctx.currentTime+0.05; beat=0; phaseIdx=0;
      schedId = setInterval(scheduler, SCHED_MS);
      drawFFT(); updateMetrics(); updateTimer();
      
      log('sys', 'Engine initialized. BPM locked at 150.');
      log('cmd', '> Flow state activated. Begin coding sequence.');
    }

    function stopEngine() {
      if(!playing) return;
      playing=false;
      clearInterval(schedId);
      cancelAnimationFrame(animId);
      log('sys', 'Process terminated. Audio chain released.');
      log('cmd', '> Session halted. Awaiting next initialization.');
      document.getElementById('phase').textContent = 'AWAITING INITIATION';
    }

    function triggerOverride() {
      if(!playing) return;
      log('warn', '[OVERRIDE] Manual intensity spike triggered.');
      const t = ctx.currentTime;
      for(let i=0;i<4;i++){
        kick(t+i*BEAT*0.5, 1.15);
        if(i%2===0) snare(t+i*BEAT*0.5, 0.9);
        hat(t+i*BEAT*0.25, 0.75, true);
      }
      arp(t, PHASES.DEPLOY.harm.map(x=>x*2), 1.0);
    }

    window.addEventListener('keydown', e=>{
      if(e.code==='Space'){e.preventDefault();playing?stopEngine():startEngine();}
      if(e.key.toLowerCase()==='o' && playing) triggerOverride();
    });

    window.addEventListener('resize', ()=>{
      if(fftCanvas){fftCanvas.width=fftCanvas.offsetWidth*2;fftCanvas.height=fftCanvas.offsetHeight*2;fftCtx.scale(2,2);}
      if(rainCanvas){rainCanvas.width=window.innerWidth;rainCanvas.height=window.innerHeight;}
    });

    log('sys', 'Interface loaded. Audio context ready for gesture.');
  </script>
</body>
</html>
