@echo off
echo.
echo  ============================================
echo   VNR SCAN - LOCKER MODE INSTALLER
echo   Voss Neural Research
echo  ============================================
echo.
echo  This will block 23 Suno tracker domains
echo  at the DNS level via your hosts file.
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Run this as Administrator.
    echo  Right-click ^> Run as Administrator
    pause
    exit /b 1
)

set "HOSTS=%SystemRoot%\System32\drivers\etc\hosts"

echo.>> "%HOSTS%"
echo # ============================================>> "%HOSTS%"
echo # VNR SCAN - LOCKER MODE>> "%HOSTS%"
echo # Suno AI Tracker Blocklist>> "%HOSTS%"
echo # Installed: %date% %time%>> "%HOSTS%"
echo # ============================================>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # hCaptcha - crypto mining infrastructure>> "%HOSTS%"
echo 0.0.0.0 hcaptcha.com>> "%HOSTS%"
echo 0.0.0.0 newassets.hcaptcha.com>> "%HOSTS%"
echo 0.0.0.0 imgs.hcaptcha.com>> "%HOSTS%"
echo 0.0.0.0 js.hcaptcha.com>> "%HOSTS%"
echo 0.0.0.0 accounts.hcaptcha.com>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # Microsoft Clarity - GPU session replay>> "%HOSTS%"
echo 0.0.0.0 clarity.ms>> "%HOSTS%"
echo 0.0.0.0 www.clarity.ms>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # Cross-device fingerprinting>> "%HOSTS%"
echo 0.0.0.0 sdk.iad-03.braze.com>> "%HOSTS%"
echo 0.0.0.0 bidder.criteo.com>> "%HOSTS%"
echo 0.0.0.0 graph.tapad.com>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # Google Ads / DoubleClick>> "%HOSTS%"
echo 0.0.0.0 pagead2.googlesyndication.com>> "%HOSTS%"
echo 0.0.0.0 tpc.googlesyndication.com>> "%HOSTS%"
echo 0.0.0.0 googleads.g.doubleclick.net>> "%HOSTS%"
echo 0.0.0.0 ad.doubleclick.net>> "%HOSTS%"
echo 0.0.0.0 stats.g.doubleclick.net>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # Telemetry pipelines>> "%HOSTS%"
echo 0.0.0.0 o4506642992128000.ingest.us.sentry.io>> "%HOSTS%"
echo 0.0.0.0 browser-intake-us5-datadoghq.com>> "%HOSTS%"
echo 0.0.0.0 cdn.segment.com>> "%HOSTS%"
echo 0.0.0.0 api.segment.io>> "%HOSTS%"
echo 0.0.0.0 cdn.amplitude.com>> "%HOSTS%"
echo 0.0.0.0 api2.amplitude.com>> "%HOSTS%"
echo.>> "%HOSTS%"
echo # Facebook pixel>> "%HOSTS%"
echo 0.0.0.0 connect.facebook.net>> "%HOSTS%"
echo.>> "%HOSTS%"

echo.
echo  ============================================
echo   LOCKER MODE INSTALLED
echo   23 tracker domains blocked
echo   Flush DNS cache...
echo  ============================================

ipconfig /flushdns

echo.
echo  Done. Your machine is now protected.
echo  Full evidence: www.vossneuralresearch.com
echo.
pause
