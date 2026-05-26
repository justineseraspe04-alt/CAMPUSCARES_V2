@echo off
cd /d "%~dp0.."

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do set BACKEND_PID=%%a

if defined BACKEND_PID (
  echo Backend is already running on port 8080 ^(PID %BACKEND_PID%^).
  echo Health check:
  powershell -NoProfile -Command "(Invoke-WebRequest 'http://localhost:8080/api/health' -UseBasicParsing).Content"
  echo.
  echo No need to start again. Keep that process running or stop it first:
  echo   taskkill /PID %BACKEND_PID% /F
  exit /b 0
)

echo Starting Spring Boot on port 8080 ...
call mvnw.cmd spring-boot:run
