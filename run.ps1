# VMIC Automated Launcher for PowerShell
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "          Starting VMIC System Launcher            " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Generate SSL Certificates with dynamic IP detection
Write-Host "`n[1/3] Generating SSL certificates for active network IPs..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
node scripts/generate-cert.js

# 2. Start Backend
Write-Host "`n[2/3] Starting Backend Server (Port 8001, HTTPS)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --ssl-keyfile ..\frontend\certificates\server.key --ssl-certfile ..\frontend\certificates\server.crt"

# 3. Start Frontend
Write-Host "`n[3/3] Starting Frontend Server (Port 3000, HTTPS)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "VMIC is up and running!" -ForegroundColor Green
Write-Host "Host Dashboard: https://localhost:3000/host/create" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Start-Process "https://localhost:3000/host/create"

