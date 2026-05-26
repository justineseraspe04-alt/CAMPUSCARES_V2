# Reads NGROK_AUTHTOKEN from .env and starts tunnel to Vite (port 5173).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"

if (-not (Test-Path $envFile)) {
    Write-Error ".env not found at $envFile"
}

$token = $null
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^NGROK_AUTHTOKEN=(.+)$') {
        $token = $matches[1].Trim()
    }
}

if (-not $token) {
    Write-Error "Set NGROK_AUTHTOKEN in .env (https://dashboard.ngrok.com/get-started/your-authtoken)"
}

$ngrok = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
if (-not (Test-Path $ngrok)) {
    $ngrok = "ngrok"
}

& $ngrok config add-authtoken $token | Out-Null
Write-Host "Starting ngrok tunnel -> http://localhost:5173"
& $ngrok http 5173
