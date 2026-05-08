import "./MatchesView.css";

const MOCK_MATCHES = [
  { id: 1, name: "Valentina", age: 29, role: "Dominante", color: "#c4185c", initials: "V",
    lastMsg: "¡Me alegra que hagamos match! ¿Cuéntame un poco más de ti?", time: "12:34", unread: 2 },
  { id: 2, name: "Ariadna", age: 34, role: "Switch", color: "#7b1fa2", initials: "A",
    lastMsg: "Hola 👋", time: "Ayer", unread: 0 },
  { id: 3, name: "Carmen", age: 31, role: "Dominante", color: "#4a148c", initials: "C",
    lastMsg: "Match reciente", time: "Lun", unread: 0 },
];

export default function MatchesView({ onOpenChat }) {
  return (
    <div className="matches-screen">
      <div className="matches-section-title">Tus matches</div>

      <div className="matches-new-row">
        {MOCK_MATCHES.map(m => (
          <button key={m.id} className="new-match-dot" onClick={() => onOpenChat(m)}>
            <div className="nm-avatar" style={{ background: m.color }}>{m.initials}</div>
            <span className="nm-name">{m.name}</span>
          </button>
        ))}
      </div>

      <div className="matches-section-title" style={{marginTop: 20}}>Mensajes</div>

      <div className="matches-list">
        {MOCK_MATCHES.map(m => (
          <button key={m.id} className="match-row" onClick={() => onOpenChat(m)}>
            <div className="mr-avatar" style={{ background: m.color }}>
              {m.initials}
              {m.unread > 0 && <div className="unread-badge">{m.unread}</div>}
            </div>
            <div className="mr-info">
              <div className="mr-top">
                <span className="mr-name">{m.name}</span>
                <span className="mr-time">{m.time}</span>
              </div>
              <div className="mr-preview">{m.lastMsg}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
