@echo off
title VMIC Server Launcher
echo ===================================================
echo           Starting VMIC System Launcher
echo ===================================================

cd /d "%~dp0frontend"
echo [1/3] Generating SSL certificates for active network IPs...
call node scripts/generate-cert.js
if %errorlevel% neq 0 (
    echo Error generating certificates. Ensure Node.js is installed.
)

cd /d "%~dp0backend"
echo [2/3] Starting Backend Server (Port 8001, HTTPS)...
start "VMIC Backend (FastAPI)" cmd /k ".\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --ssl-keyfile ..\frontend\certificates\server.key --ssl-certfile ..\frontend\certificates\server.crt"

cd /d "%~dp0frontend"
echo [3/3] Starting Frontend Server (Port 3000, HTTPS)...
start "VMIC Frontend (Next.js)" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo ===================================================
echo VMIC is up and running!
echo Host Dashboard: https://localhost:3000/host/create
echo ===================================================
start https://localhost:3000/host/create

