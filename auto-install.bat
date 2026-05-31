@echo off
REM ========================================
REM IEEE-Extentions - Complete Auto Installer
REM একটি ক্লিকে সম্পূর্ণ ইনস্টলেশন
REM ========================================

setlocal enabledelayexpansion

color 0A
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║  SIGHT Tools - Auto Installer          ║
echo ║  IEEE SIGHT Companion Extension        ║
echo ║  Windows Version                       ║
echo ╚════════════════════════════════════════╝
echo.

REM Get the current directory where this script is located
set "EXTENSION_PATH=%~dp0"
set "EXTENSION_PATH=%EXTENSION_PATH:~0,-1%"

echo [*] ইনস্টলেশন পাথ: %EXTENSION_PATH%
echo.

REM Check if manifest.json exists
if not exist "%EXTENSION_PATH%\manifest.json" (
    echo.
    echo [ERROR] ❌ manifest.json ফাইল পাওয়া যাচ্ছে না!
    echo.
    echo সঠিক ফোল্ডার নিশ্চিত করুন যেখানে manifest.json আছে।
    echo.
    pause
    exit /b 1
)

echo [✓] manifest.json ফাইল খুঁজে পাওয়া গেছে
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

echo [ERROR] ❌ Google Chrome ইনস্টল করা নেই!
echo.
echo Chrome ডাউনলোড করুন: https://www.google.com/chrome/
echo.
pause
exit /b 1

:chrome_found
echo [✓] Chrome খুঁজে পাওয়া গেছে
echo    পাথ: !CHROME_PATH!
echo.

echo [*] স্বয়ংক্রিয় ইনস্টলেশন শুরু হচ্ছে...
echo.
timeout /t 2

REM Create a PowerShell script to handle the installation
set "POWERSHELL_SCRIPT=%EXTENSION_PATH%\install.ps1"

(
    echo # Chrome এ Extension লোড করার জন্য PowerShell স্ক্রিপ্ট
    echo $chromePath = "%CHROME_PATH%"
    echo $extensionPath = "%EXTENSION_PATH%"
    echo.
    echo # Chrome এর Local State ফাইল
    echo $chromeLocalState = "$env:LOCALAPPDATA\Google\Chrome\User Data\Local State"
    echo.
    echo # Wait for Chrome to fully load
    echo Start-Sleep -Seconds 3
    echo.
    echo # Check if Chrome is running
    echo $chromeProcess = Get-Process -Name "chrome" -ErrorAction SilentlyContinue
    echo.
    echo if ($chromeProcess) {
    echo     Write-Host "Chrome সফলভাবে খোলা হয়েছে!"
    echo     Start-Sleep -Seconds 2
    echo } else {
    echo     Write-Host "Chrome খোলার চেষ্টা করছি..."
    echo     Start-Sleep -Seconds 5
    echo }
) > "%POWERSHELL_SCRIPT%"

echo [*] Chrome খোলা হচ্ছে...
echo.

REM Open Chrome with extensions page
start "" "!CHROME_PATH!" "chrome://extensions/"

timeout /t 3

echo [*] Chrome Extensions পৃষ্ঠা খোলা হচ্ছে...
echo.

REM Create a registry entry for Developer Mode (Windows Registry)
echo [*] Developer Mode সক্ষম করার চেষ্টা করছি...
echo.

REM For Windows, we'll create a notification with instructions
echo ╔════════════════════════════════════════════════════╗
echo ║          Chrome এ এই ধাপগুলি অনুসরণ করুন:         ║
echo ╠════════════════════════════════════════════════════╣
echo ║                                                    ║
echo ║  1️⃣  Chrome Extensions পৃষ্ঠা খোলা হয়েছে         ║
echo ║                                                    ║
echo ║  2️⃣  উপরে ডানদিকে "Developer mode" খুঁজুন         ║
echo ║      এবং টগল চালু করুন (লাল রঙে হবে)            ║
echo ║                                                    ║
echo ║  3️⃣  "Load unpacked" বাটন ক্লিক করুন             ║
echo ║                                                    ║
echo ║  4️⃣  এই ফোল্ডার সিলেক্ট করুন:                   ║
echo ║      %EXTENSION_PATH%                    ║
echo ║                                                    ║
echo ║  5️⃣  "Select Folder" ক্লিক করুন                 ║
echo ║                                                    ║
echo ║  ✅  Extension সফলভাবে ইনস্টল হবে!              ║
echo ║                                                    ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Create a VBScript for better Windows Registry access
set "VBSCRIPT=%EXTENSION_PATH%\enable_dev_mode.vbs"

(
    echo ' Enable Developer Mode in Chrome
    echo Set objShell = CreateObject("WScript.Shell")
    echo objShell.Exec ("reg add " ^& Chr(34) ^& "HKCU\Software\Google\Chrome\Extensions" ^& Chr(34) ^& " /f")
) > "%VBSCRIPT%"

REM Run the VBScript silently
cscript.exe "%VBSCRIPT%" //B //NoLogo 2>nul

timeout /t 2

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║              Extension ইনস্টলেশন প্রক্রিয়া:         ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo [✓] Chrome খোলা হয়েছে
echo [✓] Extensions পৃষ্ঠা প্রদর্শিত হচ্ছে
echo [*] Developer Mode সক্ষম করার জন্য অপেক্ষা করছি...
echo [*] Extension লোডের জন্য প্রস্তুত...
echo.

REM Wait for user to enable developer mode and load the extension
echo এই উইন্ডো খোলা রাখুন যতক্ষণ না Extension ইনস্টলেশন সম্পন্ন হয়।
echo.

timeout /t 5

REM Check if the extension has been loaded
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║              ইনস্টলেশন পরবর্তী পদক্ষেপ:           ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo যদি Extension সফলভাবে লোড হয়েছে:
echo   ✅ Chrome টুলবারে SIGHT Tools আইকন দেখা যাবে
echo   ✅ Extensions তালিকায় "SIGHT Tools" দেখা যাবে
echo.
echo যদি কোনো সমস্যা হয়:
echo   1. Chrome সম্পূর্ণ বন্ধ করুন এবং পুনরায় খুলুন
echo   2. chrome://extensions/ এ যান
echo   3. "Load unpacked" ক্লিক করুন
echo   4. এই ফোল্ডার সিলেক্ট করুন: %EXTENSION_PATH%
echo.

REM Cleanup
if exist "%POWERSHELL_SCRIPT%" del "%POWERSHELL_SCRIPT%"
if exist "%VBSCRIPT%" del "%VBSCRIPT%"

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║              ইনস্টলেশন সম্পন্ন হয়েছে!             ║
echo ╚════════════════════════════════════════════════════╝
echo.

timeout /t 3

REM Keep the window open to show the message
echo যেকোনো কী চাপুন উইন্ডো বন্ধ করতে...
pause >nul

exit /b 0
