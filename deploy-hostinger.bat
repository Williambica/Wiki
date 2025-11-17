@echo off
echo ========================================
echo   Deploy Automatico - Hostinger
echo ========================================
echo.

set /p SSH_USER="Digite seu usuario SSH (ex: u123456789): "
set /p SSH_HOST="Digite seu dominio (ex: seudominio.com): "
set /p GITHUB_USER="Digite seu usuario do GitHub: "
set REPO_NAME=wiki-farmacias-associadas

echo.
echo ========================================
echo   Conectando ao servidor...
echo ========================================
echo.

REM Criar script de deploy remoto
echo cd ~/public_html > temp_deploy.sh
echo git clone https://github.com/%GITHUB_USER%/%REPO_NAME%.git >> temp_deploy.sh
echo cd %REPO_NAME% >> temp_deploy.sh
echo npm install --production >> temp_deploy.sh
echo npm run build >> temp_deploy.sh
echo npm run setup >> temp_deploy.sh
echo npm install -g pm2 >> temp_deploy.sh
echo pm2 start ecosystem.config.js >> temp_deploy.sh
echo pm2 save >> temp_deploy.sh
echo pm2 startup >> temp_deploy.sh
echo echo "Deploy concluido!" >> temp_deploy.sh

echo Enviando script de deploy...
scp temp_deploy.sh %SSH_USER%@%SSH_HOST%:~/deploy.sh

echo.
echo Executando deploy no servidor...
ssh %SSH_USER%@%SSH_HOST% "chmod +x ~/deploy.sh && ~/deploy.sh"

echo.
echo ========================================
echo   Deploy Concluido!
echo ========================================
echo.
echo Acesse: https://%SSH_HOST%
echo.
echo Login: admin@farmacia.com
echo Senha: admin123
echo.
echo IMPORTANTE: Altere a senha apos o primeiro acesso!
echo.

del temp_deploy.sh

pause
