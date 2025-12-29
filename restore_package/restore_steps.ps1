# Script de restauración (plantilla)
# Ejecutar desde PowerShell con privilegios apropiados.

# 1) Extraer ZIP (si existe)
# Expand-Archive -Path "..\Sistema Mantenimiento ERP.zip" -DestinationPath ".\extracted" -Force

# 2) Variables (ajusta según tu instalación)
$pgUser = 'postgres'
$pgHost = 'localhost'
$pgPort = 5432
$pgPassword = 'Erick1093'   # Cambia si corresponde
$dumpPath = "C:\Users\Dell Inspirion 3505\Desktop\Sistema Mantenimiento ERP\database_dump.dump"
$rolesPath = "C:\Users\Dell Inspirion 3505\Desktop\Sistema Mantenimiento ERP\roles.sql"

# 3) Volcar base de datos (en origen) — DESCOMENTA para ejecutar
# $env:PGPASSWORD = $pgPassword
# & "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U $pgUser -h $pgHost -p $pgPort -Fc -f $dumpPath respaldo-sistema-mantenimiento
# & "C:\Program Files\PostgreSQL\18\bin\pg_dumpall.exe" -U $pgUser --globals-only > $rolesPath

# 4) Restaurar roles y base de datos (en destino) — DESCOMENTA para ejecutar
# $env:PGPASSWORD = $pgPassword
# & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U $pgUser -f $rolesPath
# & "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U $pgUser -h $pgHost -p $pgPort respaldo-sistema-mantenimiento
# & "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" -U $pgUser -h $pgHost -p $pgPort -d respaldo-sistema-mantenimiento -v $dumpPath

# 5) Backend: instalar dependencias y levantar
# cd ..\backend
# npm install
# copy o crear .env basado en backend/config/config.json
# npm run start

# 6) Frontend: instalar, compilar y desplegar
# cd ..\frontend
# npm install
# npm run build
# Copy-Item -Path .\dist\* -Destination ..\backend\public -Recurse -Force

Write-Host "restore_steps.ps1: plantilla creada. Edita las variables y descomenta las acciones que deseas ejecutar."