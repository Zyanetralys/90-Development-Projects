// backend/server.js
// Backend de ejemplo con Express + Supabase
// npm install express @supabase/supabase-js cors dotenv bcryptjs jsonwebtoken

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "cambia-esto-en-produccion";

// Middleware de autenticación
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

// ─── AUTH ──────────────────────────────────────────────────────────────────

// POST /api/register
app.post("/api/register", async (req, res) => {
  const { email, password, name, age, role, province, bio, interests } = req.body;

  if (!email || !password || !name || !age)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  if (parseInt(age) < 18)
    return res.status(400).json({ error: "Debes ser mayor de 18 años" });

  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({ email, password_hash: hash, name, age, role, province, bio, interests, visible: true })
    .select("id, name, email")
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: data });
});

// POST /api/login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ─── PERFIL ────────────────────────────────────────────────────────────────

// GET /api/me
app.get("/api/me", auth, async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("id, name, age, bio, role, province, interests, photo_url, visible")
    .eq("id", req.user.id)
    .single();
  res.json(data);
});

// PUT /api/me
app.put("/api/me", auth, async (req, res) => {
  const { name, bio, role, province, interests, visible } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ name, bio, role, province, interests, visible })
    .eq("id", req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/me — eliminar cuenta (RGPD)
app.delete("/api/me", auth, async (req, res) => {
  await supabase.from("messages").delete().eq("sender_id", req.user.id);
  await supabase.from("likes").delete().or(`from_user_id.eq.${req.user.id},to_user_id.eq.${req.user.id}`);
  await supabase.from("users").delete().eq("id", req.user.id);
  res.json({ ok: true });
});

// ─── DESCUBRIR ─────────────────────────────────────────────────────────────

// GET /api/discover — perfiles para swipe
app.get("/api/discover", auth, async (req, res) => {
  // Excluir usuarios ya vistos (liked o pasados)
  const { data: seen } = await supabase
    .from("likes")
    .select("to_user_id")
    .eq("from_user_id", req.user.id);

  const seenIds = (seen || []).map(l => l.to_user_id);
  seenIds.push(req.user.id); // no mostrar el propio perfil

  const { data, error } = await supabase
    .from("users")
    .select("id, name, age, bio, role, province, interests, photo_url")
    .eq("visible", true)
    .not("id", "in", `(${seenIds.join(",")})`)
    .limit(20);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── LIKES / MATCHES ───────────────────────────────────────────────────────

// POST /api/like
app.post("/api/like", auth, async (req, res) => {
  const { to_user_id, super_like = false } = req.body;

  await supabase.from("likes").insert({
    from_user_id: req.user.id,
    to_user_id,
    super_like,
  });

  // Comprobar si es match mutuo
  const { data: mutual } = await supabase
    .from("likes")
    .select("id")
    .eq("from_user_id", to_user_id)
    .eq("to_user_id", req.user.id)
    .single();

  let match = null;
  if (mutual) {
    const { data } = await supabase
      .from("matches")
      .insert({ user1_id: req.user.id, user2_id: to_user_id })
      .select()
      .single();
    match = data;
  }

  res.json({ matched: !!mutual, match });
});

// POST /api/pass
app.post("/api/pass", auth, async (req, res) => {
  const { to_user_id } = req.body;
  await supabase.from("likes").insert({
    from_user_id: req.user.id,
    to_user_id,
    passed: true,
  });
  res.json({ ok: true });
});

// GET /api/matches
app.get("/api/matches", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      id, created_at,
      user1:user1_id(id, name, age, role, photo_url),
      user2:user2_id(id, name, age, role, photo_url)
    `)
    .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  // Normalizar para devolver siempre "other_user"
  const normalized = data.map(m => ({
    id: m.id,
    created_at: m.created_at,
    other_user: m.user1.id === req.user.id ? m.user2 : m.user1,
  }));

  res.json(normalized);
});

// ─── MENSAJES ──────────────────────────────────────────────────────────────

// GET /api/matches/:matchId/messages
app.get("/api/matches/:matchId/messages", auth, async (req, res) => {
  const { matchId } = req.params;

  // Verificar que el usuario pertenece al match
  const { data: match } = await supabase
    .from("matches")
    .select("user1_id, user2_id")
    .eq("id", matchId)
    .single();

  if (!match || (match.user1_id !== req.user.id && match.user2_id !== req.user.id))
    return res.status(403).json({ error: "Sin acceso" });

  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, text, created_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  res.json(data);
});

// POST /api/matches/:matchId/messages
app.post("/api/matches/:matchId/messages", auth, async (req, res) => {
  const { matchId } = req.params;
  const { text } = req.body;

  if (!text?.trim()) return res.status(400).json({ error: "Mensaje vacío" });

  const { data: match } = await supabase
    .from("matches")
    .select("user1_id, user2_id")
    .eq("id", matchId)
    .single();

  if (!match || (match.user1_id !== req.user.id && match.user2_id !== req.user.id))
    return res.status(403).json({ error: "Sin acceso" });

  const { data, error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: req.user.id, text: text.trim() })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─── INICIAR SERVIDOR ──────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API en http://localhost:${PORT}`));
