@echo off
title AiDocument
echo ========================================
echo        AiDocument - Starting...
echo ========================================
echo.

echo [1/2] Starting backend (Express + MongoDB)...
start "AiDocument Backend" cmd /c "cd /d "%~dp0server" && npm run dev"

echo [2/2] Starting frontend (Vite + React)...
start "AiDocument Frontend" cmd /c "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:5173
echo ========================================
echo.
pause
