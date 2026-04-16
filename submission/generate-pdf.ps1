$ErrorActionPreference = "Stop"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$htmlPath = Join-Path $PSScriptRoot "CareAxis_Report.html"
$pdfPath = Join-Path $PSScriptRoot "CareAxis_Clinic_Appointment_System_Report.pdf"

if (-not (Test-Path $edgePath)) {
  throw "Microsoft Edge was not found at: $edgePath"
}

if (-not (Test-Path $htmlPath)) {
  throw "Report HTML was not found at: $htmlPath"
}

$htmlUri = [System.Uri]::new($htmlPath).AbsoluteUri

& $edgePath `
  --headless `
  --disable-gpu `
  --print-to-pdf="$pdfPath" `
  --print-to-pdf-no-header `
  $htmlUri | Out-Null

if (-not (Test-Path $pdfPath)) {
  throw "PDF generation failed."
}

Write-Output "PDF created: $pdfPath"
