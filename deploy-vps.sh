#!/bin/bash
# ==============================================================================
# NEXAI ECOSYSTEM — INSTALADOR Y DESPLEGADOR AUTOMÁTICO EN VPS (4GB RAM)
# Autor: Gian Pierre Sernaqué Wong (Pierre)
# ==============================================================================

set -e

echo "🚀 [1/6] Optimizando Servidor Linux (Swap 4GB + Dependencias)..."
if [ ! -f /swapfile ]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✅ Memoria Swap de 4GB activada con éxito."
else
    echo "ℹ️ Memoria Swap ya configurada."
fi

apt-get update -y
apt-get install -y curl git unzip build-essential nginx

# Instalar Node.js 20 LTS si no existe
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

npm install -g pm2

# Instalar e Iniciar Ollama con modelo Qwen 1.5B
echo "
🧠 [2/6] Verificando Motor de IA Local (Ollama)..."
if ! command -v ollama &> /dev/null; then
    echo "📥 Instalando Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

systemctl start ollama || true
systemctl enable ollama || true
sleep 3

echo "📥 Descargando modelo ligero qwen2.5:1.5b en el VPS..."
ollama pull qwen2.5:1.5b

echo "
📦 [3/6] Instalando dependencias y compilando proyectos..."
cd /root/nexai/nexai-web-builder && npm install && npm run build
cd /root/nexai/nexai-crm-core && npm install && npm run build
cd /root/nexai/nexai-whatsapp-bot-service && npm install

echo "
🔄 [4/6] Iniciando microservicios con PM2..."
cd /root/nexai
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "
🌐 [5/6] Configurando Nginx Reverse Proxy..."
cp /root/nexai/nginx/nexai.conf /etc/nginx/sites-available/nexai.conf
ln -sf /etc/nginx/sites-available/nexai.conf /etc/nginx/sites-enabled/nexai.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "
=============================================================================="
echo "🎉 ¡EL ECOSISTEMA NEXAI ESTÁ 100% OPERATIVO EN TU VPS!"
echo "=============================================================================="
echo "📍 Acceso Web Builder:    http://$(curl -s ifconfig.me):3000 (o puerto 80 en la IP)"
echo "📍 Acceso CRM Core:       http://$(curl -s ifconfig.me):3001"
echo "📍 Acceso WhatsApp Bot:   http://$(curl -s ifconfig.me):3002"
echo "📍 Motor de IA Local:     Ollama (qwen2.5:1.5b activo en http://127.0.0.1:11434)"
echo "=============================================================================="
echo "👉 Para ver el QR de WhatsApp en vivo ejecuta: pm2 logs nexai-whatsapp-bot"
echo "=============================================================================="
