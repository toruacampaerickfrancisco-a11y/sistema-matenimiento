Carpeta de restauración — Sistema Mantenimiento ERP

Contenido objetivo:
- README.md, README_DEPLOY.md
- ARRANCAR_SISTEMA.bat, iniciar-backend.bat, iniciar-frontend.bat
- importar-todo.bat, permitir-acceso-externo.ps1
- backend/ (scripts de import, seeders, truncate, src/)
- frontend/ (src/, public/, package.json)
- nuevo-sistema-movil/
- users.csv, tickets.csv
- Sistema Mantenimiento ERP.zip (copia/extraer aquí si procede)

Objetivo:
Proveer una carpeta con los documentos y scripts necesarios para volver a levantar el sistema en otra máquina o tras una recuperación.

Pasos rápidos para restaurar (resumido):
1) Extraer el ZIP si procede:
   Expand-Archive -Path "..\\Sistema Mantenimiento ERP.zip" -DestinationPath ".\\extracted" -Force

2) Preparar PostgreSQL (local):
   - Ejecutar PowerShell como Administrador si necesita reiniciar servicios o editar `pg_hba.conf`.
   - Crear usuario/contraseña si es necesario.

3) Volcar la base de datos (en origen) — ejemplo (requiere `pg_dump`):
   $env:PGPASSWORD = 'Erick1093'
   "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -U postgres -h localhost -p 5432 -Fc -f "C:\\Users\\Dell Inspirion 3505\\Desktop\\Sistema Mantenimiento ERP\\database_dump.dump" respaldo-sistema-mantenimiento
   "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dumpall.exe" -U postgres --globals-only > "C:\\Users\\Dell Inspirion 3505\\Desktop\\Sistema Mantenimiento ERP\\roles.sql"

4) Copiar `database_dump.dump` y `roles.sql` al equipo destino (SCP/compartido/USB).

5) Restaurar en destino:
   - Restaurar roles: psql -U postgres -f roles.sql
   - Crear DB si falta: createdb -U postgres respaldo-sistema-mantenimiento
   - Restaurar datos: pg_restore -U postgres -d respaldo-sistema-mantenimiento -Fc -v "database_dump.dump"

6) Backend & Frontend:
   - Backend: entrar a `backend`, crear `.env` según `backend/config/config.json`, `npm install`, `npm run start`.
   - Frontend: entrar a `frontend`, `npm install`, `npm run build`, copiar `dist` a `backend/public` o usar `iniciar-frontend.bat`.

Nota: Los comandos de ejemplo usan PostgreSQL instalado en `C:\\Program Files\\PostgreSQL\\18`. Ajusta la ruta y la contraseña según tu sistema.

Si quieres, puedo ejecutar el volcado DB ahora (necesito confirmación).