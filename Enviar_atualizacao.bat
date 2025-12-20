@echo off
chcp 65001 > nul
echo ==========================================
echo    Enviando atualizacoes para o GitHub
echo ==========================================
echo.

:: Adicionar todos os arquivos
echo [1/3] Adicionando arquivos...
git add .

:: Solicitar mensagem de commit
set /p commit_msg="Digite a mensagem do commit (Enter para padrao): "
if "%commit_msg%"=="" set commit_msg=Atualizacao automatica %date% %time%

:: Realizar o commit
echo [2/3] Realizando commit...
git commit -m "%commit_msg%"

:: Enviar para o repositorio remoto
echo [3/3] Enviando para o GitHub...
git push origin main

echo.
echo ==========================================
echo           Processo Concluido!
echo ==========================================
pause
