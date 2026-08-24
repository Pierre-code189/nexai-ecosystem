#!/bin/bash
echo "=========================================================="
echo "Iniciando Ecosistema NexAI (3 Microservicios Desacoplados)"
echo "=========================================================="

echo "[1/3] Iniciando NexAI Web Builder en el puerto 3000..."
(cd nexai-web-builder && npm run dev) &

echo "[2/3] Iniciando NexAI CRM Core en el puerto 3001..."
(cd nexai-crm-core && npm run dev) &

echo "[3/3] Iniciando NexAI WhatsApp Bot Service en el puerto 3002..."
(cd nexai-whatsapp-bot-service && npm run dev) &

echo "=========================================================="
echo "Servicios activos:"
echo "• Portal Web Builder:       http://localhost:3000"
echo "• CRM Universal Core:       http://localhost:3001"
echo "• WhatsApp Bot & Terminal:  http://localhost:3002"
echo "=========================================================="
wait
