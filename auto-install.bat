@echo off
REM ========================================
REM IEEE-Extentions - Complete Auto Installer
REM Windows Version - One Click Install
REM ========================================

setlocal enabledelayexpansion

color 0A
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║  SIGHT Tools - Auto Installer          ║
echo ║  IEEE SIGHT Companion Extension        ║
echo ║  Windows Version - One Click Install   ║
echo ╚════════════════════════════════════════╝
echo.
echo.

REM Get current directory
set "EXTENSION_PATH=%CD%"

echo [*] Extension Path: %EXTENSION_PATH%
echo.

REM Check manifest.json
if not exist "%EXTENSION_PATH%\manifest.json" (
    cls
    color 0C
    echo.
    echo [ERROR] ERROR ERROR ERROR!
    echo.
    echo manifest.json পাওয়া যাচ্ছে না!
    echo.
    echo এই স্ক্রিপ্টটি Extension ফোল্ডারের মধ্যে থাকতে হবে।
    echo.
    echo পথ: %EXTENSION_PATH%
    echo.
    pause
    exit /b 1
)

color 0A
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║  SIGHT Tools - Auto Installer          ║
echo ║  IEEE SIGHT Companion Extension        ║
echo ║  Windows Version - One Click Install   ║
echo ╚════════════════════════════════════════╝
echo.
echo.
echo [OK] manifest.json খুঁজে পাওয়া গেছে ✓
echo.

REM Find Chrome path
set "CHROME_PATH="

REM Method 1: Check Program Files
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

REM Method 2: Check Program Files (x86)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

REM Method 3: Check Local AppData
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    goto :chrome_found
)

REM Method 4: Use where command
for /f "tokens=*" %%A in ('where chrome.exe 2^>nul') do (
    set "CHROME_PATH=%%A"
    goto :chrome_found
)

REM Not found
cls
color 0C
echo.
echo [ERROR] Chrome পাওয়া যাচ্ছে না!
echo.
echo Chrome ইনস্টল করুন: https://www.google.com/chrome/
echo.
echo তারপর এই স্ক্রিপ্ট আবার চালান।
echo.
pause
exit /b 1

:chrome_found
cls
color 0A
echo.
echo ╔════════════════════════════════════════╗
echo ║  SIGHT Tools - Auto Installer          ║
echo ║  IEEE SIGHT Companion Extension        ║
echo ║  Windows Version - One Click Install   ║
echo ╚════════════════════════════════════════╝
echo.
echo.
echo [OK] manifest.json খুঁজে পাওয়া গেছে ✓
echo [OK] Chrome খুঁজে পাওয়া গেছে ✓
echo.
echo Chrome Path: !CHROME_PATH!
echo.

REM Start Extension Installation Process
echo ╔════════════════════════════════════════════════════╗
echo ║              ইনস্টলেশন শুরু হচ্ছে...                ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo [1/5] Extension ফোল্ডার প্রস্তুত করছি...
timeout /t 1 /nobreak >nul

echo [2/5] Chrome খোলা হচ্ছে...
start "" "!CHROME_PATH!" "chrome://extensions/"
timeout /t 2 /nobreak >nul

echo [3/5] Extensions পৃষ্ঠা লোড হচ্ছে...
timeout /t 2 /nobreak >nul

echo [4/5] ইনস্টলেশন গাইড প্রস্তুত করছি...
timeout /t 1 /nobreak >nul

echo [5/5] সম্পন্ন!
echo.

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SIGHT Tools Installation Guide              ║
echo ║                                                                ║
echo ║              Chrome Extension ম্যানুয়াল লোড করুন              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo Chrome এর Extensions পৃষ্ঠা খোলা আছে। এখন এই ধাপগুলি অনুসরণ করুন:
echo.
echo.
echo  STEP 1: Developer Mode চালু করুন
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Chrome Window এর উপরে ডানদিকে "Developer mode" খুঁজুন।
echo  Toggle চালু করুন (লাল রঙে পরিবর্তিত হবে)।
echo.
echo  [উপরে ডানদিকে Toggle দেখুন] ↗
echo.
echo.

pause

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SIGHT Tools Installation Guide              ║
echo ║                                                                ║
echo ║              Chrome Extension ম্যানুয়াল লোড করুন              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  STEP 2: Load unpacked ক্লিক করুন
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Developer Mode চালু হওয়ার পর, উপরে বাম দিকে
echo  "Load unpacked" বাটন দেখা যাবে।
echo.
echo  এটি ক্লিক করুন।
echo.
echo  [Load unpacked] ボタンটি দেখুন ↖
echo.
echo.

pause

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SIGHT Tools Installation Guide              ║
echo ║                                                                ║
echo ║              Chrome Extension ম্যানুয়াল লোড করুন              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  STEP 3: ফোল্ডার সিলেক্ট করুন
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  একটি ফোল্ডার সিলেক্ট করার উইন্ডো খুলবে।
echo.
echo  এই ফোল্ডার সিলেক্ট করুন:
echo.
echo  📁 %EXTENSION_PATH%
echo.
echo  "Select Folder" ক্লিক করুন।
echo.
echo.

pause

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SIGHT Tools Installation Guide              ║
echo ║                                                                ║
echo ║              Chrome Extension ম্যানুয়াল লোড করুন              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  STEP 4: Extension লোড হওয়ার জন্য অপেক্ষা করুন
echo  ═══════════════════════════════════════════════════════════════
echo.
echo  Chrome এ Extension লোড হচ্ছে...
echo.
echo  কয়েক সেকেন্ডের মধ্যে:
echo.
echo  ✓ Extension লিস্টে "SIGHT Tools" দেখা যাবে
echo  ✓ Chrome টুলবারে SIGHT Tools আইকন দেখা যাবে
echo.
echo.
timeout /t 3 /nobreak

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SIGHT Tools Installation Guide              ║
echo ║                                                                ║
echo ║              Chrome Extension ম্যানুয়াল লোড করুন              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo  ✅ Installation সম্পূর্ণ!
echo  ═══════════════════════════════════════════════════════════════
echo.
echo.
echo  কী দেখতে হবে:
echo.
echo  ✓ Chrome Extensions পৃষ্ঠায় "SIGHT Tools" দেখা যাবে
echo  ✓ Chrome টুলবারে Extension আইকন দেখা যাবে
echo  ✓ Extension চালু থাকবে (toggle ON)
echo.
echo.
echo  যদি সমস্যা হয়:
echo.
echo  1. Chrome সম্পূর্ণভাবে বন্ধ করুন
echo  2. এই স্ক্রিপ্ট আবার চালান
echo  3. ধাপগুলি পুনরায় অনুসরণ করুন
echo.
echo.
color 0B
echo   धन्यवाद SIGHT Tools ব্যবহার করার জন্য!
echo.
color 0A

pause
exit /b 0
