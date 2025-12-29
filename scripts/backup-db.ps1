<#
Backup script for PostgreSQL (Windows PowerShell)
Creates a custom-format dump and exports globals (roles).

Usage:
  ./scripts/backup-db.ps1 -OutputPath "..\unnecessary_files\database_dump.dump"

If PGPASSWORD is not set, the script will prompt for the DB password.
#>

param(
    [string]$OutputPath = "unnecessary_files\database_dump.dump",
    [string]$RolesPath = "unnecessary_files\roles.sql",
    [string]$DbHost = "127.0.0.1",
    [int]$Port = 5432,
    [string]$User = "postgres",
    [string]$Database = "respaldo-sistema-mantenimiento"
)

Write-Host "Backup: DB=$Database -> $OutputPath"

# Ensure output folder exists
$outDir = Split-Path -Path $OutputPath -Parent
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

# Ask for password if not set in env
if (-not $env:PGPASSWORD) {
    $secure = Read-Host -AsSecureString "Postgres password for user $User"
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    $env:PGPASSWORD = $plain
}

# Try to locate pg_dump
$GetLatestPgUtility = {
    param($name)
    try {
        $items = Get-ChildItem 'C:\Program Files\PostgreSQL' -Recurse -Filter ("$name.exe") -ErrorAction SilentlyContinue
        if (-not $items) { return $name }

        $candidates = $items | ForEach-Object {
            $full = $_.FullName
            $segments = $full -split '\\'
            $verSeg = $segments | Where-Object { $_ -match '^\d+(\.\d+)*$' -or $_ -match 'postgresql-?x64-?\d+' } | Select-Object -First 1
            $ver = '0.0'
            if ($verSeg) {
                if ($verSeg -match '(\d+(?:\.\d+)*)') { $ver = $Matches[1] }
                elseif ($verSeg -match '\\d+') { $ver = $Matches[0] }
            }
            [PSCustomObject]@{ Path = $full; Version = $ver }
        }
        $best = $candidates | Sort-Object @{Expression = {[version]($_.Version)};Descending=$true} | Select-Object -First 1
        return $best.Path
    } catch { return $name }
}

$pgDump = & $GetLatestPgUtility 'pg_dump'
if (-not $pgDump) { $pgDump = 'pg_dump' }
Write-Host "Using pg_dump: $pgDump"

$dumpCmd = & $pgDump -U $User -h $DbHost -p $Port -Fc -f $OutputPath $Database
if ($LASTEXITCODE -ne 0) {
    Write-Host "pg_dump failed (exit $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Database dump created: $OutputPath"

# Export globals (roles)
$pgDumpAll = (Get-ChildItem 'C:\Program Files\PostgreSQL' -Recurse -Filter pg_dumpall.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
if (-not $pgDumpAll) { $pgDumpAll = 'pg_dumpall' }

Write-Host "Exporting roles/globals to: $RolesPath"
try {
    & $pgDumpAll -U $User --globals-only > $RolesPath
    Write-Host "Roles export created: $RolesPath"
} catch {
    Write-Host "pg_dumpall failed: $_" -ForegroundColor Yellow
}

Write-Host "Backup completed." -ForegroundColor Green
