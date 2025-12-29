@echo off
REM Script para arrancar el backend del sistema ERP
cd /d "%~dp0backend"
echo "Ejecutando migraciones de la base de datos..."
call npm run migrate
IF ERRORLEVEL 1 (
    echo "Error al ejecutar las migraciones. El servidor no se iniciara."
    pause
    exit /b 1
)
echo "Migraciones completadas exitosamente."
call npm run dev
pause
