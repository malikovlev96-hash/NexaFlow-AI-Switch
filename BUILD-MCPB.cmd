@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where python >nul 2>nul || (echo Python 3 не найден. Установите Python 3 и добавьте его в PATH.& pause & exit /b 2)
python tools\build_mcpb.py || (echo Сборка MCPB завершилась с ошибкой.& pause & exit /b 1)
python tools\verify_mcpb.py dist\NexaFlow-AI-Switch-1.7.0.mcpb || (echo Проверка MCPB завершилась с ошибкой.& pause & exit /b 1)
echo Готово: dist\NexaFlow-AI-Switch-1.7.0.mcpb
pause
