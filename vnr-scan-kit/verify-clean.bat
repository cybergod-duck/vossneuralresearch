@echo off
echo.
echo  ============================================
echo   VNR SCAN - VERIFY CLEAN
echo   Voss Neural Research
echo  ============================================
echo.

set clean=1

echo  [1/3] Checking LOCKER Mode...
findstr /c:"VNR SCAN" "%SystemRoot%\System32\drivers\etc\hosts" >nul 2>&1
if %errorlevel% equ 0 (
    echo        LOCKER MODE: ACTIVE
) else (
    echo        LOCKER MODE: NOT INSTALLED
    echo        Run install-locker.bat first.
    set clean=0
)

echo.
echo  [2/3] Checking DNS resolution...
nslookup clarity.ms 2>nul | findstr /c:"0.0.0.0" >nul 2>&1
if %errorlevel% equ 0 (
    echo        clarity.ms: BLOCKED
) else (
    ping -n 1 -w 1000 clarity.ms 2>nul | findstr /c:"0.0.0.0" >nul 2>&1
    if %errorlevel% equ 0 (
        echo        clarity.ms: BLOCKED
    ) else (
        echo        clarity.ms: WARNING - may still resolve
        set clean=0
    )
)

echo.
echo  [3/3] Checking browser artifacts...
set artifacts=0
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\component_crx_cache" set /a artifacts+=1
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\optimization_guide_model_store" set /a artifacts+=1
if exist "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default\component_crx_cache" set /a artifacts+=1
if exist "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\component_crx_cache" set /a artifacts+=1

if %artifacts% equ 0 (
    echo        Browser artifacts: CLEAN
) else (
    echo        Browser artifacts: %artifacts% FOUND
    echo        Run browser-cleanup.bat to remove.
    set clean=0
)

echo.
echo  ============================================
if %clean% equ 1 (
    echo   STATUS: ALL CLEAR
    echo   Your system is protected.
) else (
    echo   STATUS: ACTION NEEDED
    echo   See warnings above.
)
echo  ============================================
echo.
echo  Full evidence: www.vossneuralresearch.com
echo.
pause
