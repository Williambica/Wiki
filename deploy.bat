@echo off
echo ========================================
echo   Deploy Wiki Farmacias Associadas
echo ========================================
echo.

REM 1. Instalar dependencias
echo [1/5] Instalando dependencias...
call npm install --production
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

REM 2. Build do frontend
echo.
echo [2/5] Buildando frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao buildar frontend!
    pause
    exit /b 1
)

REM 3. Verificar banco de dados
echo.
echo [3/5] Verificando banco de dados...
if not exist "wiki.db" (
    echo Banco nao encontrado. Criando...
    
    REM Iniciar servidor temporariamente
    start /B node server.js
    timeout /t 3 /nobreak >nul
    taskkill /F /IM node.exe >nul 2>&1
    
    REM Importar dados
    echo Importando dados...
    call node importar-faq-final.js
    call node importar-queries-sql.js
    
    echo Banco criado e populado!
) else (
    echo Banco ja existe.
)

REM 4. Criar diretorio de logs
echo.
echo [4/5] Criando diretorio de logs...
if not exist "logs" mkdir logs

REM 5. Verificar PM2
echo.
echo [5/5] Verificando PM2...
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo PM2 nao encontrado. Instalando...
    call npm install -g pm2
)

REM Parar processo anterior
echo Parando processo anterior...
call pm2 stop wiki-farmacias 2>nul
call pm2 delete wiki-farmacias 2>nul

REM Iniciar aplicacao
echo.
echo Iniciando aplicacao...
call pm2 start ecosystem.config.js

REM Salvar configuracao
call pm2 save

REM Mostrar status
echo.
echo ========================================
echo   Deploy Concluido!
echo ========================================
echo.
call pm2 status

echo.
echo Wiki Farmacias Associadas esta rodando!
echo.
echo Comandos uteis:
echo   Ver logs: pm2 logs wiki-farmacias
echo   Reiniciar: pm2 restart wiki-farmacias
echo   Parar: pm2 stop wiki-farmacias
echo.
pause
