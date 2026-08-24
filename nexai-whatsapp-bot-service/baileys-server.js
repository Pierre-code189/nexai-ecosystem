/**
 * NexAI - Servidor Autónomo de WhatsApp Web con Protocolo Baileys (@whiskeysockets/baileys)
 * Este servicio levanta la conexión WebSocket real con los servidores de WhatsApp y genera
 * el código QR auténtico para escanear desde cualquier teléfono móvil.
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const http = require('http');
const qrcode = require('qrcode');

let latestQR = null;
let connectionStatus = 'disconnected';
let clientPhone = null;

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['NexAI CRM Core', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = 'qr_ready';
      latestQR = await qrcode.toDataURL(qr);
      console.log('⚡ Nuevo Código QR generado para escanear en WhatsApp Web.');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      connectionStatus = 'disconnected';
      latestQR = null;
      console.log('Conexión cerrada. Reconectando:', shouldReconnect);
      if (shouldReconnect) startWhatsApp();
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      latestQR = null;
      clientPhone = sock.user?.id?.split(':')[0];
      console.log(`🎉 ¡WhatsApp Conectado Exitosamente con el número: +${clientPhone}!`);
    }
  });

  // Escuchar mensajes entrantes y procesar con IA
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === 'notify') {
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const from = msg.key.remoteJid;
      console.log(`📩 Mensaje recibido de ${from}: ${text}`);
      
      // Enviar a inferencia de IA en Ollama VPS Local
      // sock.sendMessage(from, { text: 'Respuesta generada por Qwen 2.5 1.5B' });
    }
  });
}

// Servidor HTTP simple para exponer el estado y QR al frontend de Next.js
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/whatsapp/status') {
    res.end(JSON.stringify({
      status: connectionStatus,
      qrImageDataUrl: latestQR,
      phoneNumber: clientPhone,
    }));
  } else {
    res.end(JSON.stringify({ app: 'NexAI Baileys Gateway', version: '5.5.0' }));
  }
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Servidor Baileys QR Gateway corriendo en http://localhost:${PORT}`);
  startWhatsApp();
});
