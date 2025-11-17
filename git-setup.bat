@echo off
echo ========================================
echo   Setup Git - Wiki Farmacias Associadas
echo ========================================
echo.

REM Verificar se git esta instalado
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Git nao esta instalado!
    echo Baixe em: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] Inicializando repositorio Git...
git init

echo.
echo [2/6] Adicionando arquivos...
git add .

echo.
echo [3/6] Criando commit inicial...
git commit -m "feat: Wiki Farmacias Associadas - Sistema completo de base de conhecimento

- Landing page moderna com animacoes
- Sistema de artigos com categorias
- Busca avancada em tempo real
- Sistema de favoritos
- 4 artigos de Queries SQL
- Design responsivo
- Pronto para deploy na Hostinger"

echo.
echo [4/6] Configurando branch principal...
git branch -M main

echo.
echo ========================================
echo   Proximo Passo: Criar Repositorio no GitHub
echo ========================================
echo.
echo 1. Acesse: https://github.com/new
echo 2. Nome do repositorio: wiki-farmacias-associadas
echo 3. Deixe PRIVADO (recomendado)
echo 4. NAO inicialize com README
echo 5. Clique em "Create repository"
echo.
echo Depois execute: git-push.bat
echo.
pause
