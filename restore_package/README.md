# Sistema ERP - Mantenimiento de Equipos de Cómputo

## 🏛️ Secretaría de Bienestar del Estado de Sonora

Sistema completo de gestión para el mantenimiento de equipos de cómputo que permite gestionar tickets de soporte técnico, equipos, usuarios y generar reportes automáticos.

---

## 🚀 Características Principales

### ✨ **Sistema de Roles y Usuarios**
- **👑 Administrador**: Control total del sistema, gestión de usuarios, equipos y reportes
- **🔧 Técnico**: Atención de tickets, diagnósticos, reparaciones y reportes técnicos  
- **👤 Usuario Final**: Creación de reportes y consulta de tickets

### 🎫 **Gestión Completa de Tickets**
- Numeración automática con formato: **SBDI/0001/2025**
- Estados: 🆕 Nuevo → 🔄 En Proceso → ✅ Cerrado
- Sistema de prioridades y asignación automática
- Historial completo de cambios

### 🔔 **Notificaciones Inteligentes**
- Notificaciones en tiempo real con sonidos
- Click inteligente que abre directamente el ticket
- Navegación automática según rol del usuario
- Contador de notificaciones no leídas

### 💻 **Gestión de Equipos**
- Catálogo completo con especificaciones técnicas
- Estados: Operativo, En reparación, Fuera de servicio
- Historial de mantenimientos y asignación a usuarios
- Control de ubicación física y activos fijos

### 📊 **Reportes Automáticos**
- Generación de documentos Word (.docx) profesionales
- Plantillas con datos dinámicos del sistema
- Información detallada de técnicos y procedimientos
- Exportación inmediata con un solo clic

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** con TypeScript
- **Vite** como bundler y dev server
- **CSS Modules** para estilos modulares
- **React Router DOM** para navegación
- **Lucide React** para iconografía

### **Backend** (Preparado para)
- **Node.js** con Express
- **PostgreSQL** como base de datos
- **Socket.IO** para notificaciones en tiempo real
- **JWT** para autenticación

### **Herramientas**
- **docx** para generación de documentos Word
- **date-fns** para manejo de fechas
- **axios** para peticiones HTTP

---

## 📋 Instalación y Configuración

### **Prerrequisitos**
- Node.js 16 o superior
- npm o yarn
- PostgreSQL (opcional para desarrollo)

### **1. Clonar e Instalar**
```bash
# Ya tienes el proyecto, solo instalar dependencias
npm install
```

### **2. Configurar Variables de Entorno**
El archivo `.env` ya está configurado con valores por defecto:
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_COMPANY_NAME="Secretaría de Bienestar"
```

### **3. Iniciar Desarrollo**
```bash
# Servidor de desarrollo en puerto 30001
npm run dev
```

### **4. Acceder al Sistema**
- **Local**: http://localhost:30001
- **Red Local**: http://192.168.0.57:30001

---

## 👥 Credenciales de Acceso

### **Modo Desarrollo**
El sistema incluye usuarios de prueba:

| Usuario | Contraseña | Rol | Departamento |
|---------|------------|-----|--------------|
| `admin` | `admin123` | Administrador | Sistemas |
| `tecnico1` | `tecnico123` | Técnico | Soporte Técnico |
| `usuario1` | `usuario123` | Usuario | Recursos Humanos |

---

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout.tsx       # Layout principal con sidebar
│   ├── Sidebar.tsx      # Navegación lateral
│   ├── Header.tsx       # Cabecera del sistema
│   └── *.module.css     # Estilos CSS Modules
├── pages/               # Páginas principales
│   ├── Login.tsx        # Página de inicio de sesión
│   ├── Dashboard.tsx    # Panel principal
│   ├── Users.tsx        # Gestión de usuarios
│   ├── Equipment.tsx    # Gestión de equipos
│   ├── Tickets.tsx      # Gestión de tickets
│   └── Reports.tsx      # Reportes y documentos
├── hooks/               # Custom hooks
│   ├── useAuth.tsx      # Hook de autenticación
│   └── useNotifications.ts # Hook de notificaciones
├── services/            # Servicios de API
│   ├── apiClient.ts     # Cliente HTTP configurado
│   ├── authService.ts   # Servicio de autenticación
│   └── mockAuth.ts      # Mock para desarrollo
├── types/               # Definiciones de TypeScript
│   └── index.ts         # Tipos principales
├── styles/              # Estilos globales
│   └── global.css       # Variables CSS y estilos base
└── utils/               # Utilidades
```

---

## 🎨 Diseño y UI/UX

### **Esquema de Colores Corporativo**
- **Primario**: Rosa/Fucsia profesional (#e91e63)
- **Secundario**: Púrpura (#9c27b0)
- **Estados**: Verde, Amarillo, Rojo para diferentes estados
- **Neutros**: Escala de grises para texto y fondos

### **Características de Diseño**
- ✨ Interfaz moderna y responsive
- 🎯 Navegación intuitiva con sidebar colapsable
- 📱 Adaptable a dispositivos móviles
- 🔔 Sistema visual de notificaciones
- 🎨 Animaciones suaves y profesionales

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 30001)

# Producción  
npm run build        # Construcción para producción
npm run preview      # Vista previa de la build

# Calidad de código
npm run lint         # Análisis de código con ESLint
```

---

## 📊 Base de Datos

### **Configuración PostgreSQL**
Ver archivo: `database/README.md` para instrucciones completas

### **Tablas Principales**
- `users` - Usuarios del sistema
- `equipment` - Catálogo de equipos
- `tickets` - Tickets de soporte
- `notifications` - Notificaciones en tiempo real
- `equipment_maintenance` - Historial de mantenimientos

---

## 🚀 Funcionalidades Implementadas

### ✅ **Completado**
- [x] Estructura base del proyecto React + TypeScript
- [x] Sistema de autenticación con roles
- [x] Diseño responsive con CSS Modules
- [x] Sidebar de navegación inteligente
- [x] Dashboard con estadísticas en tiempo real
- [x] Sistema de notificaciones (base)
- [x] Protección de rutas por roles
- [x] Mock de autenticación para desarrollo

### 🔄 **En Desarrollo**
- [ ] CRUD completo de usuarios
- [ ] Gestión completa de equipos
- [ ] Sistema completo de tickets
- [ ] Notificaciones en tiempo real con Socket.IO
- [ ] Generación de reportes Word
- [ ] Backend con Node.js + PostgreSQL

---

## 🌐 Acceso de Red

El sistema está configurado para ser accesible en la red local:

### **Configuración de Red**
```bash
# El servidor escucha en todas las interfaces
Host: 0.0.0.0
Puerto: 30001

# Acceso desde otros dispositivos
http://[IP-DE-TU-COMPUTADORA]:30001
```

### **Encontrar tu IP**
```bash
# Windows
ipconfig

# macOS/Linux  
ifconfig
```

---

## 🎯 Próximos Pasos

### **Backend API**
1. Servidor Node.js con Express
2. Conexión a PostgreSQL
3. API REST completa
4. Autenticación JWT
5. WebSockets para notificaciones

### **Funcionalidades Avanzadas**
1. Sistema completo de tickets
2. Generación automática de reportes Word
3. Dashboard con gráficos en tiempo real
4. Sistema de archivos adjuntos
5. Notificaciones push

---

## 🆘 Soporte y Ayuda

### **Comandos Útiles**
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ver puertos en uso
netstat -an | find "30001"
```

### **Problemas Comunes**
1. **Puerto ocupado**: Cambiar puerto en `vite.config.ts`
2. **Errores de TypeScript**: Verificar `tsconfig.json`
3. **Estilos no cargan**: Revisar imports de CSS Modules

---

## 📝 Información Adicional

### **Organización**
- **Cliente**: Secretaría de Bienestar del Estado de Sonora
- **Proyecto**: Sistema ERP - Mantenimiento de Equipos de Cómputo
- **Versión**: 1.0.0
- **Fecha**: Noviembre 2025

### **Contacto**
Para soporte técnico o consultas sobre el sistema, contactar al administrador del proyecto.

---

**¡El Sistema ERP está listo para desarrollo y uso! 🎉**