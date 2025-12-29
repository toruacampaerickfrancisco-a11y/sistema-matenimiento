# Configuración de Base de Datos PostgreSQL
# Sistema ERP - Mantenimiento de Equipos

## Configuración de Conexión

```
Host: localhost
Puerto: 5432
Base de Datos: mantenimiento_erp
Usuario: erp_user
Contraseña: erp_password_2025
```

## Variables de Entorno (.env)

```
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mantenimiento_erp
DB_USER=erp_user
DB_PASSWORD=erp_password_2025

# Aplicación
PORT=30001
HOST=0.0.0.0
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2025
JWT_EXPIRE=7d

# Archivos
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Configuración corporativa
COMPANY_NAME="Secretaría de Bienestar"
COMPANY_FULL_NAME="Secretaría de Bienestar del Estado de Sonora"
```

## Instalación y Configuración

### 1. Instalar PostgreSQL
```bash
# Windows - Descargar desde https://www.postgresql.org/download/windows/
# O usar chocolatey:
choco install postgresql

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

### 2. Crear usuario y base de datos
```sql
-- Conectar como usuario postgres
sudo -u postgres psql

-- Crear usuario
CREATE USER erp_user WITH PASSWORD 'erp_password_2025';

-- Crear base de datos
CREATE DATABASE mantenimiento_erp OWNER erp_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE mantenimiento_erp TO erp_user;

-- Conectar a la nueva base de datos
\c mantenimiento_erp

-- Dar permisos de esquema
GRANT ALL ON SCHEMA public TO erp_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO erp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO erp_user;

-- Salir
\q
```

### 3. Ejecutar el esquema
```bash
# Desde el directorio del proyecto
psql -h localhost -U erp_user -d mantenimiento_erp -f database/schema.sql
```

## Usuarios Predeterminados

Después de ejecutar el esquema, estarán disponibles estos usuarios:

| Usuario | Contraseña | Rol | Departamento |
|---------|------------|-----|--------------|
| admin | admin123 | admin | Sistemas |
| tecnico1 | tecnico123 | tecnico | Soporte Técnico |
| usuario1 | usuario123 | usuario | Recursos Humanos |

⚠️ **IMPORTANTE**: Cambiar estas contraseñas en producción.

## Estructura de Tablas

### Principales:
- `users` - Usuarios del sistema
- `equipment` - Catálogo de equipos
- `tickets` - Tickets de soporte
- `notifications` - Notificaciones en tiempo real
- `equipment_maintenance` - Historial de mantenimientos
- `ticket_history` - Historial de cambios

### Características especiales:
- **UUID** como llaves primarias
- **Triggers** para numeración automática de tickets
- **Funciones** para notificaciones automáticas
- **Índices** optimizados para consultas frecuentes
- **Vistas** para reportes complejos

## Backup y Restauración

### Crear backup:
```bash
pg_dump -h localhost -U erp_user mantenimiento_erp > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup:
```bash
psql -h localhost -U erp_user mantenimiento_erp < backup_archivo.sql
```

## Monitoreo y Mantenimiento

### Consultas útiles:
```sql
-- Estadísticas generales
SELECT 
  (SELECT COUNT(*) FROM users WHERE is_active = true) as usuarios_activos,
  (SELECT COUNT(*) FROM equipment WHERE status = 'operativo') as equipos_operativos,
  (SELECT COUNT(*) FROM tickets WHERE status != 'cerrado') as tickets_abiertos;

-- Tickets por estado
SELECT status, COUNT(*) as cantidad
FROM tickets
GROUP BY status
ORDER BY cantidad DESC;

-- Equipos por departamento
SELECT department, COUNT(*) as cantidad
FROM equipment
GROUP BY department
ORDER BY cantidad DESC;
```