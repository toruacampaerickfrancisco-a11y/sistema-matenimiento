<#
Restore script for PostgreSQL (Windows PowerShell)
Restores roles (if provided) and a custom-format dump created with pg_dump -Fc

Usage:
  ./scripts/restore-db.ps1 -DumpPath "..\unnecessary_files\database_dump.dump"

If PGPASSWORD is not set, the script will prompt for the DB password.
#>

param(
    [string]$DumpPath = "unnecessary_files\database_dump.dump",
    [string]$RolesPath = "unnecessary_files\roles.sql",
    [string]$DbHost = "127.0.0.1",
    [int]$Port = 5432,
    [string]$User = "postgres"
)

if (-not (Test-Path $DumpPath)) {
    Write-Host "Dump file not found: $DumpPath" -ForegroundColor Red
    exit 1
}

# Ask for password if not set in env
if (-not $env:PGPASSWORD) {
    $secure = Read-Host -AsSecureString "Postgres password for user $User"
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    $env:PGPASSWORD = $plain
}

# helper to pick latest installed postgres utility
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

# Restore roles if provided
if (Test-Path $RolesPath) {
    $psql = & $GetLatestPgUtility 'psql'
    if (-not $psql) { $psql = 'psql' }
    Write-Host "Restoring roles from $RolesPath using $psql"
    & $psql -U $User -h $DbHost -f $RolesPath
}

# Locate pg_restore
$pgRestore = & $GetLatestPgUtility 'pg_restore'
if (-not $pgRestore) { $pgRestore = 'pg_restore' }

Write-Host "Restoring dump: $DumpPath (this may create the database if dump contains CREATE DATABASE)"
& $pgRestore -U $User -h $DbHost -p $Port -C -d postgres -v $DumpPath
if ($LASTEXITCODE -ne 0) {
    Write-Host "pg_restore failed (exit $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Restore completed." -ForegroundColor Green
