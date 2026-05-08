import { useState } from "react";
import "./AgeVerification.css";

export default function AgeVerification({ onAccept }) {
  const [checked, setChecked] = useState({ age: false, terms: false, rgpd: false });
  const canProceed = Object.values(checked).every(Boolean);

  return (
    <div className="age-screen">
      <div className="age-glow" />
      <div className="age-card">
        <div className="age-symbol">⚜</div>
        <h1 className="age-title">DomConnect</h1>
        <p className="age-sub">Comunidad privada para mujeres en España</p>

        <div className="age-divider" />

        <p className="age-warning">
          Este sitio contiene contenido adulto para personas mayores de 18 años.<br />
          Acceso exclusivo para mujeres +18 que buscan relaciones LesDOM consensuadas.
        </p>

        <div className="age-checks">
          {[
            { key: "age", label: "Confirmo que tengo 18 años o más" },
            { key: "terms", label: "Acepto los Términos de Uso y que el contenido es para adultos" },
            { key: "rgpd", label: "Acepto la Política de Privacidad (RGPD) y el tratamiento de mis datos" },
          ].map(({ key, label }) => (
            <label key={key} className="age-check-row">
              <input
                type="checkbox"
                checked={checked[key]}
                onChange={e => setChecked(p => ({ ...p, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <button
          className="btn-primary age-btn"
          disabled={!canProceed}
          onClick={onAccept}
        >
          Entrar
        </button>

        <p className="age-legal">
          Al acceder, confirmas que eres mayor de edad según la legislación española vigente.
          Datos tratados conforme al RGPD (UE) 2016/679.
        </p>
      </div>
    </div>
  );
}
