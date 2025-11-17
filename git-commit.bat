@echo off
echo ========================================
echo   Preparando Commit para GitHub
echo ========================================
echo.

REM Inicializar repositorio (se necessario)
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    echo.
)

REM Adicionar todos os arquivos
echo Adicionando arquivos...
git add .

REM Commit
echo.
echo Fazendo commit...
git commit -m "feat: Wiki Farmacias Associadas - Sistema completo com queries SQL e deploy automatizado"

echo.
echo ========================================
echo   Commit realizado com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Crie um repositorio no GitHub:
echo    https://github.com/new
echo.
echo 2. Adicione o remote:
echo    git remote add origin https://github.com/seu-usuario/wiki-farmacias.git
echo.
echo 3. Envie para o GitHub:
echo    git branch -M main
echo    git push -u origin main
echo.
pause
