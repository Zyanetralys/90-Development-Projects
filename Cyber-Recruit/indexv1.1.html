<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CYBER-RECRUIT // GRID v4</title>
  <style>
    :root {
      --bg: #05090f; --panel: #0c121d; --surface: #111927; --border: #1b2636;
      --cyan: #00e5ff; --amber: #ffb300; --red: #ff5252; --green: #69f0ae; --purple: #b388ff; --blue: #448aff;
      --text: #e0e6ed; --muted: #8b9bb4; --dim: #5a6a7d;
      --mono: 'SF Mono', 'Cascadia Code', Consolas, monospace;
      --sans: 'Inter', system-ui, -apple-system, sans-serif;
      --radius: 8px; --shadow: 0 4px 16px rgba(0,0,0,0.45);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: var(--sans); height: 100vh; overflow: hidden; display: grid; grid-template-rows: auto 1fr; background-image: radial-gradient(1200px 600px at 50% -100px, #0f1a2e 0%, var(--bg) 60%); }
    
    /* HEADER */
    header { background: var(--panel); padding: 0.6rem 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(8px); }
    h1 { font-family: var(--mono); font-size: 0.85rem; letter-spacing: 2px; color: var(--cyan); display: flex; align-items: center; gap: 0.5rem; }
    h1::before { content: ''; width: 8px; height: 8px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 6px var(--cyan); animation: blink 2s infinite; }
    .status { font-size: 0.65rem; padding: 0.25rem 0.6rem; border-radius: 12px; background: #0f151d; border: 1px solid var(--border); font-family: var(--mono); letter-spacing: 1px; color: var(--dim); }
    .status.active { background: rgba(105,240,174,0.1); border-color: var(--green); color: var(--green); }
    .status.paused { border-color: var(--amber); color: var(--amber); }
    
    /* MAIN GRID */
    main { display: grid; grid-template-columns: 2.3fr 1.7fr; gap: 0.8rem; padding: 0.8rem; height: 100%; overflow: hidden; }
    .panel { background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow); }
    .panel-header { padding: 0.5rem 0.8rem; background: #0a0f17; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 0.75rem; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center; }
    .panel-header button { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.7rem; transition: 0.2s; }
    .panel-header button:hover { background: #1a2636; color: var(--text); }
    
    /* CHAT FEED */
    #chat-log { flex: 1; overflow-y: auto; padding: 0.6rem; scroll-behavior: smooth; }
    .msg-group { margin-bottom: 0.8rem; opacity: 0; animation: fadeSlide 0.35s ease forwards; }
    .msg { display: flex; gap: 0.7rem; padding: 0.4rem 0; }
    .msg-avatar { width: 34px; height: 34px; background: linear-gradient(135deg, #1a2636, #0f151d); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--mono); font-size: 0.8rem; color: var(--cyan); border: 2px solid var(--border); flex-shrink: 0; position: relative; }
    .msg-avatar::after { content: ''; position: absolute; bottom: -2px; right: -2px; width: 9px; height: 9px; background: var(--green); border-radius: 50%; border: 2px solid var(--panel); }
    .msg-avatar.busy::after { background: var(--amber); }
    .msg-avatar.away::after { background: var(--dim); }
    .msg-content { flex: 1; min-width: 0; }
    .msg-meta { display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.15rem; }
    .msg-handle { font-weight: 600; color: var(--cyan); font-size: 0.85rem; }
    .msg-role { font-size: 0.65rem; color: var(--dim); background: #0f151d; padding: 1px 4px; border-radius: 3px; border: 1px solid #1b2636; }
    .msg-time { font-size: 0.65rem; color: var(--dim); margin-left: auto; font-family: var(--mono); }
    .msg-text { font-size: 0.85rem; line-height: 1.5; color: var(--text); background: #0f151d; padding: 0.6rem 0.7rem; border-radius: 6px; border-left: 3px solid var(--border); position: relative; word-break: break-word; }
    .msg.highlight .msg-text { border-left-color: var(--amber); background: #121a25; box-shadow: 0 0 8px rgba(255,179,0,0.06); }
    .msg.reply .msg-text { margin-left: 1.2rem; border-left: 3px solid var(--purple); background: #101720; }
    .kw { background: rgba(255,179,0,0.12); color: var(--amber); padding: 1px 4px; border-radius: 3px; font-weight: 600; font-size: 0.8em; }
    .mention { color: var(--purple); font-weight: 600; cursor: pointer; }
    .typing-indicator { font-style: italic; color: var(--dim); font-size: 0.75rem; margin-top: 0.2rem; opacity: 0; transition: opacity 0.2s; min-height: 1.1rem; }
    .typing-indicator.active { opacity: 1; }
    
    /* MONITOR DASHBOARD */
    .tabs { display: flex; border-bottom: 1px solid var(--border); background: #0a0f17; overflow-x: auto; }
    .tab-btn { padding: 0.5rem 0.8rem; cursor: pointer; font-size: 0.75rem; color: var(--muted); border-bottom: 2px solid transparent; transition: 0.2s; white-space: nowrap; }
    .tab-btn:hover { color: var(--text); }
    .tab-btn.active { color: var(--cyan); border-bottom-color: var(--cyan); }
    .tab-content { display: none; padding: 0.7rem; overflow-y: auto; flex: 1; }
    .tab-content.active { display: block; }
    
    /* PROFILE CARDS */
    .profile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.7rem; margin-bottom: 0.7rem; cursor: pointer; transition: 0.2s; position: relative; }
    .profile-card:hover { border-color: var(--dim); transform: translateY(-1px); }
    .profile-card.bookmarked::before { content: '★'; position: absolute; top: -6px; right: -6px; background: var(--amber); color: #000; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }
    .profile-header { display: flex; justify-content: space-between; align-items: center; }
    .profile-score { font-family: var(--mono); font-weight: 700; color: var(--green); font-size: 1rem; }
    .profile-bar { height: 5px; background: #1b2636; border-radius: 3px; overflow: hidden; margin: 0.25rem 0; }
    .profile-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--cyan)); width: 0%; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
    .radar { width: 100%; height: 60px; margin: 0.3rem 0; position: relative; }
    .radar svg { width: 100%; height: 100%; }
    .profile-meta { font-size: 0.65rem; color: var(--dim); display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem; margin-top: 0.2rem; }
    .profile-actions { display: flex; gap: 0.4rem; margin-top: 0.4rem; }
    .profile-actions button { background: #1b2636; border: none; color: var(--muted); padding: 0.2rem 0.5rem; border-radius: 3px; cursor: pointer; font-size: 0.65rem; }
    .profile-actions button:hover { background: #253245; color: var(--text); }
    .profile-actions button.active { background: var(--cyan); color: #000; font-weight: 600; }
    
    /* KEYWORDS & ALERTS */
    .kw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.4rem; }
    .kw-item { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 0.5rem; text-align: center; font-size: 0.7rem; }
    .kw-count { font-family: var(--mono); color: var(--amber); font-weight: 700; display: block; margin-top: 2px; font-size: 0.85rem; }
    .alert-item { padding: 0.5rem 0; border-bottom: 1px dashed #1b2636; font-size: 0.75rem; display: flex; gap: 0.5rem; align-items: flex-start; }
    .alert-icon { color: var(--red); font-size: 0.85rem; }
    .alert-time { color: var(--dim); font-size: 0.6rem; margin-left: auto; font-family: var(--mono); white-space: nowrap; }
    .alert-tag { display: inline-block; padding: 1px 3px; background: #1b2636; border-radius: 2px; font-size: 0.6rem; color: var(--muted); margin-top: 2px; }
    
    /* THREADS */
    .thread-item { background: var(--surface); border: 1px solid var(--border); border-radius: 5px; padding: 0.5rem; margin-bottom: 0.5rem; }
    .thread-title { font-weight: 600; color: var(--cyan); font-size: 0.8rem; margin-bottom: 0.2rem; }
    .thread-meta { font-size: 0.65rem; color: var(--dim); display: flex; justify-content: space-between; }
    .thread-participants { display: flex; gap: 0.3rem; margin-top: 0.2rem; }
    .participant-dot { width: 18px; height: 18px; border-radius: 50%; background: #1b2636; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: var(--muted); }
    
    /* SCENARIOS */
    .scenario-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem; margin-bottom: 0.8rem; }
    .scenario-btn { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 0.5rem; border-radius: 5px; cursor: pointer; font-size: 0.7rem; text-align: left; }
    .scenario-btn:hover { border-color: var(--dim); }
    .scenario-btn.active { border-color: var(--cyan); background: rgba(0,229,255,0.08); }
    
    /* CONTROLS */
    .controls { padding: 0.6rem 1rem; background: var(--panel); border-top: 1px solid var(--border); display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; }
    button, select, input { background: #1b2636; color: var(--text); border: 1px solid var(--border); padding: 0.35rem 0.6rem; border-radius: 4px; cursor: pointer; font-family: var(--sans); font-size: 0.75rem; }
    button:hover { background: #253245; }
    button.primary { background: var(--cyan); color: #000; font-weight: 600; border: none; }
    button.primary:hover { background: #00c9e0; box-shadow: 0 0 8px rgba(0,229,255,0.3); }
    .slider-wrap { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: var(--muted); }
    input[type="range"] { accent-color: var(--cyan); width: 90px; }
    
    /* TOAST */
    .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
    .toast { background: #0f151d; border: 1px solid var(--border); border-left: 3px solid var(--cyan); padding: 0.6rem 0.8rem; border-radius: 4px; font-size: 0.8rem; box-shadow: var(--shadow); animation: slideIn 0.3s ease; max-width: 280px; }
    .toast.alert { border-left-color: var(--amber); }
    
    /* ANIMATIONS */
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes blink { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @media (max-width: 850px) { main { grid-template-columns: 1fr; } .monitor-panel { height: 50vh; } }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #0a0f17; }
    ::-webkit-scrollbar-thumb { background: #1b2636; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #2a3a4d; }
    
    /* PRINT */
    @media print {
      body { background: #fff; color: #000; height: auto; overflow: visible; }
      .panel { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
      .controls, header button, .scenario-grid { display: none; }
      .toast-container { display: none; }
      .msg-text { background: #f8f9fa; color: #000; }
      .kw { background: #e9ecef; color: #000; }
    }
  </style>
</head>
<body>
  <header>
    <h1>CYBER-RECRUIT // GRID</h1>
    <span class="status" id="sys-status">OFFLINE</span>
  </header>
  
  <main>
    <section class="panel">
      <div class="panel-header">
        <span>CANAL DE INTERACCIÓN</span>
        <span id="msg-counter" style="color:var(--dim)">0 MENSAJES</span>
      </div>
      <div id="chat-log"></div>
    </section>
    
    <section class="panel monitor-panel">
      <div class="panel-header">
        <span>RECRUITER DASHBOARD</span>
        <button onclick="App.exportJSON()">⬇ JSON</button>
        <button onclick="App.exportCSV()">⬇ CSV</button>
        <button onclick="window.print()">🖨 REPORT</button>
      </div>
      <div class="tabs">
        <div class="tab-btn active" onclick="App.switchTab('profiles')">Perfiles</div>
        <div class="tab-btn" onclick="App.switchTab('keywords')">Keywords</div>
        <div class="tab-btn" onclick="App.switchTab('threads')">Hilos</div>
        <div class="tab-btn" onclick="App.switchTab('alerts')">Alertas</div>
        <div class="tab-btn" onclick="App.switchTab('scenarios')">Escenarios</div>
      </div>
      <div id="tab-profiles" class="tab-content active"></div>
      <div id="tab-keywords" class="tab-content"></div>
      <div id="tab-threads" class="tab-content"></div>
      <div id="tab-alerts" class="tab-content"></div>
      <div id="tab-scenarios" class="tab-content"></div>
    </section>
  </main>
  
  <div class="controls">
    <button class="primary" id="btn-toggle" onclick="App.toggle()">▶ INICIAR</button>
    <div class="slider-wrap">
      <span>VEL:</span>
      <input type="range" id="speed" min="300" max="3000" value="1000" step="100" oninput="App.updateSpeed(this.value)">
      <span id="speed-val">1.0s</span>
    </div>
    <div class="slider-wrap">
      <span>FILTRO:</span>
      <input type="text" id="kw-filter" placeholder="pentest, c2, siem" style="width:140px" oninput="App.setFilter(this.value)">
    </div>
  </div>
  
  <div class="toast-container" id="toast-container"></div>

<script>
// ================= CONFIG =================
const CFG = {
  keywords: ['pentest','siem','exploit','oscp','malware','reverse','c2','threat intel','soc','blue team','red team','zero-day','ioc','yara','memory forensics','privilege escalation','kubernetes','terraform','ransomware','phishing','api sec','evasion','hooking','sandbox','obfuscation','lateral movement','kerberoasting','bypass','waf','edr','chain','persistence','mitre att&ck','detection engineering'],
  roles: ['Pentester','SOC Analyst','Reverse Eng','Cloud Sec','Threat Hunter','Malware Dev','AppSec','GRC','IR Lead','Sec Architect'],
  handles: ['NullPtr','CipherWolf','KernelPanic','PhantomRoot','ZeroTrust','DarkNode','ByteShift','NullByte','RootKitty','ShadowSys'],
  contextWindow: 5,
  replyChance: 0.4,
  persistenceKey: 'cyber_grid_v4',
  weights: { tech:0.35, collab:0.25, threat:0.25, consistency:0.15 }
};

// ================= STATE =================
const State = {
  bots: [], messages: [], threads: [], alerts: [], running: false, interval: 1000, filter: new Set(), scenario: 'default'
};

// ================= BOT =================
class Bot {
  constructor(id, handle, role) {
    this.id = id; this.handle = handle; this.role = role;
    this.expertise = new Set(CFG.keywords.slice(Math.floor(Math.random()*4), Math.floor(Math.random()*7)+4));
    this.hits = {}; this.scores = { tech:0, collab:0, threat:0, consistency:0 };
    this.state = 'idle'; this.status = 'online'; this.bookmarked = false; this.notes = ''; this.priority = 'medium';
    this.persona = this._assignPersona();
  }
  _assignPersona() {
    const tones = [
      { name: 'técnico', post: 'Desplegando {kw} en staging. Validando firmas y políticas de red antes de merge.', reply: 'Coincido. En mi stack de {role} he visto el mismo patrón con {kw}. Logs adjuntos.' },
      { name: 'analítico', post: 'Análisis de {kw} muestra comportamiento evasivo. Beaconing cada 14s, ofuscación en strings.', reply: 'Interesante. ¿Has correlacionado {kw} con los IOCs del último incidente? Requiere validación cruzada.' },
      { name: 'operativo', post: 'Red team simuló {kw} ayer. Detección: 18min. Contención: 6min. Playbook actualizado.', reply: '@{handle} eso se alinea con nuestras métricas. Estoy afinando reglas Sigma para {kw}. PR listo.' },
      { name: 'estratégico', post: 'Migrando infra a {kw}. Evaluando impacto en SLA y zero-trust nativo. Buscamos feedback de arquitectura.', reply: 'Gracias por el dato. {kw} sigue siendo crítico en entornos multi-tenant. Validando controles de acceso.' }
    ];
    return tones[Math.floor(Math.random()*tones.length)];
  }
  addHit(kw) {
    this.hits[kw] = (this.hits[kw]||0)+1;
    this._calcScores();
  }
  _calcScores() {
    const total = Object.values(this.hits).reduce((a,b)=>a+b,0);
    this.scores.tech = Math.min(100, this.expertise.size * 12 + total * 3);
    this.scores.collab = Math.min(100, this.messages?.filter(m=>m.reply).length * 18 || 0);
    this.scores.threat = Math.min(100, Object.keys(this.hits).filter(k=>['zero-day','c2','bypass','evasion','privilege escalation','malware'].includes(k)).length * 25);
    this.scores.consistency = Math.min(100, (this.messages?.length||0) * 4);
    this.total = Math.round(this.scores.tech*CFG.weights.tech + this.scores.collab*CFG.weights.collab + this.scores.threat*CFG.weights.threat + this.scores.consistency*CFG.weights.consistency);
  }
  getTier() {
    const t = this.total;
    if(t>=85) return 'Principal'; if(t>=70) return 'Senior'; if(t>=50) return 'Mid'; return 'Junior';
  }
}

// ================= ENGINE =================
const Engine = {
  init() {
    if(State.bots.length) return;
    CFG.handles.slice(0,6).forEach((h,i) => {
      State.bots.push(new Bot(`B${i+1}`, h, CFG.roles[Math.floor(Math.random()*CFG.roles.length)]));
    });
  },
  start() {
    if(State.running) return;
    State.running = true;
    State._timer = setInterval(() => this._cycle(), State.interval);
    document.getElementById('sys-status').textContent = 'INTERCEPTANDO';
    document.getElementById('sys-status').classList.add('active');
    document.getElementById('sys-status').classList.remove('paused');
    document.getElementById('btn-toggle').textContent = '⏹ DETENER';
  },
  stop() {
    if(!State.running) return;
    State.running = false;
    clearInterval(State._timer);
    document.getElementById('sys-status').textContent = 'PAUSADO';
    document.getElementById('sys-status').classList.add('paused');
    document.getElementById('sys-status').classList.remove('active');
    document.getElementById('btn-toggle').textContent = '▶ INICIAR';
  },
  _cycle() {
    const bot = State.bots[Math.floor(Math.random()*State.bots.length)];
    bot.state = 'typing'; bot.status = Math.random()>0.75?'busy':Math.random()>0.9?'away':'online';
    UI.showTyping(bot);
    
    setTimeout(() => {
      bot.state = 'speaking';
      const msg = this._genMsg(bot);
      const entry = { bot, msg, ts: Date.now(), id: Date.now()+Math.random() };
      State.messages.push(entry);
      if(!bot.messages) bot.messages = [];
      bot.messages.push(entry);
      
      // Thread tracking
      let thread = State.threads.find(t => t.kw === msg.kw && t.active);
      if(!thread) thread = { kw: msg.kw, participants: [], msgs: [], decay: 1.0, active: true };
      thread.participants = [...new Set([...thread.participants, bot.handle])];
      thread.msgs.push(msg.text);
      thread.decay = 1.0;
      State.threads.forEach(t => t.decay *= 0.88);
      State.threads = State.threads.filter(t => t.decay > 0.3);
      if(State.threads.length > 6) State.threads.shift();
      
      UI.hideTyping(bot);
      UI.pushChat(bot, msg);
      UI.scan(bot, msg);
      UI.renderAll();
      document.getElementById('msg-counter').textContent = `${State.messages.length} MENSAJES`;
      
      // Persist
      Storage.save();
    }, 350 + Math.random()*700);
  },
  _genMsg(bot) {
    const recent = State.messages.slice(-CFG.contextWindow).filter(m => Date.now()-m.ts<20000);
    const shouldReply = recent.length>0 && Math.random()<CFG.replyChance;
    let text, replyTarget=null, kw;
    
    if(shouldReply) {
      const prev = recent[Math.floor(Math.random()*recent.length)];
      replyTarget = prev.bot.handle;
      kw = prev.msg.kw || CFG.keywords[Math.floor(Math.random()*CFG.keywords.length)];
      text = this._tpl(bot.persona.reply, kw, bot.role, replyTarget);
    } else {
      kw = [...bot.expertise][Math.floor(Math.random()*bot.expertise.size)] || CFG.keywords[Math.floor(Math.random()*CFG.keywords.length)];
      text = this._tpl(bot.persona.post, kw, bot.role);
    }
    return { text, replyTarget, kw, scenario: State.scenario };
  },
  _tpl(t, kw, role, handle) {
    return t.replace('{kw}', kw).replace('{role}', role).replace(/{handle}/g, handle||'');
  }
};

// ================= UI =================
const UI = {
  chatLog: document.getElementById('chat-log'),
  profiles: document.getElementById('tab-profiles'),
  keywords: document.getElementById('tab-keywords'),
  alerts: document.getElementById('tab-alerts'),
  threads: document.getElementById('tab-threads'),
  scenarios: document.getElementById('tab-scenarios'),
  
  pushChat(bot, msg) {
    const g = document.createElement('div'); g.className = 'msg-group';
    const d = document.createElement('div'); d.className = `msg ${msg.replyTarget?'reply':''} ${msg.kw?'highlight':''}`;
    let fmt = msg.text.replace(/(@\w+)/g, '<span class="mention">$1</span>').replace(new RegExp(`(${CFG.keywords.join('|')})`, 'gi'), '<span class="kw">$1</span>');
    const t = new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'});
    d.innerHTML = `<div class="msg-avatar ${bot.status}">${bot.handle.substring(0,2)}</div><div class="msg-content"><div class="msg-meta"><span class="msg-handle">${bot.handle}</span><span class="msg-role">${bot.role}</span><span class="msg-time">${t}</span></div><div class="msg-text">${fmt}</div></div>`;
    g.appendChild(d); this.chatLog.appendChild(g); this.chatLog.scrollTop = this.chatLog.scrollHeight;
    if(this.chatLog.children.length>100) this.chatLog.removeChild(this.chatLog.firstChild);
  },
  showTyping(bot) {
    let i = document.getElementById(`ty-${bot.id}`);
    if(!i) { i=document.createElement('div'); i.id=`ty-${bot.id}`; i.className='typing-indicator'; this.chatLog.appendChild(i); }
    i.innerHTML=`<span style="color:var(--dim)">▸ ${bot.handle} está escribiendo...</span>`; i.classList.add('active'); this.chatLog.scrollTop=this.chatLog.scrollHeight;
  },
  hideTyping(bot) { document.getElementById(`ty-${bot.id}`)?.classList.remove('active'); },
  
  scan(bot, msg) {
    if(!msg.kw) return;
    bot.addHit(msg.kw);
    if(['zero-day','c2','bypass','evasion','privilege escalation','malware'].some(k=>msg.text.toLowerCase().includes(k))) {
      this.logAlert(bot, msg);
      UI.toast(`⚡ ${bot.handle} | ${msg.kw} detectado`, 'alert');
    }
  },
  
  renderAll() { this.renderProfiles(); this.renderKeywords(); this.renderThreads(); this.renderScenarios(); },
  
  renderProfiles() {
    const sorted = [...State.bots].sort((a,b)=>b.total-a.total);
    this.profiles.innerHTML = sorted.map(b => `
      <div class="profile-card ${b.bookmarked?'bookmarked':''}" onclick="App.selectProfile('${b.id}')">
        <div class="profile-header"><div><strong style="color:var(--cyan)">${b.handle}</strong> <span style="color:var(--dim);font-size:0.7rem;margin-left:4px">${b.role}</span><span style="margin-left:6px;font-size:0.6rem;background:#1b2636;padding:1px 3px;border-radius:2px;color:var(--muted)">${b.getTier()}</span></div><div class="profile-score">${b.total}%</div></div>
        <div class="profile-bar"><div class="profile-fill" style="width:${b.total}%"></div></div>
        <div class="radar">${this._radar(b.scores)}</div>
        <div class="profile-meta"><span>Técnico: ${b.scores.tech|0}%</span><span>Colaboración: ${b.scores.collab|0}%</span><span>Amenaza: ${b.scores.threat|0}%</span><span>Consistencia: ${b.scores.consistency|0}%</span></div>
        <div class="profile-tags">${[...b.expertise].slice(0,5).map(e=>`<span style="font-size:0.6rem;background:#1b2636;color:var(--muted);padding:1px 4px;border-radius:2px;margin-right:2px">${e}</span>`).join('')}</div>
        <div class="profile-actions">
          <button class="${b.bookmarked?'active':''}" onclick="event.stopPropagation();App.toggleBookmark('${b.id}')">★ ${b.bookmarked?'Guardado':'Guardar'}</button>
          <button onclick="event.stopPropagation();App.setPriority('${b.id}','high')">🔴 Alta</button>
          <button onclick="event.stopPropagation();App.setPriority('${b.id}','medium')">🟡 Media</button>
        </div>
      </div>
    `).join('');
  },
  _radar(s) {
    const pts = [s.tech, s.collab, s.threat, s.consistency].map(v => v/100);
    const poly = `0,${pts[0]} ${pts[1]},${0.5} 1,${pts[2]} ${1-pts[3]},${0.5}`;
    return `<svg viewBox="0 0 2 1" preserveAspectRatio="none"><polygon points="${poly}" fill="rgba(0,229,255,0.15)" stroke="var(--cyan)" stroke-width="0.05"/></svg>`;
  },
  
  renderKeywords() {
    const c={}; CFG.keywords.forEach(k=>c[k]=0); State.bots.forEach(b=>Object.entries(b.hits).forEach(([k,v])=>c[k]+=v));
    this.keywords.innerHTML=`<div class="kw-grid">${Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,16).map(([k,v])=>`<div class="kw-item">${k}<span class="kw-count">${v}</span></div>`).join('')}</div>`;
  },
  renderThreads() {
    this.threads.innerHTML=State.threads.length ? State.threads.map(t=>`<div class="thread-item"><div class="thread-title">🔹 ${t.kw}</div><div class="thread-meta"><span>Decay: ${(t.decay*100)|0}%</span><span>${t.msgs.length} msgs</span></div><div class="thread-participants">${t.participants.slice(0,4).map(p=>`<div class="participant-dot" title="${p}">${p.substring(0,2)}</div>`).join('')}</div></div>`).join('') : '<div style="color:var(--dim);text-align:center;padding:1.5rem">Sin hilos activos</div>';
  },
  renderScenarios() {
    const sc = ['default','red_team','incident','ctf','compliance'];
    const labels = {default:'Normal', red_team:'Red Team Drill', incident:'Incident Response', ctf:'CTF Collaboration', compliance:'Audit & GRC'};
    this.scenarios.innerHTML=`<div class="scenario-grid">${sc.map(s=>`<button class="scenario-btn ${State.scenario===s?'active':''}" onclick="App.setScenario('${s}')">${labels[s]}</button>`).join('')}</div>`;
  },
  logAlert(bot, msg) {
    const t = new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const d = document.createElement('div'); d.className='alert-item';
    const hk = ['zero-day','c2','bypass','evasion','privilege escalation','malware'].filter(k=>msg.text.toLowerCase().includes(k));
    d.innerHTML=`<span class="alert-icon">⚡</span><div><strong>${bot.handle}</strong> | ${hk.includes('zero-day')?'CRÍTICA':'ALTA'}<br><span style="color:var(--dim);font-size:0.65rem">${msg.text.substring(0,70)}...</span><div>${hk.map(k=>`<span class="alert-tag">${k}</span>`).join('')}</div></div><span class="alert-time">${t}</span>`;
    this.alerts.prepend(d); if(this.alerts.children.length>40) this.alerts.removeChild(this.alerts.lastChild);
  },
  toast(m, t='info') {
    const c = document.getElementById('toast-container');
    const d = document.createElement('div'); d.className=`toast ${t}`; d.textContent=m; c.appendChild(d);
    setTimeout(()=>d.remove(), 3000);
  }
};

// ================= STORAGE =================
const Storage = {
  save() {
    try { localStorage.setItem(CFG.persistenceKey, JSON.stringify({ bots: State.bots.map(b=>({id:b.id,handle:b.handle,role:b.role,expertise:[...b.expertise],hits:b.hits,scores:b.scores,total:b.total,bookmarked:b.bookmarked,notes:b.notes,priority:b.priority})), msgs: State.messages.slice(-150).map(m=>({id:m.id,ts:m.ts,bot:m.bot.id,txt:m.msg.text})) })); } catch(e){}
  },
  load() {
    const d = localStorage.getItem(CFG.persistenceKey);
    if(!d) return false;
    try {
      const p = JSON.parse(d);
      p.bots.forEach(b=>{ const bot=new Bot(b.id,b.handle,b.role); Object.assign(bot, b); bot.expertise=new Set(b.expertise); State.bots.push(bot); });
      State.messages = p.msgs.map(m=>({id:m.id, ts:m.ts, bot:State.bots.find(b=>b.id===m.bot), msg:{text:m.txt,kw:null,replyTarget:null}}));
      return true;
    } catch(e){ return false; }
  }
};

// ================= APP =================
const App = {
  init() {
    if(!Storage.load()) Engine.init();
    UI.renderAll();
  },
  toggle() { State.running ? Engine.stop() : Engine.start(); },
  updateSpeed(v) { State.interval=parseInt(v); document.getElementById('speed-val').textContent=(v/1000).toFixed(1)+'s'; if(State.running) { Engine.stop(); Engine.start(); } },
  setFilter(val) { State.filter = new Set(val.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)); },
  switchTab(t) {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`tab-${t}`).classList.add('active');
  },
  selectProfile(id) { const b=State.bots.find(x=>x.id===id); if(b) UI.toast(`Perfil seleccionado: ${b.handle} | Score: ${b.total}%`); },
  toggleBookmark(id) { const b=State.bots.find(x=>x.id===id); if(b) { b.bookmarked=!b.bookmarked; UI.renderProfiles(); Storage.save(); UI.toast(b.bookmarked?`★ ${b.handle} guardado`:`${b.handle} desmarcado`); } },
  setPriority(id, p) { const b=State.bots.find(x=>x.id===id); if(b) { b.priority=p; Storage.save(); UI.toast(`Prioridad ${b.handle}: ${p}`); } },
  setScenario(s) { State.scenario=s; UI.renderScenarios(); UI.toast(`Escenario: ${s.replace('_',' ').toUpperCase()}`); },
  exportJSON() {
    const d = { ts:new Date().toISOString(), scenario:State.scenario, bots:State.bots.map(b=>({handle:b.handle,role:b.role,tier:b.getTier(),scores:b.scores,total:b.total,bookmarked:b.bookmarked,priority:b.priority,expertise:[...b.expertise],hits:b.hits})) };
    this._dl(JSON.stringify(d,null,2),'cyber_recruit_v4.json','application/json');
  },
  exportCSV() {
    const r=[['Handle','Role','Tier','Total','Tech','Collab','Threat','Consistency','Priority','Bookmarked','Keywords']];
    State.bots.sort((a,b)=>b.total-a.total).forEach(b=>{ r.push([b.handle,b.role,b.getTier(),b.total,b.scores.tech,b.scores.collab,b.scores.threat,b.scores.consistency,b.priority,b.bookmarked?[...b.expertise].join(';'):'']) });
    this._dl(r.map(x=>x.join(',')).join('\n'),'cyber_roster_v4.csv','text/csv');
  },
  _dl(c,n,t) { const b=new Blob([c],{type:t}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click(); }
};

window.onload = () => App.init();
</script>
</body>
</html>
