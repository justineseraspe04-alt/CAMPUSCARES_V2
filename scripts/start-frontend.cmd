@echo off
REM Bypasses PowerShell npm.ps1 execution policy (use npm.cmd).
cd /d "%~dp0.."
echo Starting Vite on http://localhost:5173 ...
call npm.cmd run dev
