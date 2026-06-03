@echo off
title TCETBI Full Stack Runner

echo ============================================
echo     Starting TCETBI Full Stack Project
echo ============================================

:: Kill anything on port 8000
echo.
echo Killing any process using port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: -------------------------
:: FRONTEND (NEW TERMINAL)
:: -------------------------
echo.
echo [1] Starting Frontend (Vite)...
start cmd /k "cd /d %~dp0frontend && npm run dev"

:: -------------------------
:: BACKEND (CURRENT TERMINAL)
:: -------------------------
echo.
echo [2] Starting Backend (Django)...
cd /d %~dp0
call env\Scripts\activate
cd backend
python manage.py runserver
