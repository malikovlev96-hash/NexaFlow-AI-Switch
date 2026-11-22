@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
:menu
cls
echo.
echo  NEXAFLOW AI SWITCH 1.7.0
echo  ======================
echo.
echo  [1] Запустить Desktop/Mobile web app
echo  [2] Остановить локальный сервер
echo  [3] Установить Claude Desktop MCPB
echo  [4] Проверить Python и порт 8765
echo  [5] Инструкция по мобильной установке
echo  [0] Выход
echo.
set /p choice=Выберите действие: 
if "%choice%"=="1" (powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0desktop\launcher.ps1" -Action start & pause & goto menu)
if "%choice%"=="2" (powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0desktop\launcher.ps1" -Action stop & pause & goto menu)
if "%choice%"=="3" (if exist "%~dp0dist\NexaFlow-AI-Switch-1.7.0.mcpb" (start "" "%~dp0dist\NexaFlow-AI-Switch-1.7.0.mcpb") else (echo MCPB не найден. Сначала запустите BUILD-MCPB.cmd.) & pause & goto menu)
if "%choice%"=="4" (powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0desktop\launcher.ps1" -Action check & pause & goto menu)
if "%choice%"=="5" (start "" "%~dp0mobile\INSTALL-MOBILE.txt" & goto menu)
if "%choice%"=="0" exit /b 0
echo Неверный пункт.
timeout /t 2 >nul
goto menu
