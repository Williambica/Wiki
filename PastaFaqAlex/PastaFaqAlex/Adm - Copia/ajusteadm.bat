@echo off
setlocal enabledelayedexpansion
if exist "spaadm.new" (
taskkill /F /IM spaadm.exe
ren "spaadm.exe" "spaadm.old"
ren "spaadm.new" "spaadm.exe"
)
endlocal
