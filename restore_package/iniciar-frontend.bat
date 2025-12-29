@echo off
REM Script para arrancar el frontend del sistema ERP
cd /d "%~dp0frontend"
call npm run dev
pause
