# PowerShell script para convertir docs/USER_MANUAL.md a PDF
# Requiere: pandoc instalado y un motor PDF (wkhtmltopdf or default LaTeX/pandoc PDF toolchain).
# Alternativa: usar Node.js + markdown-pdf (`npx markdown-pdf docs/USER_MANUAL.md -o docs/USER_MANUAL.pdf`)

$md = "docs\USER_MANUAL.md"
$pdf = "docs\USER_MANUAL.pdf"

if (Test-Path $md -PathType Leaf) {
  Write-Host "Convirtiendo $md -> $pdf"
  # Preferir pandoc si está instalado
  $pandoc = Get-Command pandoc -ErrorAction SilentlyContinue
  if ($pandoc) {
    # Intentar conversión con pandoc
    & pandoc $md -o $pdf --pdf-engine=wkhtmltopdf 2>&1 | Write-Host
    if (Test-Path $pdf) { Write-Host "PDF generado: $pdf"; exit 0 } else { Write-Host "Pandoc no generó PDF. Revise dependencias."; exit 2 }
  } else {
    Write-Host "Pandoc no encontrado. Intentando npx markdown-pdf (requiere Node.js)"
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
      # markdown-pdf puede no estar instalado; npx lo ejecutará temporalmente
      Write-Host "Ejecutando: npx markdown-pdf $md -o $pdf"
      & npx markdown-pdf $md -o $pdf
      if (Test-Path $pdf) { Write-Host "PDF generado: $pdf"; exit 0 } else { Write-Host "No se pudo generar PDF con npx markdown-pdf."; exit 3 }
    } else {
      Write-Host "Node.js no encontrado. Instale pandoc o Node.js para generar PDF."; exit 4
    }
  }
} else {
  Write-Host "No se encontró $md"; exit 1
}
