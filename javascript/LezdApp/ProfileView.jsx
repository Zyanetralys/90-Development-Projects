import { useState } from "react";
import "./ProfileView.css";

export default function ProfileView() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Mi Perfil", age: "28", role: "Switch",
    province: "Madrid", bio: "Explorando la escena con curiosidad y respeto.",
    interests: ["Roleplay", "Bondage soft", "Sensuales"],
    visible: true,
  });

  return (
    <div className="profile-screen">
      <div className="profile-hero">
        <div className="profile-avatar-big">✦</div>
        <h2>{profile.name}, {profile.age}</h2>
        <div className="profile-tags">
          <span className="tag">{profile.role}</span>
          <span className="tag">📍 {profile.province}</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-label">Sobre mí</div>
        {editing
          ? <textarea className="profile-textarea" value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} />
          : <p className="profile-bio">{profile.bio}</p>
        }
      </div>

      <div className="profile-section">
        <div className="profile-label">Intereses</div>
        <div className="profile-interests">
          {profile.interests.map(i => <span key={i} className="tag">{i}</span>)}
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-setting-row">
          <div>
            <div className="profile-label" style={{marginBottom:0}}>Perfil visible</div>
            <div className="profile-setting-desc">Aparecer en las búsquedas</div>
          </div>
          <button
            className={`toggle-btn ${profile.visible ? "on" : ""}`}
            onClick={() => setProfile(p => ({ ...p, visible: !p.visible }))}
          >
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-label">Seguridad y privacidad</div>
        <div className="privacy-links">
          <button className="privacy-link">Política de Privacidad (RGPD)</button>
          <button className="privacy-link">Eliminar mi cuenta</button>
          <button className="privacy-link">Exportar mis datos</button>
          <button className="privacy-link">Bloquear usuarios</button>
        </div>
      </div>

      <div className="profile-btns">
        <button className="btn-primary" onClick={() => setEditing(e => !e)}>
          {editing ? "Guardar cambios" : "Editar perfil"}
        </button>
      </div>
    </div>
  );
}
