$root = "C:\Users\erick\Desktop\Sistema Mantenimiento ERP"
$dst = Join-Path $root 'archivos_removidos'
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst | Out-Null }
$paths = @(
  "unnecessary_files",
  "node_modules",
  "frontend\node_modules",
  "frontend\dist",
  "frontend\unnecessary_files",
  "backend\node_modules"
)

foreach ($p in $paths) {
  $full = Join-Path $root $p
  if (Test-Path $full) {
    try {
      Move-Item -LiteralPath $full -Destination $dst -Force
      Write-Output "Moved: $p"
    } catch {
      Write-Output "Failed to move: $p -> $_"
    }
  } else {
    Write-Output "Not found: $p"
  }
}