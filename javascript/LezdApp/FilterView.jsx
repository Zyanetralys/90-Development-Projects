import { useState } from "react";
import "./FilterView.css";

const ROLES = ["Todas", "Dominante (Dom)", "Sumisa (Sub)", "Switch", "Explorando"];
const PROVINCES = [
  "Toda España", "Madrid", "Barcelona", "Valencia", "Sevilla",
  "Zaragoza", "Málaga", "Murcia", "Bilbao", "Alicante", "Otro"
];

export default function FilterView({ filters, onChange, onClose }) {
  const [local, setLocal] = useState(filters);

  const apply = () => { onChange(local); onClose(); };

  return (
    <div className="filter-overlay">
      <div className="filter-sheet">
        <div className="filter-handle" />
        <div className="filter-header">
          <h3>Filtros</h3>
          <button className="filter-close" onClick={onClose}>✕</button>
        </div>

        <div className="filter-section">
          <div className="filter-label">Rol</div>
          <div className="filter-options">
            {ROLES.map(r => (
              <button key={r}
                className={`filter-chip ${local.role === r ? "active" : ""}`}
                onClick={() => setLocal(f => ({ ...f, role: r }))}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">Provincia</div>
          <div className="filter-options">
            {PROVINCES.map(p => (
              <button key={p}
                className={`filter-chip ${local.province === p ? "active" : ""}`}
                onClick={() => setLocal(f => ({ ...f, province: p }))}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">
            Rango de edad: {local.ageMin}–{local.ageMax} años
          </div>
          <div className="filter-range-row">
            <input type="range" min="18" max="60" value={local.ageMin}
              onChange={e => setLocal(f => ({ ...f, ageMin: +e.target.value }))} />
            <input type="range" min="18" max="60" value={local.ageMax}
              onChange={e => setLocal(f => ({ ...f, ageMax: +e.target.value }))} />
          </div>
        </div>

        <button className="btn-primary filter-apply" onClick={apply}>
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
