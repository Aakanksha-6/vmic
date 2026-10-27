# VMIC Project Instructions & Startup Protocol

## How to Run This Project
Whenever the user asks to "run this project" or start VMIC:

1. **Auto-Generate / Refresh SSL Certificates**:
   Always run the certificate generation script first so that the SSL certificates automatically include the active Wi-Fi / hotspot LAN IPs:
   ```powershell
   Set-Location "frontend"
   node scripts/generate-cert.js
   ```

2. **Start Backend (FastAPI + Socket.IO with SSL)**:
   Must be started with the SSL certificate and key on port 8001:
   ```powershell
   Set-Location "backend"
   .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --ssl-keyfile ..\frontend\certificates\server.key --ssl-certfile ..\frontend\certificates\server.crt
   ```
   Run with `IsDaemon: true` and `BypassSandbox: true`.

3. **Start Frontend (Next.js with Experimental HTTPS)**:
   ```powershell
   Set-Location "frontend"
   npm run dev
   ```
   Run with `IsDaemon: true` and `BypassSandbox: true`.

4. **Verify Health**:
   - Backend: `curl.exe -k -s https://localhost:8001/` returns `{"message":"VMIC backend is running"}`
   - Frontend API: `curl.exe -k -s https://localhost:3000/api/local-ip` returns the current IP

5. **Provide User Access Links**:
   - Host Console: `https://localhost:3000/host/create` or `https://localhost:3000/host/session/lobby`
   - Mobile join QR code will automatically use the active Wi-Fi / Hotspot IP via `/api/local-ip`.

