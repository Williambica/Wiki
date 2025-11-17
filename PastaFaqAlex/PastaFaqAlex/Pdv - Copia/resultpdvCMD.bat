@echo off
echo Atualizando resultpdv
taskkill /F /IM resultpdv.exe
@echo off
timeout 5 > NUL
del  resultpdv_*.exe > NUL
copy resultpdv.exe resultpdv_197041.exe > NUL
xcopy _aturesultpdv\*.* .  /y /e /d /h /q > NUL
start  /MAX resultpdv.exe
exit
