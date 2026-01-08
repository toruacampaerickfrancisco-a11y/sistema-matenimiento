$root='C:\Users\erick\Desktop\Sistema Mantenimiento ERP\archivos_removidos'
Get-ChildItem -Path $root -Force | ForEach-Object {
  if ($_.PSIsContainer) {
    $size=(Get-ChildItem -LiteralPath $_.FullName -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
  } else { $size=$_.Length }
  [PSCustomObject]@{ Name=$_.Name; SizeMB = if($size){[math]::Round($size/1MB,2)}else{0} }
} | Sort-Object SizeMB -Descending | Format-Table -AutoSize