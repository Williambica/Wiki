@echo off
echo Atualizando SPASincPdvWs
taskkill /IM SPASincPdvWs.exe /F 
@echo off
timeout 5 > NUL
del  SPASincPdvWs_*.exe > NUL
copy SPASincPdvWs.exe SPASincPdvWs_22556.exe > NUL
xcopy _atuSPASincPdvWs\*.* .  /y /e /d /h /q > NUL
start  /MAX SPASincPdvWs.exe
rmdir /s /q _atuSPASincPdvWs
del SPASincPdvWsCMD.bat
exit
