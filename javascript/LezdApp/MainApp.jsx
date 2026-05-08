import { useState } from "react";
import SwipeView from "./SwipeView";
import MatchesView from "./MatchesView";
import ChatView from "./ChatView";
import ProfileView from "./ProfileView";
import "./MainApp.css";

export default function MainApp() {
  const [tab, setTab] = useState("discover");
  const [activeChat, setActiveChat] = useState(null);

  const tabs = [
    { id: "discover", icon: "♠", label: "Descubrir" },
    { id: "matches", icon: "♥", label: "Matches" },
    { id: "profile", icon: "◈", label: "Perfil" },
  ];

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-logo">DomConnect</div>
        <div className="header-badge">Madrid · ES</div>
      </header>

      <main className="main-content">
        {tab === "discover" && <SwipeView />}
        {tab === "matches" && !activeChat && (
          <MatchesView onOpenChat={setActiveChat} />
        )}
        {tab === "matches" && activeChat && (
          <ChatView match={activeChat} onBack={() => setActiveChat(null)} />
        )}
        {tab === "profile" && <ProfileView />}
      </main>

      <nav className="bottom-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); setActiveChat(null); }}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
