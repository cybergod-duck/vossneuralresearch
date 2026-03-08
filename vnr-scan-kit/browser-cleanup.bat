@echo off
echo.
echo  ============================================
echo   VNR SCAN - BROWSER CLEANUP
echo   Voss Neural Research
echo  ============================================
echo.
echo  This will remove tracker artifacts from
echo  Chrome, Brave, and Edge profiles.
echo.
echo  CLOSE ALL BROWSERS BEFORE CONTINUING.
echo.
pause

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Run this as Administrator.
    pause
    exit /b 1
)

set count=0

echo.
echo  [CHROME] Cleaning tracker artifacts...
set "CHROME=%LOCALAPPDATA%\Google\Chrome\User Data\Default"
if exist "%CHROME%" (
    if exist "%CHROME%\component_crx_cache" (rd /s /q "%CHROME%\component_crx_cache" & set /a count+=1)
    if exist "%CHROME%\optimization_guide_model_store" (rd /s /q "%CHROME%\optimization_guide_model_store" & set /a count+=1)
    if exist "%CHROME%\Cache\Cache_Data" (rd /s /q "%CHROME%\Cache\Cache_Data" & set /a count+=1)
    if exist "%CHROME%\Code Cache" (rd /s /q "%CHROME%\Code Cache" & set /a count+=1)
    if exist "%CHROME%\ActorSafetyLists" (rd /s /q "%CHROME%\ActorSafetyLists" & set /a count+=1)
    echo  [CHROME] Cleaned.
) else (
    echo  [CHROME] Profile not found - skipping.
)

echo.
echo  [BRAVE] Cleaning tracker artifacts...
set "BRAVE=%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default"
if exist "%BRAVE%" (
    if exist "%BRAVE%\component_crx_cache" (rd /s /q "%BRAVE%\component_crx_cache" & set /a count+=1)
    if exist "%BRAVE%\optimization_guide_model_store" (rd /s /q "%BRAVE%\optimization_guide_model_store" & set /a count+=1)
    if exist "%BRAVE%\Cache\Cache_Data" (rd /s /q "%BRAVE%\Cache\Cache_Data" & set /a count+=1)
    if exist "%BRAVE%\Code Cache" (rd /s /q "%BRAVE%\Code Cache" & set /a count+=1)
    if exist "%BRAVE%\ActorSafetyLists" (rd /s /q "%BRAVE%\ActorSafetyLists" & set /a count+=1)
    echo  [BRAVE] Cleaned.
) else (
    echo  [BRAVE] Profile not found - skipping.
)

echo.
echo  [EDGE] Cleaning tracker artifacts...
set "EDGE=%LOCALAPPDATA%\Microsoft\Edge\User Data\Default"
if exist "%EDGE%" (
    if exist "%EDGE%\component_crx_cache" (rd /s /q "%EDGE%\component_crx_cache" & set /a count+=1)
    if exist "%EDGE%\optimization_guide_model_store" (rd /s /q "%EDGE%\optimization_guide_model_store" & set /a count+=1)
    if exist "%EDGE%\Cache\Cache_Data" (rd /s /q "%EDGE%\Cache\Cache_Data" & set /a count+=1)
    if exist "%EDGE%\Code Cache" (rd /s /q "%EDGE%\Code Cache" & set /a count+=1)
    if exist "%EDGE%\ActorSafetyLists" (rd /s /q "%EDGE%\ActorSafetyLists" & set /a count+=1)
    echo  [EDGE] Cleaned.
) else (
    echo  [EDGE] Profile not found - skipping.
)

echo.
echo  ============================================
echo   CLEANUP COMPLETE
echo   %count% artifact directories destroyed
echo   Browsers will regenerate clean caches
echo   on next launch.
echo  ============================================
echo.
pause
