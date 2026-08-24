@echo off
echo ==========================================================
echo Iniciando Ecosistema NexAI (3 Microservicios Desacoplados)
echo ==========================================================

start "NexAI Web Builder (Port 3000)" cmd /k "cd nexai-web-builder && npm run dev"
start "NexAI CRM Core (Port 3001)" cmd /k "cd nexai-crm-core && npm run dev"
start "NexAI WhatsApp Bot Service (Port 3002)" cmd /k "cd nexai-whatsapp-bot-service && npm run dev"

echo.
echo Servicios iniciados en terminales independientes:
echo - Portal Web Builder:       http://localhost:3000
echo - CRM Universal Core:       http://localhost:3001
echo - WhatsApp Bot & Terminal:  http://localhost:3002
echo ==========================================================
