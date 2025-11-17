@echo off
echo ========================================
echo   Push para GitHub
echo ========================================
echo.

set /p GITHUB_USER="Digite seu usuario do GitHub: "
set REPO_NAME=wiki-farmacias-associadas

echo.
echo Conectando ao repositorio...
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo Fazendo push...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Push Concluido com Sucesso!
    echo ========================================
    echo.
    echo Repositorio: https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo Proximo passo: Deploy na Hostinger
    echo Execute: deploy-hostinger.bat
    echo.
) else (
    echo.
    echo ERRO ao fazer push!
    echo.
    echo Possiveis causas:
    echo 1. Repositorio nao existe no GitHub
    echo 2. Credenciais incorretas
    echo 3. Sem permissao de acesso
    echo.
    echo Solucao:
    echo 1. Verifique se criou o repositorio no GitHub
    echo 2. Configure suas credenciais: git config --global user.name "Seu Nome"
    echo 3. Configure seu email: git config --global user.email "seu@email.com"
    echo.
)

pause
