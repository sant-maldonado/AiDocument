# 🤖 AI Document Chat

Aplicación fullstack para chatear con tus documentos PDF usando IA. Subís un PDF, hacés preguntas en lenguaje natural y recibís respuestas en tiempo real con efecto de escritura.

## 🚀 Demo en vivo
[(https://ai-document-flax.vercel.app/)]

**Usuario de prueba:**
Email: demo@demo.com
Password: demo1234

Email: demo@test.com    
Password: demo123

Email: user1@test.com    
Password: user1123

Email: user2@test.com    
Password: user2123
---

## ✨ Funcionalidades
- Subida y procesamiento de archivos PDF
- Chat con IA con respuestas en streaming (efecto letra a letra)
- Historial de conversaciones por documento
- Múltiples documentos por usuario
- Sidebar con toggle para maximizar el área de chat
- Manejo de errores en mid-stream

---

## 🛠 Stack

**Frontend:** React 18, React Router v6, Tailwind CSS, EventSource API
**Backend:** Node.js, Express, JWT, Multer, pdf-parse
**IA:** Groq API (llama-3.3-70b-versatile) 
**Base de datos:** MongoDB con Mongoose
**Deploy:** Vercel (frontend - backend)  + MongoDB Atlas

---

## ⚙️ Correr localmente

```bash
git clone https://github.com/sant-maldonado/AiDocument.git

cd server && npm install && cp .env.example .env && npm run dev
cd client && npm install && npm run dev
```

---

## 📄 Variables de entorno

**Backend (.env)**
```
MONGODB_URI=
GROQ_API_KEY=
JWT_SECRET=
PORT=3001
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
```

---

## 📸 Capturas
<img width="1363" height="632" alt="Im1" src="https://github.com/user-attachments/assets/8889c4c5-89c7-4333-a0ba-b813047ccab5" />
<img width="1348" height="628" alt="Im2" src="https://github.com/user-attachments/assets/a3d8de76-1fff-4e2e-a3d6-92f78f904090" />
<img width="1362" height="623" alt="Im3" src="https://github.com/user-attachments/assets/0f3a8ddc-8a5d-4dff-8248-cc670c05e0fa" />


