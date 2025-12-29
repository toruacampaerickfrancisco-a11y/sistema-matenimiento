# Este script abre los puertos 3000 (Backend) y 30001 (Frontend) en el Firewall de Windows
# Debe ejecutarse como Administrador

$ports = @(3000, 30001)
$ruleName = "ERP Sistema Mantenimiento"

Write-Host "Intentando abrir puertos para acceso remoto..." -ForegroundColor Cyan

try {
    # Verificar si ya existen reglas y eliminarlas para evitar duplicados
    Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

    # Crear nueva regla
    New-NetFirewallRule -DisplayName $ruleName `
                        -Direction Inbound `
                        -LocalPort $ports `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any

    Write-Host "✅ Puertos 3000 y 30001 abiertos correctamente." -ForegroundColor Green
    Write-Host "Ahora otros equipos pueden acceder a: http://$((Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike '*Loopback*' -and $_.InterfaceAlias -notlike '*vEthernet*'}).IPAddress):30001" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Error: No se pudieron abrir los puertos." -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script como ADMINISTRADOR." -ForegroundColor Red
    Write-Host "Detalles: $_" -ForegroundColor Gray
}

Pause
