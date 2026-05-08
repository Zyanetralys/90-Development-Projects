import { useState, useRef, useEffect } from "react";
import "./ChatView.css";

export default function ChatView({ match, onBack }) {
  const [messages, setMessages] = useState([
    { id: 1, from: "them", text: "¡Hola! Me alegra que hagamos match 😊", time: "12:30" },
    { id: 2, from: "them", text: match.lastMsg, time: "12:34" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages(m => [...m, { id: Date.now(), from: "me", text: input.trim(), time }]);
    setInput("");
    // Simulated response
    setTimeout(() => {
      setMessages(m => [...m, {
        id: Date.now() + 1, from: "them",
        text: "¡Interesante! Cuéntame más 😊",
        time: `${now.getHours()}:${String(now.getMinutes() + 1).padStart(2, "0")}`
      }]);
    }, 1200);
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <div className="chat-avatar" style={{ background: match.color }}>{match.initials}</div>
        <div className="chat-info">
          <div className="chat-name">{match.name}</div>
          <div className="chat-role">{match.role} · {match.age} años</div>
        </div>
        <div className="chat-status">● En línea</div>
      </div>

      <div className="chat-notice">
        🔒 Esta conversación es privada. Recuerda: nunca compartas datos personales hasta que confíes plenamente.
      </div>

      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.from === "me" ? "mine" : "theirs"}`}>
            <div className="msg-bubble">{m.text}</div>
            <div className="msg-time">{m.time}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className="send-btn" onClick={send} disabled={!input.trim()}>↑</button>
      </div>
    </div>
  );
}
