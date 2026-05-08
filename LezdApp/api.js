// src/api.js
// Funciones para conectar el frontend con el backend real

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const headers = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token")
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : {}),
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error del servidor");
  return data;
};

// ─── Auth ────────────────────────────────────────────────────
export const register = (payload) => req("POST", "/api/register", payload);
export const login = (email, password) =>
  req("POST", "/api/login", { email, password });

// ─── Perfil ──────────────────────────────────────────────────
export const getMe = () => req("GET", "/api/me");
export const updateMe = (payload) => req("PUT", "/api/me", payload);
export const deleteMe = () => req("DELETE", "/api/me");

// ─── Descubrir ───────────────────────────────────────────────
export const discover = () => req("GET", "/api/discover");

// ─── Likes ───────────────────────────────────────────────────
export const like = (to_user_id, super_like = false) =>
  req("POST", "/api/like", { to_user_id, super_like });
export const pass = (to_user_id) =>
  req("POST", "/api/pass", { to_user_id });

// ─── Matches ─────────────────────────────────────────────────
export const getMatches = () => req("GET", "/api/matches");

// ─── Mensajes ────────────────────────────────────────────────
export const getMessages = (matchId) =>
  req("GET", `/api/matches/${matchId}/messages`);
export const sendMessage = (matchId, text) =>
  req("POST", `/api/matches/${matchId}/messages`, { text });
