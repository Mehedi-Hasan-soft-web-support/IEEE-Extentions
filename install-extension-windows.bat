@echo off
REM IEEE-Extentions - Chrome Extension Installation Script for Windows
REM এই স্ক্রিপ্ট Chrome এ SIGHT Tools Extension স্বয়ংক্রিয়ভাবে ইনস্টল করবে

setlocal enabledelayexpansion

echo.
echo ========================================
echo   SIGHT Tools - Chrome Extension
echo   Installation Script (Windows)
echo ========================================
echo.

REM Get the current directory where this script is located
set "EXTENSION_PATH=%~dp0"
echo Extension Path: !EXTENSION_PATH!

REM Check if manifest.json exists
if not exist "!EXTENSION_PATH!manifest.json" (
    echo.
    echo ERROR: manifest.json file not found!
    echo Please make sure this script is in the same folder as manifest.json
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ manifest.json found
echo.

REM Check if Chrome is installed
for %%i in ("Google Chrome" "chrome" "google-chrome") do (
    for /f "tokens=*" %%a in ('where %%i 2^>nul') do (
        set "CHROME_PATH=%%a"
        goto :chrome_found
    )
)

REM Try common Chrome installation paths
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

echo.
echo ERROR: Google Chrome not found!
echo Please install Google Chrome first: https://www.google.com/chrome/
echo.
pause
exit /b 1

:chrome_found
echo ✓ Chrome found at: !CHROME_PATH!
echo.

echo Loading extension in Chrome...
echo.
echo Please follow these steps:
echo   1. Chrome will open automatically
echo   2. Go to chrome://extensions/
echo   3. Enable "Developer mode" (top right toggle)
echo   4. Click "Load unpacked"
echo   5. Select this folder: !EXTENSION_PATH!
echo.

REM Open chrome with extensions page
start "" "!CHROME_PATH!" "chrome://extensions"

echo.
echo ✓ Chrome is opening...
echo.
timeout /t 3

REM Create a registry entry for easier future loading (optional)
echo.
echo Script completed!
echo If extension doesn't load, try these steps manually:
echo   1. Open Chrome
echo   2. Go to chrome://extensions/
echo   3. Toggle "Developer mode" ON (top right)
echo   4. Click "Load unpacked"
echo   5. Navigate to: !EXTENSION_PATH!
echo   6. Select the folder
echo.
pause
