@echo off
REM Bypasses PowerShell script execution policy. Reads NGROK_AUTHTOKEN from .env.
cd /d "%~dp0.."

set "NGROK_TOKEN="
for /f "usebackq tokens=1,* delims==" %%a in (`findstr /b /c:"NGROK_AUTHTOKEN=" ".env" 2^>nul`) do set "NGROK_TOKEN=%%b"

if not defined NGROK_TOKEN (
  echo ERROR: Set NGROK_AUTHTOKEN in .env
  echo Get token: https://dashboard.ngrok.com/get-started/your-authtoken
  exit /b 1
)

set "NGROK=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
if not exist "%NGROK%" set "NGROK=ngrok"

echo Configuring ngrok authtoken...
"%NGROK%" config add-authtoken %NGROK_TOKEN%
if errorlevel 1 exit /b 1

echo Starting ngrok tunnel -^> http://localhost:5173
echo Copy the HTTPS Forwarding URL from the output below.
"%NGROK%" http 5173
