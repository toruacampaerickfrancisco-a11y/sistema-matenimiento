@echo off
echo ====================================
echo Configurando permisos del administrador
echo ====================================
echo.

cd /d "%~dp0backend"

echo [1/2] Cargando permisos basicos en la base de datos...
node src/scripts/cargar-permisos-basicos.js
if %errorlevel% neq 0 (
    echo Error al cargar permisos basicos
    pause
    exit /b 1
)

echo.
echo [2/2] Asignando permisos al usuario admin...
node src/scripts/asignar-permisos-admin.js
if %errorlevel% neq 0 (
    echo Error al asignar permisos al admin
    pause
    exit /b 1
)

echo.
echo ====================================
echo Configuracion completada exitosamente
echo El usuario admin tiene todos los permisos
echo ====================================
pause
