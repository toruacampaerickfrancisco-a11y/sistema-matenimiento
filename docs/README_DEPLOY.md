# Guía de despliegue y mantenimiento ERP

## 1. Variables de entorno (archivos `.env`)

- **Frontend (`.env` en raíz):**
  ```
  VITE_API_URL=http://192.168.1.189:30001/api
  ```
- **Backend (`backend/.env`):**
  ```
  PORT=30001
  HOST=0.0.0.0
  CORS_ORIGIN=http://192.168.1.189:30001
  ```

## 2. Build y despliegue del frontend

- Cada vez que cambies el frontend, ejecuta:
  ```powershell
  npm run build
  ```
- Copia el contenido de la carpeta `dist` a `backend/public`:
  ```powershell
  xcopy /E /I /Y dist "backend\public"
  ```

## 3. Servir todo desde el backend

- El backend debe tener este middleware en `src/app.js`:
  ```js
  import serve from 'koa-static';
  import path from 'path';
  // ...existing code...
  app.use(serve(path.resolve(process.cwd(), 'public')));
  // ...existing code...
  ```
- Solo debes arrancar el backend:
  ```powershell
  start iniciar-backend.bat
  ```
- Accede SIEMPRE desde:  
  http://192.168.1.189:30001

## 4. No arrancar el frontend por separado

- El frontend ya está servido por el backend. No uses `npm run dev` ni `start iniciar-frontend.bat` en producción.

## 5. Cambios de red/IP

- Si cambia la IP del servidor, actualiza las variables en ambos `.env` y repite el build/copia.

---

**Sigue estos pasos y tu sistema funcionará siempre de forma robusta y sin errores de configuración.**
