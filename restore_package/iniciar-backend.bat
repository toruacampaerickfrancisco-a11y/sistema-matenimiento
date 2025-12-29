@echo off
REM Script para arrancar el backend del sistema ERP
cd /d "%~dp0backend"
call npm start
pause
