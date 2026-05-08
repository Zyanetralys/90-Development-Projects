import { useState } from "react";
import FilterView from "./FilterView";
import "./SwipeView.css";

const MOCK_PROFILES = [
  { id: 1, name: "Valentina", age: 29, role: "Dominante (Dom)", province: "Madrid",
    bio: "Profesional de día, Mistress de noche. Busco compañera para explorar dinámicas de poder con respeto y comunicación.", 
    interests: ["Protocolo", "Bondage soft", "Rituales", "Roleplay"],
    color: "#c4185c", initials: "V" },
  { id: 2, name: "Ariadna", age: 34, role: "Switch", province: "Barcelona",
    bio: "Artista y exploradora. Me fascina el juego de roles y la negociación de límites. SSC siempre.",
    interests: ["Roleplay", "Maid/Mistress", "Sensuales", "Sin etiquetas"],
    color: "#7b1fa2", initials: "A" },
  { id: 3, name: "Sofía", age: 26, role: "Sumisa (Sub)", province: "Madrid",
    bio: "Nueva en la escena, con muchas ganas de aprender. Busco alguien paciente y respetuosa.",
    interests: ["Disciplina", "Sensuales"],
    color: "#880e4f", initials: "S" },
  { id: 4, name: "Carmen", age: 31, role: "Dominante (Dom)", province: "Valencia",
    bio: "Experta en psicología del comportamiento. Las dinámicas D/s me parecen fascinantes a nivel humano.",
    interests: ["Protocolo", "Rituales", "Petplay", "Disciplina"],
    color: "#4a148c", initials: "C" },
  { id: 5, name: "Lucía", age: 28, role: "Switch", province: "Madrid",
    bio: "Curiosa y abierta. Prefiero conocernos antes de nada. El consentimiento y la confianza son lo primero.",
    interests: ["Roleplay", "Bondage soft", "Voyeurismo"],
    color: "#ad1457", initials: "L" },
];

const DEFAULT_FILTERS = { role: "Todas", province: "Toda España", ageMin: 18, ageMax: 60 };

export default function SwipeView() {
  const [allProfiles] = useState(MOCK_PROFILES);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [seen, setSeen] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [matchPopup, setMatchPopup] = useState(null);

  const filtered = allProfiles.filter(p => {
    if (seen.includes(p.id)) return false;
    if (filters.role !== "Todas" && p.role !== filters.role) return false;
    if (filters.province !== "Toda España" && p.province !== filters.province) return false;
    if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
    return true;
  });

  const swipe = (direction) => {
    if (!filtered.length) return;
    const current = filtered[0];
    setLastAction(direction);
    if (direction === "right" && Math.random() > 0.4) {
      setMatchPopup(current);
    }
    setTimeout(() => {
      setSeen(s => [...s, current.id]);
      setLastAction(null);
    }, 300);
  };

  const current = filtered[0];
  const next = filtered[1];

  return (
    <div className="swipe-container">
      {showFilters && (
        <FilterView
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {matchPopup && (
        <div className="match-overlay" onClick={() => setMatchPopup(null)}>
          <div className="match-popup" onClick={e => e.stopPropagation()}>
            <div className="match-glow" />
            <div className="match-hearts">♥ ♥ ♥</div>
            <h2>¡Es un Match!</h2>
            <p>Tú y <strong>{matchPopup.name}</strong> os habéis gustado</p>
            <div className="match-avatars">
              <div className="match-avatar you">Yo</div>
              <span className="match-plus">♥</span>
              <div className="match-avatar" style={{ background: matchPopup.color }}>{matchPopup.initials}</div>
            </div>
            <button className="btn-primary" style={{width:"100%"}} onClick={() => setMatchPopup(null)}>
              Enviar mensaje
            </button>
            <button className="btn-outline" style={{width:"100%",marginTop:8}} onClick={() => setMatchPopup(null)}>
              Seguir descubriendo
            </button>
          </div>
        </div>
      )}

      <div className="swipe-topbar">
        <span className="swipe-count">{filtered.length} perfiles</span>
        <button className="filter-btn" onClick={() => setShowFilters(true)}>
          ⚙ Filtros
          {(filters.role !== "Todas" || filters.province !== "Toda España") && (
            <span className="filter-dot" />
          )}
        </button>
      </div>

      {!current ? (
        <div className="swipe-empty">
          <div className="empty-icon">♠</div>
          <h3>Sin más perfiles</h3>
          <p>Prueba a cambiar los filtros o vuelve más tarde</p>
          <button className="btn-outline" style={{marginTop:16}}
            onClick={() => { setSeen([]); setFilters(DEFAULT_FILTERS); }}>
            Reiniciar búsqueda
          </button>
        </div>
      ) : (
        <>
          <div className="card-stack">
            {next && (
              <div className="profile-card card-behind">
                <div className="card-avatar large" style={{ background: next.color }}>{next.initials}</div>
              </div>
            )}
            <div className={`profile-card card-front ${lastAction === "right" ? "swipe-right" : lastAction === "left" ? "swipe-left" : ""}`}>
              <div className="card-avatar large" style={{ background: current.color }}>{current.initials}</div>
              <div className="card-body">
                <div className="card-name-row">
                  <h2>{current.name}, {current.age}</h2>
                  <span className="tag">{current.role}</span>
                </div>
                <p className="card-province">📍 {current.province}</p>
                <p className="card-bio">{current.bio}</p>
                <div className="card-interests">
                  {current.interests.map(i => <span key={i} className="tag">{i}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="swipe-actions">
            <button className="action-btn pass" onClick={() => swipe("left")} title="Pasar">✕</button>
            <button className="action-btn super" title="Super like">★</button>
            <button className="action-btn like" onClick={() => swipe("right")} title="Me gusta">♥</button>
          </div>

          <div className="swipe-hint">
            <span>← Pasar</span>
            <span>★ Super</span>
            <span>Me gusta →</span>
          </div>
        </>
      )}
    </div>
  );
}
