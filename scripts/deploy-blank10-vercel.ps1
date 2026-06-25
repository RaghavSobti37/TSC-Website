# Deploy blank-10 Next.js app to harshad-duhita-tsc Vercel project
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Import Wix assets..."
npm run import-wix

Write-Host "Build..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Link to harshad-duhita-tsc if .vercel missing
if (-not (Test-Path ".vercel\project.json")) {
  $src = "..\..\..\Harshaduhita_TSC_HTML (1)\Harshad Duhita _ TSC_files\.vercel\project.json"
  if (Test-Path $src) {
    New-Item -ItemType Directory -Force -Path ".vercel" | Out-Null
    Copy-Item $src ".vercel\project.json"
  }
}

Write-Host "Deploy production (BLANK10_ROOT=1)..."
$env:BLANK10_ROOT = "1"
npx --yes vercel deploy --prod --yes 2>&1
exit $LASTEXITCODE
