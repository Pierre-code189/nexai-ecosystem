#!/bin/bash

# Colores para salida de terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}       NEXAI ECOSYSTEM — SUITE DE TESTEO EN VPS      ${NC}"
echo -e "${BLUE}=====================================================${NC}\n"

# -----------------------------------------------------------------------------
# 1. VERIFICACIÓN DE PROCESOS PM2
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[TEST 1/5] Verificando procesos en PM2...${NC}"
if command -v pm2 &> /dev/null; then
    PM2_STATUS=$(pm2 jlist 2>/dev/null)
    for APP in "nexai-web-builder" "nexai-crm-core" "nexai-whatsapp-bot"; do
        if echo "$PM2_STATUS" | grep -q "\"name\":\"$APP\""; then
            ONLINE=$(echo "$PM2_STATUS" | grep -o "\"name\":\"$APP\",\"pm_id\":[0-9]*,\"status\":\"[a-z]*\"" | grep -o "online")
            if [ "$ONLINE" == "online" ]; then
                echo -e "  ${GREEN}✓${NC} $APP: ONLINE en PM2"
            else
                echo -e "  ${RED}✗${NC} $APP: DETENIDO / ERROR"
            fi
        else
            echo -e "  ${YELLOW}?${NC} $APP: No registrado en PM2"
        fi
    done
else
    echo -e "  ${RED}✗ PM2 no está instalado o no se encuentra en el PATH.${NC}"
fi

echo ""

# -----------------------------------------------------------------------------
# 2. VERIFICACIÓN DE OLLAMA LOCAL (Puerto 11434)
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[TEST 2/5] Probando conexión e inferencia en Ollama...${NC}"
OLLAMA_TAGS=$(curl -s -m 5 http://127.0.0.1:11434/api/tags)

if [ $? -eq 0 ] && [ -n "$OLLAMA_TAGS" ]; then
    echo -e "  ${GREEN}✓${NC} Servicio Ollama activo en http://127.0.0.1:11434"
    
    # Comprobar modelos instalados
    MODELS=$(echo "$OLLAMA_TAGS" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | tr '\n' ' ')
    echo -e "    Modelos detectados: ${BLUE}$MODELS${NC}"
    
    # Test de inferencia rápida
    START_TIME=$(date +%s%N)
    TEST_PROMPT='{"model":"qwen2.5:1.5b","prompt":"Responde solo OK","stream":false}'
    GEN_RESP=$(curl -s -m 15 -X POST http://127.0.0.1:11434/api/generate -H "Content-Type: application/json" -d "$TEST_PROMPT")
    END_TIME=$(date +%s%N)
    
    DIFF_MS=$(( (END_TIME - START_TIME) / 1000000 ))
    if echo "$GEN_RESP" | grep -q "response"; then
        echo -e "  ${GREEN}✓${NC} Inferencia completada con éxito (${DIFF_MS} ms)"
    else
        echo -e "  ${YELLOW}⚠${NC} Inferencia falló o modelo no descargado. Intenta ejecutar: ${BLUE}ollama pull qwen2.5:1.5b${NC}"
    fi
else
    echo -e "  ${RED}✗ No se pudo conectar a Ollama en el puerto 11434.${NC}"
    echo -e "    Ejecuta: ${BLUE}systemctl start ollama${NC} o ${BLUE}nohup ollama serve &${NC}"
fi

echo ""

# -----------------------------------------------------------------------------
# 3. VERIFICACIÓN DEL AGENTE APIO (/api/builder/chat en Puerto 3000)
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[TEST 3/5] Probando API del Agente Apio (Web Builder)...${NC}"
CHAT_PAYLOAD='{
  "currentJsxCode": "function App() { return <div>Inicio</div>; }",
  "userInstruction": "Crear Panadería Artesanal con catálogo"
}'

CHAT_RESP=$(curl -s -m 30 -X POST http://127.0.0.1:3000/api/builder/chat \
  -H "Content-Type: application/json" \
  -d "$CHAT_PAYLOAD")

if [ $? -eq 0 ] && echo "$CHAT_RESP" | grep -q "jsxCode"; then
    SOURCE=$(echo "$CHAT_RESP" | grep -o '"source":"[^"]*"' | cut -d'"' -f4)
    REPLY=$(echo "$CHAT_RESP" | grep -o '"reply":"[^"]*"' | cut -d'"' -f4 | cut -c1-60)
    echo -e "  ${GREEN}✓${NC} Endpoint /api/builder/chat respondió correctamente (200 OK)"
    echo -e "    Motor utilizado: ${BLUE}${SOURCE:-desconocido}${NC}"
    echo -e "    Respuesta Apio:  \"${REPLY}...\""
else
    echo -e "  ${RED}✗ Error consultando /api/builder/chat en el puerto 3000.${NC}"
    echo -e "    Respuesta recibida: $CHAT_RESP"
fi

echo ""

# -----------------------------------------------------------------------------
# 4. VERIFICACIÓN DEL CRM CORE (/api/leads en Puerto 3001)
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[TEST 4/5] Probando captura de leads en CRM Core...${NC}"
LEAD_PAYLOAD='{
  "tenantId": "tenant_test",
  "title": "Lead de Prueba Automatizada",
  "contactName": "Pierre Test",
  "contactPhone": "+51928100975",
  "value": 150
}'

LEAD_RESP=$(curl -s -m 10 -X POST http://127.0.0.1:3001/api/leads \
  -H "Content-Type: application/json" \
  -d "$LEAD_PAYLOAD")

if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} CRM Core accesible en http://127.0.0.1:3001"
    echo -e "    Respuesta lead: $LEAD_RESP"
else
    echo -e "  ${RED}✗ No se pudo contactar al CRM Core en el puerto 3001.${NC}"
fi

echo ""

# -----------------------------------------------------------------------------
# 5. VERIFICACIÓN DEL SERVICIO WHATSAPP BOT (Puerto 3002)
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[TEST 5/5] Probando servicio de WhatsApp Bot...${NC}"
BOT_PING=$(curl -s -m 5 -o /dev/null -w "%{http_code}" http://127.0.0.1:3002/)

if [ "$BOT_PING" != "000" ]; then
    echo -e "  ${GREEN}✓${NC} Servidor de WhatsApp Bot escuchando en puerto 3002 (HTTP $BOT_PING)"
else
    # Comprobar si el proceso está corriendo aunque no exponga HTTP
    BOT_PID=$(pgrep -f "baileys-bot.js")
    if [ -n "$BOT_PID" ]; then
        echo -e "  ${GREEN}✓${NC} Proceso Baileys Bot activo en background (PID: $BOT_PID)"
    else
        echo -e "  ${RED}✗ El servicio de WhatsApp no está respondiendo en el puerto 3002 ni como proceso.${NC}"
    fi
fi

echo -e "\n${BLUE}=====================================================${NC}"
echo -e "${BLUE}                 TESTEO FINALIZADO                   ${NC}"
echo -e "${BLUE}=====================================================${NC}"
