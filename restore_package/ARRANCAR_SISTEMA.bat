@echo off
REM Script de arranque configurado con rutas absolutas

start "Frontend" cmd /k "cd /d "C:\Users\Dell Inspirion 3505\Desktop\Sistema Mantenimiento ERP" && call iniciar-frontend.bat"
start "Backend" cmd /k "cd /d "C:\Users\Dell Inspirion 3505\Desktop\Sistema Mantenimiento ERP" && call iniciar-backend.bat"
