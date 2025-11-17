@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     🚀 WIKI FARMÁCIAS ASSOCIADAS - DEPLOY AUTOMÁTICO      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.

REM Verificar Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não está instalado!
    echo.
    echo 📥 INSTALE O GIT:
    echo    1. Acesse: https://git-scm.com/download/win
    echo    2. Baixe e instale
    echo    3. Reinicie este script
    echo.
    pause
    exit /b 1
)

echo ✅ Git instalado
echo.

REM Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado!
    echo.
    echo 📥 INSTALE O NODE.JS:
    echo    1. Acesse: https://nodejs.org
    echo    2. Baixe a versão LTS
    echo    3. Instale e reinicie este script
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js instalado
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📋 ESCOLHA UMA OPÇÃO:
echo.
echo    1. Setup Completo (Primeira vez)
echo    2. Apenas Git Setup
echo    3. Apenas Push para GitHub
echo    4. Deploy na Hostinger
echo    5. Ver Instruções
echo    0. Sair
echo.
echo ════════════════════════════════════════════════════════════
echo.

set /p opcao="Digite o número da opção: "

if "%opcao%"=="1" goto setup_completo
if "%opcao%"=="2" goto git_setup
if "%opcao%"=="3" goto git_push
if "%opcao%"=="4" goto deploy
if "%opcao%"=="5" goto instrucoes
if "%opcao%"=="0" goto fim
goto menu

:setup_completo
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              SETUP COMPLETO - PASSO A PASSO                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

echo.
echo [2/5] Fazendo build do frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao fazer build!
    pause
    exit /b 1
)

echo.
echo [3/5] Inicializando Git...
git init
git add .
git commit -m "feat: Wiki Farmacias Associadas - Sistema completo"
git branch -M main

echo.
echo [4/5] Testando localmente...
echo Iniciando servidor em http://localhost:3000
echo Pressione Ctrl+C para parar e continuar
timeout /t 3 /nobreak >nul
start http://localhost:3000
call npm start

echo.
echo [5/5] Próximos passos...
echo.
echo ✅ Setup completo!
echo.
echo 📝 PRÓXIMOS PASSOS:
echo.
echo 1. Criar repositório no GitHub:
echo    https://github.com/new
echo    Nome: wiki-farmacias-associadas
echo.
echo 2. Execute novamente e escolha opção 3 (Push para GitHub)
echo.
echo 3. Execute novamente e escolha opção 4 (Deploy Hostinger)
echo.
pause
goto fim

:git_setup
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                     GIT SETUP                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

call git-setup.bat
goto fim

:git_push
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  PUSH PARA GITHUB                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

call git-push.bat
goto fim

:deploy
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                 DEPLOY NA HOSTINGER                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

call deploy-hostinger.bat
goto fim

:instrucoes
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                      INSTRUÇÕES                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📚 DOCUMENTAÇÃO DISPONÍVEL:
echo.
echo    - INSTRUCOES-GIT.md          Guia completo Git
echo    - DEPLOY-HOSTINGER.md        Deploy na Hostinger
echo    - QUICK-START.md             Início rápido
echo    - README.md                  Documentação do projeto
echo.
echo 🌐 LINKS ÚTEIS:
echo.
echo    - Git: https://git-scm.com
echo    - GitHub: https://github.com
echo    - Node.js: https://nodejs.org
echo    - Hostinger: https://hostinger.com.br
echo.
pause
goto fim

:fim
echo.
echo Até logo! 👋
echo.
timeout /t 2 /nobreak >nul
exit /b 0
