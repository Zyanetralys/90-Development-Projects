# DomConnect 🖤

App de citas para mujeres en la comunidad LesDOM en España.

---

## 🚀 Instalación y uso

### Requisitos
- Node.js 18+
- npm o yarn

### Instalar dependencias
```bash
cd lesdom-app
npm install
```

### Ejecutar en desarrollo
```bash
npm run dev
```
Abre http://localhost:5173 en tu navegador.

### Compilar para producción
```bash
npm run build
```

---

## 📁 Estructura del proyecto

```
src/
├── App.jsx                    # Raíz de la app (control de pantallas)
├── App.css                    # Variables globales y estilos base
├── main.jsx                   # Entry point de React
└── components/
    ├── AgeVerification.jsx    # Pantalla +18 / RGPD
    ├── AgeVerification.css
    ├── Onboarding.jsx         # Creación de perfil (4 pasos)
    ├── Onboarding.css
    ├── MainApp.jsx            # Layout principal + navegación
    ├── MainApp.css
    ├── SwipeView.jsx          # Vista de swipe (descubrir)
    ├── SwipeView.css
    ├── MatchesView.jsx        # Lista de matches y mensajes
    ├── MatchesView.css
    ├── ChatView.jsx           # Conversación individual
    ├── ChatView.css
    ├── ProfileView.jsx        # Perfil propio + privacidad
    └── ProfileView.css
```

---

## ✅ Funcionalidades incluidas

- **Verificación de edad** (+18) con checkboxes de consentimiento RGPD
- **Onboarding** en 4 pasos: foto, nombre/bio, rol D/s, intereses, provincia
- **Swipe** de perfiles con animación de like/pass y popup de match
- **Matches y mensajes** con lista de conversaciones
- **Chat** con respuesta simulada
- **Perfil** editable con toggle de visibilidad
- **Privacidad**: enlaces a RGPD, eliminar cuenta, exportar datos

---

## 🔧 Para producción (pasos siguientes)

### Backend necesario
Necesitarás un servidor real. Opciones recomendadas:
- **Supabase** (PostgreSQL + Auth + Storage) — gratuito para empezar
- **Firebase** — alternativa fácil
- **Railway + Express + Prisma** — más control

### Tablas de base de datos sugeridas
```sql
users (id, email, name, age, bio, role, province, interests[], photo_url, visible, created_at)
likes (id, from_user_id, to_user_id, super_like, created_at)
matches (id, user1_id, user2_id, created_at)
messages (id, match_id, sender_id, text, created_at)
```

### Autenticación
- Email + contraseña con verificación
- Considerar verificación de edad por DNI o similar para cumplir RGPD

### Deploy gratuito
- Frontend: **Vercel** (`vercel deploy`)
- Backend: **Railway** o **Render**

---

## ⚖️ Cumplimiento legal en España

- ✅ Consentimiento explícito +18 en el acceso
- ✅ Checkboxes separados para Términos y RGPD
- ✅ Opción de eliminar cuenta y exportar datos
- ⚠️ En producción: añadir Política de Privacidad y Aviso Legal reales
- ⚠️ Registrar la app como responsable de tratamiento de datos ante la AEPD
- ⚠️ Implementar cifrado de mensajes (end-to-end recomendado)

---

## 🎨 Personalización

Las variables de color están en `App.css`:
```css
--accent: #c4185c;       /* Color principal */
--accent2: #7b1fa2;      /* Gradiente secundario */
--gold: #c9a84c;         /* Detalles dorados */
--bg: #0a0608;           /* Fondo */
```
