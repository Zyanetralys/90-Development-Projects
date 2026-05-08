import { useState } from "react";
import "./Onboarding.css";

const ROLES = ["Dominante (Dom)", "Sumisa (Sub)", "Switch", "Explorando"];
const INTERESTS = [
  "Roleplay", "Bondage soft", "Protocolo", "Petplay", "Disciplina",
  "Rituales", "Maid/Mistress", "Age play (adultos)", "Voyeurismo",
  "Exhibicionismo", "Sensuales", "Sin etiquetas"
];
const PROVINCES = [
  "Madrid","Barcelona","Valencia","Sevilla","Zaragoza","Málaga","Murcia",
  "Palma","Las Palmas","Bilbao","Alicante","Córdoba","Valladolid","Vigo",
  "Gijón","Granada","Vitoria","Oviedo","Badalona","Cartagena","Otro"
];

const STEPS = ["perfil", "rol", "intereses", "ubicación"];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", age: "", bio: "",
    role: "", interests: [], province: "", photo: null
  });

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : onComplete(data);
  const back = () => setStep(s => s - 1);

  const toggleInterest = (i) => setData(d => ({
    ...d,
    interests: d.interests.includes(i)
      ? d.interests.filter(x => x !== i)
      : d.interests.length < 6 ? [...d.interests, i] : d.interests
  }));

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="onboard-screen">
      <div className="onboard-card">
        <div className="onboard-header">
          <div className="onboard-logo">DomConnect</div>
          <div className="onboard-progress-bar">
            <div className="onboard-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="onboard-step-label">{step + 1} / {STEPS.length}</div>
        </div>

        {step === 0 && (
          <div className="onboard-body">
            <h2>Crea tu perfil</h2>
            <p className="onboard-desc">Solo visible para otras usuarias verificadas</p>
            <div className="photo-upload" onClick={() => document.getElementById("photo-input").click()}>
              {data.photo
                ? <img src={URL.createObjectURL(data.photo)} alt="foto" />
                : <div className="photo-placeholder"><span>+</span><small>Añadir foto</small></div>
              }
              <input id="photo-input" type="file" accept="image/*" hidden
                onChange={e => setData(d => ({ ...d, photo: e.target.files[0] }))} />
            </div>
            <input className="ob-input" placeholder="Nombre o alias" value={data.name}
              onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
            <input className="ob-input" placeholder="Edad" type="number" min="18" max="99"
              value={data.age} onChange={e => setData(d => ({ ...d, age: e.target.value }))} />
            <textarea className="ob-textarea" placeholder="Cuéntanos algo sobre ti... (opcional)"
              value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value }))} rows={3} />
          </div>
        )}

        {step === 1 && (
          <div className="onboard-body">
            <h2>Tu rol</h2>
            <p className="onboard-desc">¿Cómo te identificas en la dinámica?</p>
            <div className="role-grid">
              {ROLES.map(r => (
                <button key={r}
                  className={`role-btn ${data.role === r ? "active" : ""}`}
                  onClick={() => setData(d => ({ ...d, role: r }))}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboard-body">
            <h2>Intereses</h2>
            <p className="onboard-desc">Selecciona hasta 6 que te definan</p>
            <div className="interest-grid">
              {INTERESTS.map(i => (
                <button key={i}
                  className={`interest-btn ${data.interests.includes(i) ? "active" : ""}`}
                  onClick={() => toggleInterest(i)}>
                  {i}
                </button>
              ))}
            </div>
            <p className="onboard-counter">{data.interests.length}/6 seleccionados</p>
          </div>
        )}

        {step === 3 && (
          <div className="onboard-body">
            <h2>Tu ubicación</h2>
            <p className="onboard-desc">Para mostrarte perfiles cercanos</p>
            <div className="province-grid">
              {PROVINCES.map(p => (
                <button key={p}
                  className={`province-btn ${data.province === p ? "active" : ""}`}
                  onClick={() => setData(d => ({ ...d, province: p }))}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="onboard-footer">
          {step > 0 && <button className="btn-outline" onClick={back}>Atrás</button>}
          <button className="btn-primary" onClick={next}
            disabled={
              (step === 0 && (!data.name || !data.age)) ||
              (step === 1 && !data.role) ||
              (step === 3 && !data.province)
            }>
            {step === STEPS.length - 1 ? "Empezar" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
