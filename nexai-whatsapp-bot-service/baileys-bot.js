/**
 * ==============================================================================
 * NEXAI WHATSAPP BOT — CON HEARTBEAT EN TIEMPO REAL & AUTO-SINCRONIZACIÓN
 * ==============================================================================
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcodeTerminal = require('qrcode-terminal');
const qrcode = require('qrcode');
const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, doc, setDoc, onSnapshot, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC25Nr1jm3Y27e888Jod1jNZgcLA5SFfmU',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nexai-crm-database.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nexai-crm-database',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'nexai-crm-database.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '99918788107',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:99918788107:web:35de4dec97ebb030b0b90e',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let currentOllamaUrl = process.env.OLLAMA_API_URL || '';
let currentGroqKey = process.env.GROQ_API_KEY || '';
let currentModelName = process.env.OLLAMA_MODEL_NAME || 'qwen2.5:1.5b';
let isSocketConnected = false;
let currentConnectedPhone = null;

// Auto-Sync IA Listener
function startCloudAISyncListener() {
  try {
    const configDocRef = doc(db, 'system', 'ai_server_config');
    getDoc(configDocRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.ollamaApiUrl) currentOllamaUrl = data.ollamaApiUrl.trim();
        if (data.groqApiKey) currentGroqKey = data.groqApiKey.trim();
        if (data.modelName) currentModelName = data.modelName.trim();
      }
    }).catch(() => {});

    onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.ollamaApiUrl && data.ollamaApiUrl.trim() !== currentOllamaUrl) {
          currentOllamaUrl = data.ollamaApiUrl.trim();
          console.log('\n🔄 [AUTO-SYNC IA] Nueva URL de Colab recibida:', currentOllamaUrl);
        }
        if (data.groqApiKey) currentGroqKey = data.groqApiKey.trim();
      }
    });
  } catch (e) {
    console.warn('Aviso listener Firestore:', e.message);
  }
}

async function updateGatewayStateInFirestore(statusData) {
  try {
    const statusRef = doc(db, 'system', 'whatsapp_gateway_status');
    await setDoc(statusRef, {
      ...statusData,
      lastHeartbeat: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn('Advertencia actualizando estado en Firestore:', e.message);
  }
}

// Heartbeat periódico (cada 10 segundos) mientras el bot esté en ejecución
setInterval(() => {
  if (isSocketConnected) {
    updateGatewayStateInFirestore({
      status: 'connected',
      phoneNumber: currentConnectedPhone,
    });
  }
}, 10000);

// Limpieza de estado al cerrar la terminal (Ctrl + C)
async function handleExitCleanly() {
  console.log('\n🛑 Desconectando bot y actualizando estado en Firestore...');
  isSocketConnected = false;
  await updateGatewayStateInFirestore({
    status: 'disconnected',
    qrImageDataUrl: null,
  });
  process.exit(0);
}

process.on('SIGINT', handleExitCleanly);
process.on('SIGTERM', handleExitCleanly);

async function startBot() {
  console.log('\n=================================================================');
  console.log('🚀 INICIANDO BOT DE WHATSAPP CONECTADO A GOOGLE COLAB VPS CPU (Qwen 1.5B)');
  console.log('🔥 Base de Datos: nexai-crm-database (Heartbeat Activo)');
  console.log('=================================================================\n');

  startCloudAISyncListener();
  await updateGatewayStateInFirestore({ status: 'connecting', qrImageDataUrl: null });

  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_local');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['NexAI CRM Core', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      isSocketConnected = false;
      console.log('\n📲 [NUEVO CÓDIGO QR GENERADO]');
      console.log('1. Abre WhatsApp en tu celular > Dispositivos vinculados > Vincular');
      console.log('2. Escanéalo en la terminal o míralo en vivo en el CRM:\n');
      qrcodeTerminal.generate(qr, { small: true });

      try {
        const qrDataUrl = await qrcode.toDataURL(qr, { margin: 1, width: 260 });
        await updateGatewayStateInFirestore({
          status: 'qr_ready',
          qrImageDataUrl: qrDataUrl,
          qrRawString: qr,
        });
      } catch (e) {
        console.error('Error generando QR DataURL:', e);
      }
    }

    if (connection === 'close') {
      isSocketConnected = false;
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ Conexión cerrada. Reconectando:', shouldReconnect);
      await updateGatewayStateInFirestore({ status: 'disconnected', qrImageDataUrl: null });
      if (shouldReconnect) setTimeout(startBot, 3000);
    } else if (connection === 'open') {
      isSocketConnected = true;
      const phone = sock.user?.id?.split(':')[0];
      currentConnectedPhone = `+${phone}`;
      console.log('\n=================================================================');
      console.log(`🎉 ¡WHATSAPP VINCULADO CON ÉXITO AL NÚMERO: +${phone}!`);
      console.log('🤖 El bot de IA está respondiendo mensajes 24/7...');
      console.log('=================================================================\n');

      await updateGatewayStateInFirestore({
        status: 'connected',
        phoneNumber: `+${phone}`,
        qrImageDataUrl: null,
        connectedAt: new Date().toISOString(),
      });
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === 'notify') {
      const from = msg.key.remoteJid;
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

      if (!text) return;
      console.log(`\n📩 [Mensaje de ${from}]: "${text}"`);

      try {
        await sock.sendPresenceUpdate('composing', from);
      } catch {}

      const systemPrompt = 'Eres el asistente comercial inteligente de NexCRM. Atiende con amabilidad en español peruano, resuelve dudas de productos, precios y ayuda a cerrar ventas con Yape o Plin.';

      // 1. GPU Colab
      if (currentOllamaUrl) {
        try {
          console.log(`🧠 Consultando Ollama VPS Local [${currentOllamaUrl}] (${currentModelName})...`);
          const response = await fetch(`${currentOllamaUrl.replace(/\/$/, '')}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: currentModelName || 'qwen2.5:1.5b',
              system: systemPrompt,
              prompt: text,
              stream: false,
            }),
            signal: AbortSignal.timeout(25000),
          });

          if (response.ok) {
            const data = await response.json();
            const aiReply = data.response;
            if (aiReply && aiReply.trim()) {
              console.log(`🤖 [Respuesta IA GPU]: "${aiReply.trim()}"`);
              await sock.sendMessage(from, { text: aiReply.trim() });
              console.log('✅ Mensaje enviado al cliente por WhatsApp.');
              return;
            }
          }
        } catch (err) {
          console.warn('⚠️ Ollama VPS Local no disponible:', err.message);
        }
      }

      // 2. Groq Cloud Fallback
      if (currentGroqKey) {
        try {
          console.log('⚡ Consultando Groq Cloud (Llama 3.1 70B)...');
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${currentGroqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
              ],
              temperature: 0.3,
              max_tokens: 200,
            }),
            signal: AbortSignal.timeout(8000),
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            const groqReply = groqData.choices?.[0]?.message?.content;
            if (groqReply && groqReply.trim()) {
              console.log(`🤖 [Respuesta Groq]: "${groqReply.trim()}"`);
              await sock.sendMessage(from, { text: groqReply.trim() });
              return;
            }
          }
        } catch {}
      }

      // 3. Fallback Local
      const lower = text.toLowerCase();
      let fallbackText = '¡Hola! Gracias por comunicarte. Con mucho gusto te ayudamos con tu pedido o consulta. ¿En qué podemos asesorarte hoy?';
      if (lower.includes('precio') || lower.includes('costo') || lower.includes('carta')) {
        fallbackText = '¡Hola! Con gusto te compartimos nuestros productos y opciones disponibles con pago por Yape o Plin. ¿Qué producto deseas ordenar?';
      }
      console.log(`🤖 [Respuesta Local]: "${fallbackText}"`);
      await sock.sendMessage(from, { text: fallbackText });
    }
  });
}

startBot();
