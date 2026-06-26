@echo off
title QueueFlow - Smart Appointment System
echo ===================================================
echo Starting QueueFlow System via Docker
echo.
echo Make sure Docker Desktop is running!
echo.
echo Press Ctrl+C at any time to stop the server and 
echo shut down all containers gracefully.
echo ===================================================

echo The dashboard will automatically open in 15 seconds...
:: Run a background command to wait 15 seconds, then open the browser
start /B cmd /c "timeout /t 15 >nul && start http://localhost"

:: Start the docker containers in the foreground
docker-compose up
