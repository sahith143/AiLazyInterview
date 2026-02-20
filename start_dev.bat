@echo off
echo Killing potential locking processes...
taskkill /F /IM node.exe /IM cargo.exe /IM rustc.exe /IM tauri-driver.exe /IM rust-analyzer.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Initializing Visual Studio Build Environment...
call "C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvars64.bat"

echo.
echo ===================================================
echo CLEANING UP...
echo ===================================================
echo.

:: Manually clean the old target dir if it exists to be safe
if exist src-tauri\target rmdir /s /q src-tauri\target

echo Starting Angel AI Assistant...
:: The .cargo/config.toml will now force the build to C:/Windows/Temp/angel-ai-build
npm run dev
