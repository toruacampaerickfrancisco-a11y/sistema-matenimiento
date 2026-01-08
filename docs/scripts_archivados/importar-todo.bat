@echo off
REM Script para automatizar la limpieza e importación de usuarios y equipos
cd /d "%~dp0backend"

REM 1. Filtrar usuarios válidos
echo Filtrando usuarios válidos...
call npm install csv-writer >nul 2>&1
node src/scripts/filtrar-usuarios-validos.js

REM 2. Importar usuarios
if exist src\csv\users_valid.csv (
  echo Importando usuarios...
  node src/scripts/importar-usuarios-csv.js
) else (
  echo No se encontró users_valid.csv. No se importaron usuarios.
)

REM 3. Importar equipos
echo Importando equipos...
node src/scripts/importar-equipos-csv.js

echo Proceso de importación finalizado.
pause
