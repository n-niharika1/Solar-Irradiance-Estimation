@echo off
title SolarSight AI — Launcher
color 0A

echo ===================================================
echo           SOLARSIGHT AI — LAUNCHER
echo ===================================================
echo.
echo Starting FastAPI Backend (Port 8000)...
start "SolarSight AI — Backend API" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Starting Vite React Frontend (Port 5173)...
start "SolarSight AI — Frontend UI" cmd /k "cd /d "%~dp0frontend" && pnpm run dev --host 0.0.0.0 --port 5173"

echo Waiting for services to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser...
start http://localhost:5173/predict

echo.
echo ===================================================
echo  Backend:  http://localhost:8000/docs
echo  Frontend: http://localhost:5173/predict
echo ===================================================
echo Keep the opened command windows running while using the app.
echo.
