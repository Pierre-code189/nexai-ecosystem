# NexAI Ecosystem — Guía de Arquitectura y Despliegue en VPS (Self-Hosted)
**Autor:** Gian Pierre Sernaqué Wong (Pierre)  
**Entorno:** Ubuntu Linux (KVM VPS) — 4GB RAM + 4GB Swap / 60GB NVMe

---

## 🏛️ 1. Arquitectura del Ecosistema Unificado

Todos los microservicios se ejecutan de manera coordinada y persistente en tu propio servidor VPS:

| Servicio | Puerto Local | Tecnología | Rol en la Plataforma |
| :--- | :---: | :--- | :--- |
| **NexAI Web Builder** | `3000` | Next.js 14 Standalone | Portal SaaS de creación de páginas web, editor visual en vivo y exportador `.ZIP`. |
| **NexAI CRM Core** | `3001` | Next.js 14 Standalone | Panel Multi-Tenant, embudo Kanban de ventas, gestión de contactos y métricas. |
| **NexAI WhatsApp Bot** | `3002` | Node.js + Baileys WS | Bot de mensajería 24/7, validación OCR de pagos Yape/Plin y multiasesor. |
| **Motor de IA Local** | `11434` | Ollama (`qwen2.5:1.5b`) | Inferencia de IA ultraligera local a costo $0.00 en CPU (~1.2GB RAM). |
| **Nginx Reverse Proxy** | `80` / `443` | Nginx HTTP/WS Proxy | Enrutamiento unificado de dominios y certificados SSL automáticos. |

---

## 🚀 2. Despliegue en 1 Solo Comando en el VPS

En la terminal de tu servidor (`ssh root@82.39.109.192`):

```bash
chmod +x /root/nexai/deploy-vps.sh
/root/nexai/deploy-vps.sh
```

---

## 📊 3. Comandos de Gestión y Monitoreo

* **Ver estado de los procesos:**
  ```bash
  pm2 status
  ```
* **Ver logs y respuestas de WhatsApp en tiempo real:**
  ```bash
  pm2 logs nexai-whatsapp-bot
  ```
* **Reiniciar todo el ecosistema:**
  ```bash
  pm2 restart all
  ```
* **Comprobar consumo de memoria:**
  ```bash
  free -h
  ```
