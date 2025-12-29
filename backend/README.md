# Backend API - Sistema ERP Mantenimiento

Backend desarrollado con **Node.js**, **Koa.js**, **Sequelize** y **PostgreSQL** para el Sistema ERP de Mantenimiento de la Secretaría de Bienestar del Estado de Sonora.

## 🚀 Características

- **Framework**: Koa.js (más moderno y ligero que Express)
- **Base de datos**: PostgreSQL con Sequelize ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Joi para validación de datos
- **Seguridad**: Helmet, CORS, bcrypt para passwords
- **Logs**: Winston + Koa-logger
- **Compresión**: Gzip automático
- **Documentación**: API RESTful bien estructurada

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 12.0
- **npm** >= 8.0.0

## 🛠️ Instalación

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar PostgreSQL

Crear base de datos:
```sql
CREATE DATABASE mantenimiento_erp;
CREATE USER erp_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE mantenimiento_erp TO erp_user;
```

### 3. Configurar variables de entorno

Copiar archivo de ejemplo:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mantenimiento_erp
DB_USER=erp_user
DB_PASSWORD=tu_password_seguro

# JWT
JWT_SECRET=tu_secreto_super_seguro_para_produccion

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar migraciones y seeders

```bash
# Crear base de datos (opcional si ya existe)
npm run db:create

# Ejecutar migraciones para crear tablas
npm run migrate

# Poblar con datos iniciales
npm run seed

# O hacer todo de una vez
npm run db:setup
```

### 5. Iniciar servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📊 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuración general
│   │   └── database.js        # Configuración Sequelize
│   ├── models/
│   │   ├── User.js            # Modelo Usuario
│   │   ├── Equipment.js       # Modelo Equipo
│   │   ├── Ticket.js          # Modelo Ticket
│   │   ├── Permission.js      # Modelo Permiso
│   │   ├── UserPermission.js  # Modelo Usuario-Permiso
│   │   ├── TicketComment.js   # Modelo Comentario
│   │   └── index.js           # Índice de modelos
│   ├── controllers/
│   │   ├── authController.js  # Controlador autenticación
│   │   └── userController.js  # Controlador usuarios
│   ├── routes/
│   │   ├── auth.js           # Rutas autenticación
│   │   └── users.js          # Rutas usuarios
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   ├── seeders/
│   │   └── initialData.js    # Datos iniciales
│   └── app.js                # Servidor principal
├── package.json
├── .env.example
└── README.md
```

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación.

### Endpoints de autenticación:

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Uso del token:
```bash
# Incluir en header Authorization
Authorization: Bearer <tu_jwt_token>
```

## 👥 Sistema de Permisos

El sistema implementa permisos granulares por módulo y acción:

### Roles disponibles:
- **admin**: Acceso completo
- **tecnico**: Gestión de tickets y equipos
- **usuario**: Creación de tickets y consultas

### Módulos:
- `dashboard`, `users`, `equipment`, `tickets`, `reports`, `profile`, `permissions`

### Acciones:
- `view`, `create`, `edit`, `delete`, `export`, `assign`

## 📚 API Endpoints

### Autenticación (`/api/auth`)
```bash
POST   /api/auth/login           # Iniciar sesión
GET    /api/auth/verify          # Verificar token
POST   /api/auth/change-password # Cambiar contraseña
POST   /api/auth/refresh         # Renovar token
POST   /api/auth/logout          # Cerrar sesión
```

### Usuarios (`/api/users`)
```bash
GET    /api/users               # Listar usuarios (admin)
GET    /api/users/:id           # Obtener usuario por ID (admin)
POST   /api/users               # Crear usuario (admin)
PUT    /api/users/:id           # Actualizar usuario (admin)
DELETE /api/users/:id           # Eliminar usuario (admin)
GET    /api/users/profile       # Obtener perfil propio
PUT    /api/users/profile       # Actualizar perfil propio
```

## 🏃‍♂️ Comandos Disponibles

```bash
# Desarrollo
npm run dev                     # Iniciar con nodemon
npm start                      # Iniciar producción

# Base de datos
npm run db:create              # Crear base de datos
npm run db:drop                # Eliminar base de datos
npm run migrate                # Ejecutar migraciones
npm run migrate:undo           # Deshacer última migración
npm run migrate:undo:all       # Deshacer todas las migraciones
npm run seed                   # Poblar con datos iniciales
npm run seed:undo              # Deshacer seeders
npm run db:reset               # Resetear BD (deshacer + migrar + poblar)
npm run db:setup               # Setup completo (crear + migrar + poblar)
```

## 🔧 Configuración de Desarrollo

### Datos de prueba incluidos:

**Usuarios por defecto:**
- **Admin**: `admin` / `admin123`
- **Técnico**: `tecnico1` / `tecnico123`
- **Usuario**: `usuario1` / `usuario123`

### Health Check:
```bash
GET /health
# Respuesta: Estado del servidor
```

## 🚀 Despliegue a Producción

### 1. Variables de entorno de producción:
```env
NODE_ENV=production
PORT=3000
DB_HOST=tu_host_postgres
DB_PASSWORD=password_super_seguro
JWT_SECRET=secreto_ultra_seguro_256_bits
```

### 2. Comandos de despliegue:
```bash
# Instalar dependencias de producción
npm ci --only=production

# Iniciar servidor
npm start
```

## 🛡️ Seguridad Implementada

- ✅ **Helmet**: Headers de seguridad
- ✅ **CORS**: Configuración de dominios permitidos
- ✅ **bcrypt**: Hash de contraseñas
- ✅ **JWT**: Tokens seguros
- ✅ **Validación**: Joi para entrada de datos
- ✅ **Rate limiting**: Control de peticiones
- ✅ **Sanitización**: Prevención de inyección

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL:
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U erp_user -d mantenimiento_erp
```

### Error de permisos JWT:
```bash
# Verificar que JWT_SECRET esté configurado
echo $JWT_SECRET
```

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades:
- **Email**: soporte@bienestar.sonora.gob.mx
- **Documentación**: `/api/docs`
- **Health Check**: `/health`

## 📄 Licencia

© 2025 Secretaría de Bienestar del Estado de Sonora. Todos los derechos reservados.